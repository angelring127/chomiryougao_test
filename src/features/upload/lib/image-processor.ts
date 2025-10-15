const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const RECOMMENDED_WIDTH = 640;

export interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
}

export interface ValidationError {
  type: "fileSize" | "fileType" | "noFace" | "multipleFaces" | "generic";
  message: string;
}

export async function validateFile(
  file: File
): Promise<ValidationError | null> {
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: "fileSize",
      message: "File size exceeds 5MB",
    };
  }

  if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
    return {
      type: "fileType",
      message: "Only JPG and PNG files are supported",
    };
  }

  return null;
}

function getOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const view = new DataView(e.target?.result as ArrayBuffer);

      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(1);
        return;
      }

      const length = view.byteLength;
      let offset = 2;

      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) {
          resolve(1);
          return;
        }

        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
          const little = view.getUint16(offset + 8, false) === 0x4949;
          offset += view.getUint16(offset, false);
          const tags = view.getUint16(offset, little);
          offset += 2;

          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little));
              return;
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }

      resolve(1);
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function processImage(file: File): Promise<ProcessedImage> {
  const orientation = await getOrientation(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        let { width, height } = img;

        // EXIF方向補正
        if (orientation > 4) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width);
            break;
        }

        ctx.drawImage(img, 0, 0);

        // リサイズ（推奨サイズより大きい場合）
        if (width > RECOMMENDED_WIDTH) {
          const scale = RECOMMENDED_WIDTH / width;
          const newWidth = RECOMMENDED_WIDTH;
          const newHeight = Math.floor(height * scale);

          const resizeCanvas = document.createElement("canvas");
          resizeCanvas.width = newWidth;
          resizeCanvas.height = newHeight;
          const resizeCtx = resizeCanvas.getContext("2d");

          if (resizeCtx) {
            resizeCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

            resolve({
              dataUrl: resizeCanvas.toDataURL("image/jpeg", 0.9),
              width: newWidth,
              height: newHeight,
            });
            return;
          }
        }

        resolve({
          dataUrl: canvas.toDataURL("image/jpeg", 0.9),
          width: canvas.width,
          height: canvas.height,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}
