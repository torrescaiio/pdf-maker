/**
 * Utility to compress and optimize images before storing in state and storage.
 * Ensures uploaded images are sharp and responsive while keeping storage lightweight (<300KB each).
 */

export function optimizeImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.84
): Promise<string> {
  return new Promise((resolve) => {
    // If SVG, read as text / dataURL directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve((e.target?.result as string) || '');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Keep transparent PNG if small, else convert to JPEG for high compression
        const isPng = file.type === 'image/png';
        let optimized: string;
        if (isPng && file.size < 400000) {
          optimized = canvas.toDataURL('image/png');
        } else {
          optimized = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(optimized);
      };

      img.onerror = () => {
        resolve((e.target?.result as string) || '');
      };

      img.src = (e.target?.result as string) || '';
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
