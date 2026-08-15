import { PDFDocument } from 'pdf-lib';
import { ImageFileItem, JpgToPdfSettings } from '../types';

/**
 * Convert image element or blob into Uint8Array buffer via canvas if needed
 */
async function getCleanImageBytes(
  fileItem: ImageFileItem,
  asType: 'jpeg' | 'png' = 'jpeg',
  quality = 0.92
): Promise<{ bytes: Uint8Array; type: 'jpeg' | 'png'; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable in your browser.'));
        return;
      }

      // If jpeg, paint white background so PNG transparency doesn't turn black
      if (asType === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mime = asType === 'png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error(`Failed to process image ${fileItem.name}`));
            return;
          }
          const buffer = await blob.arrayBuffer();
          resolve({
            bytes: new Uint8Array(buffer),
            type: asType,
            width: canvas.width,
            height: canvas.height,
          });
        },
        mime,
        quality
      );
    };
    img.onerror = () => {
      reject(new Error(`Could not load image ${fileItem.name}`));
    };
    img.src = fileItem.previewUrl;
  });
}

/**
 * Generate a PDF from a list of image items with chosen settings
 */
export async function convertImagesToPdf(
  images: ImageFileItem[],
  settings: JpgToPdfSettings,
  onProgress?: (progressPercent: number, currentItemIndex: number) => void
): Promise<Blob> {
  if (!images || images.length === 0) {
    throw new Error('Please select at least one image.');
  }

  const pdfDoc = await PDFDocument.create();

  // A4 standard points: 72 points per inch (595.28 x 841.89)
  const A4_PORTRAIT: [number, number] = [595.28, 841.89];
  const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

  const total = images.length;

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    if (onProgress) {
      onProgress(Math.round(((i + 0.2) / total) * 100), i);
    }

    let embeddedImage;
    let imgWidth = item.width;
    let imgHeight = item.height;

    // Try embedding raw bytes first for speed & direct quality preservation
    try {
      const rawBuffer = await item.file.arrayBuffer();
      const isPng = item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png');
      if (isPng) {
        embeddedImage = await pdfDoc.embedPng(rawBuffer);
      } else {
        embeddedImage = await pdfDoc.embedJpg(rawBuffer);
      }
      imgWidth = embeddedImage.width;
      imgHeight = embeddedImage.height;
    } catch {
      // Fallback: rasterize cleanly via canvas to avoid corrupt/unsupported color profiles
      const isPng = item.file.type === 'image/png' || item.name.toLowerCase().endsWith('.png');
      const cleanData = await getCleanImageBytes(item, isPng ? 'png' : 'jpeg');
      if (cleanData.type === 'png') {
        embeddedImage = await pdfDoc.embedPng(cleanData.bytes);
      } else {
        embeddedImage = await pdfDoc.embedJpg(cleanData.bytes);
      }
      imgWidth = cleanData.width;
      imgHeight = cleanData.height;
    }

    // Determine Page Dimensions
    let pageWidth: number;
    let pageHeight: number;
    let margin = 0;

    if (settings.pageSize === 'a4') {
      const isLandscape = settings.orientation === 'landscape';
      [pageWidth, pageHeight] = isLandscape ? A4_LANDSCAPE : A4_PORTRAIT;
      if (settings.margin === 'small') {
        margin = 24; // 24 points margin
      }
    } else {
      // Auto page sizing based on image dimensions
      if (settings.margin === 'small') {
        margin = 20;
      }
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const usableWidth = Math.max(10, pageWidth - margin * 2);
    const usableHeight = Math.max(10, pageHeight - margin * 2);

    let drawWidth = imgWidth;
    let drawHeight = imgHeight;

    if (settings.fitImage || settings.pageSize === 'a4') {
      // Scale while preserving aspect ratio
      const scale = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
      drawWidth = imgWidth * scale;
      drawHeight = imgHeight * scale;
    }

    // Center image within the usable bounds
    const x = margin + (usableWidth - drawWidth) / 2;
    const y = margin + (usableHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / total) * 100), i + 1);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
