/**
 * Utility to compress and resize images client-side before storing or transmitting.
 * Prevents browser LocalStorage QuotaExceededError and ensures lightning-fast rendering.
 */
export interface CompressionResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<CompressionResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  // If it's a PDF or non-image, read directly as data URL without canvas resizing
  if (!file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          originalSizeKb,
          compressedSizeKb: Math.round((dataUrl.length * 0.75) / 1024),
          width: 0,
          height: 0
        });
      };
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo selecionado.'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const rawUrl = e.target?.result as string;
          resolve({
            dataUrl: rawUrl,
            originalSizeKb,
            compressedSizeKb: Math.round((rawUrl.length * 0.75) / 1024),
            width: img.width,
            height: img.height
          });
          return;
        }

        // Draw image smoothly onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG format
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const compressedSizeKb = Math.round((dataUrl.length * 0.75) / 1024);

        resolve({
          dataUrl,
          originalSizeKb,
          compressedSizeKb,
          width,
          height
        });
      };

      img.onerror = () => {
        reject(new Error('Não foi possível processar a imagem selecionada.'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo da imagem.'));
    reader.readAsDataURL(file);
  });
}
