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

        const swapsDimensions = orientation >= 5 && orientation <= 8;
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        let width = swapsDimensions ? sourceHeight : sourceWidth;
        let height = swapsDimensions ? sourceWidth : sourceHeight;

        if (width > RECOMMENDED_WIDTH) {
          const scale = RECOMMENDED_WIDTH / width;
          width = RECOMMENDED_WIDTH;
          height = Math.floor(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        // 흰색 배경 설정
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

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
            ctx.transform(0, 1, -1, 0, width, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, width, height);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, height);
            break;
        }

        if (swapsDimensions) {
          ctx.drawImage(img, 0, 0, height, width);
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        resolve({
          dataUrl: canvas.toDataURL("image/jpeg", 0.95),
          width: width,
          height: height,
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
