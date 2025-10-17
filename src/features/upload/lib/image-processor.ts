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

        // 리사이즈만 수행 (EXIF 회전 처리 제거)
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

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);

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
