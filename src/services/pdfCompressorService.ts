import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { CompressionLevel, CompressionOptionConfig, CompressionResult } from '../types';

// Configure pdfjs worker
try {
  // Use unpkg worker fallback matching the installed version
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization warning:', e);
}

export const COMPRESSION_OPTIONS: Record<CompressionLevel, CompressionOptionConfig> = {
  recommended: {
    id: 'recommended',
    label: 'Recommended',
    badge: 'Balanced',
    description: 'Good compression with crisp text and clean images (ideal for sharing).',
    scaleDpi: 1.25,
    quality: 0.72,
  },
  strong: {
    id: 'strong',
    label: 'Strong',
    badge: 'High Reduction',
    description: 'Noticeable reduction in size while keeping documents readable.',
    scaleDpi: 0.95,
    quality: 0.50,
  },
  maximum: {
    id: 'maximum',
    label: 'Maximum',
    badge: 'Smallest File',
    description: 'Maximum compression for strict email attachments and low bandwidth.',
    scaleDpi: 0.75,
    quality: 0.35,
  },
};

/**
 * Render a single PDF.js page to an HTML5 canvas and return JPEG Uint8Array
 */
async function renderPageToJpeg(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  page: any,
  scale: number,
  quality: number
): Promise<{ bytes: Uint8Array; width: number; height: number; originalWidth: number; originalHeight: number }> {
  const viewport = page.getViewport({ scale });
  const baseViewport = page.getViewport({ scale: 1.0 });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Canvas 2D rendering context not available.');
  }

  // Paint white background to ensure non-transparent PDF pages
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Failed to rasterize PDF page.'));
          return;
        }
        const buffer = await blob.arrayBuffer();
        resolve({
          bytes: new Uint8Array(buffer),
          width: canvas.width,
          height: canvas.height,
          originalWidth: baseViewport.width,
          originalHeight: baseViewport.height,
        });
      },
      'image/jpeg',
      quality
    );
  });
}

/**
 * Compress a user PDF file completely in the client browser
 */
export async function compressPdfFile(
  file: File,
  level: CompressionLevel = 'recommended',
  onProgress?: (progressPercent: number, stageText: string) => void
): Promise<CompressionResult> {
  const startTime = performance.now();
  const originalSize = file.size;

  if (originalSize === 0) {
    throw new Error('The selected PDF file is empty (0 bytes).');
  }

  const config = COMPRESSION_OPTIONS[level] || COMPRESSION_OPTIONS.recommended;

  if (onProgress) onProgress(5, 'Reading PDF document...');

  const arrayBuffer = await file.arrayBuffer();

  let loadingTask;
  try {
    loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/cmaps/`,
      cMapPacked: true,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/standard_fonts/`,
    });
  } catch {
    throw new Error('This PDF could not be processed in your browser. The file might be corrupted.');
  }

  let pdfDoc;
  try {
    pdfDoc = await loadingTask.promise;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    if (message.includes('Password')) {
      throw new Error('This PDF is password protected. Please unlock it before compressing.');
    }
    throw new Error('This PDF could not be opened. It may be corrupted or in an unsupported format.');
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error('This PDF document contains no pages.');
  }

  // Create new compressed target PDF document
  const newPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const pageProgress = Math.round(10 + ((pageNum - 1) / numPages) * 75);
    if (onProgress) {
      onProgress(pageProgress, `Compressing page ${pageNum} of ${numPages}...`);
    }

    const page = await pdfDoc.getPage(pageNum);
    const rendered = await renderPageToJpeg(page, config.scaleDpi, config.quality);

    // Embed the compressed JPEG stream into the new PDF
    const embeddedImg = await newPdfDoc.embedJpg(rendered.bytes);

    // Maintain the original PDF page dimensions so the document layout stays 100% natural
    const newPage = newPdfDoc.addPage([rendered.originalWidth, rendered.originalHeight]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: rendered.originalWidth,
      height: rendered.originalHeight,
    });
  }

  if (onProgress) onProgress(90, 'Optimizing stream objects and saving...');

  // Save with compressed object streams enabled
  const compressedBytes = await newPdfDoc.save({ useObjectStreams: true });
  const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
  const compressedSize = compressedBlob.size;

  const durationMs = Math.round(performance.now() - startTime);

  // If the compressed size happens to be larger than original (e.g. tiny 1-page vector PDF already 5kb),
  // we detect that honestly so we don't mislead the user.
  const isLargerOrSame = compressedSize >= originalSize;
  const reductionPercent = isLargerOrSame
    ? 0
    : Math.round(((originalSize - compressedSize) / originalSize) * 100);

  // Generate output filename
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const outFileName = `${baseName}-compressed.pdf`;
  const downloadUrl = URL.createObjectURL(compressedBlob);

  if (onProgress) onProgress(100, 'Done');

  return {
    originalSize,
    compressedSize,
    reductionPercent,
    blob: compressedBlob,
    downloadUrl,
    fileName: outFileName,
    durationMs,
    isLargerOrSame,
  };
}
