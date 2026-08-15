import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileImage,
  ArrowUpDown,
  Trash2,
  Download,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  MoveUp,
  MoveDown,
  Layers,
} from 'lucide-react';
import { ImageFileItem, JpgToPdfSettings, PageSizeOption, OrientationOption, MarginOption } from '../types';
import { formatBytes, downloadBlob, isSupportedImage, getImageDimensions } from '../utils/fileUtils';
import { convertImagesToPdf } from '../services/imageToPdfService';
import { FileDropzone } from './FileDropzone';
import { PrivacyBanner } from './PrivacyBanner';
import { SeoContentSection } from './SeoContentSection';

export const JpgToPdfTool: React.FC = () => {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [settings, setSettings] = useState<JpgToPdfSettings>({
    pageSize: 'a4',
    orientation: 'portrait',
    fitImage: true,
    margin: 'none',
  });
  const [showSettings, setShowSettings] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);
  const [generatedPdfSize, setGeneratedPdfSize] = useState<number>(0);
  const [generatedPdfName, setGeneratedPdfName] = useState<string>('converted.pdf');

  // Drag and drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [images]);

  const handleFilesSelected = async (files: File[]) => {
    setErrorMessage(null);
    const validFiles = files.filter(isSupportedImage);

    if (validFiles.length === 0) {
      setErrorMessage('Please select valid JPG, JPEG, or PNG images.');
      return;
    }

    try {
      const newItems: ImageFileItem[] = [];
      for (const file of validFiles) {
        const { width, height, url } = await getImageDimensions(file);
        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl: url,
          name: file.name,
          size: file.size,
          width,
          height,
          type: file.type,
        });
      }
      setImages((prev) => [...prev, ...newItems]);
    } catch {
      setErrorMessage('One or more images could not be loaded. Please try again.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    handleMoveImage(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setProgressPercent(0);
    setStatusMessage('Preparing images...');
    setErrorMessage(null);

    try {
      const pdfBlob = await convertImagesToPdf(images, settings, (percent, currentIdx) => {
        setProgressPercent(percent);
        setStatusMessage(`Processing image ${currentIdx} of ${images.length}...`);
      });

      setGeneratedPdfBlob(pdfBlob);
      setGeneratedPdfSize(pdfBlob.size);

      // Name PDF based on first image
      const firstBase = images[0].name.replace(/\.[^/.]+$/, '');
      const outName = images.length > 1 ? `${firstBase}-and-${images.length - 1}-more.pdf` : `${firstBase}.pdf`;
      setGeneratedPdfName(outName);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe fallback
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate PDF. Please check your files.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!generatedPdfBlob) return;
    downloadBlob(generatedPdfBlob, generatedPdfName);
  };

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setGeneratedPdfBlob(null);
    setGeneratedPdfSize(0);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
          <FileImage className="w-3.5 h-3.5 text-neutral-700" />
          <span>Image to PDF Converter</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
          Convert Images to PDF
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-lg mx-auto">
          Convert JPG and PNG images into a clean, multi-page PDF document. 100% private, processed in your browser.
        </p>
      </div>

      {/* Privacy Notice */}
      <PrivacyBanner compact />

      {/* Error Alert */}
      {errorMessage && (
        <div
          id="error-banner"
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to process files</p>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* State 1: Dropzone when no images uploaded */}
      {images.length === 0 && !generatedPdfBlob && (
        <FileDropzone
          id="jpg-to-pdf-dropzone"
          accept=".jpg,.jpeg,.png,.webp"
          multiple={true}
          title="Select JPG or PNG images"
          subtitle="Drag &amp; drop images here or click to browse"
          buttonText="Choose Images"
          onFilesSelected={handleFilesSelected}
        />
      )}

      {/* State 2: Images selected & ready for customization/creation */}
      {images.length > 0 && !generatedPdfBlob && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-5 sm:p-7 space-y-6">
          {/* Top Bar: Count + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg text-neutral-900">
                {images.length} {images.length === 1 ? 'Image' : 'Images'} Selected
              </span>
              <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                Total: {formatBytes(images.reduce((acc, img) => acc + img.size, 0))}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Add more files */}
              <FileDropzone
                id="add-more-images"
                accept=".jpg,.jpeg,.png,.webp"
                multiple={true}
                title="Add More"
                subtitle=""
                buttonText="Add Images"
                compact={true}
                onFilesSelected={handleFilesSelected}
                className="py-1.5 px-3"
              />

              {/* Toggle Settings */}
              <button
                id="toggle-pdf-settings"
                onClick={() => setShowSettings(!showSettings)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  showSettings
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>

              {/* Clear All */}
              <button
                id="clear-all-images"
                onClick={handleReset}
                className="px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Simple Optional Settings Panel */}
          {showSettings && (
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Document Settings
                </span>
                <span className="text-[11px] text-neutral-500">Optional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Page Size */}
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1.5">Page Size</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-neutral-200/70 p-1 rounded-lg">
                    {(['a4', 'auto'] as PageSizeOption[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSettings((s) => ({ ...s, pageSize: size }))}
                        className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                          settings.pageSize === size
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orientation (Only for A4) */}
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1.5">Orientation</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-neutral-200/70 p-1 rounded-lg">
                    {(['portrait', 'landscape'] as OrientationOption[]).map((orient) => (
                      <button
                        key={orient}
                        disabled={settings.pageSize === 'auto'}
                        onClick={() => setSettings((s) => ({ ...s, orientation: orient }))}
                        className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer capitalize ${
                          settings.pageSize === 'auto'
                            ? 'opacity-40 cursor-not-allowed'
                            : settings.orientation === orient
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {orient}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margin */}
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1.5">Page Margin</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-neutral-200/70 p-1 rounded-lg">
                    {(['none', 'small'] as MarginOption[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSettings((s) => ({ ...s, margin: m }))}
                        className={`py-1.5 rounded-md font-semibold transition-all cursor-pointer capitalize ${
                          settings.margin === m
                            ? 'bg-white text-neutral-900 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Thumbnails Reordering Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Drag or use arrows to reorder pages
              </span>
              <span>1 image = 1 PDF page</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto p-1">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative rounded-xl border p-2 bg-neutral-50/50 hover:bg-neutral-100 transition-all flex flex-col justify-between ${
                    draggedIndex === index
                      ? 'opacity-40 border-dashed border-neutral-900 scale-95'
                      : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
                  }`}
                >
                  {/* Page Number Badge */}
                  <div className="absolute top-3 left-3 z-10 w-6 h-6 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {index + 1}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-3 right-3 z-10 w-6 h-6 rounded-md bg-white/90 text-neutral-700 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Thumbnail */}
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-200 mb-2 flex items-center justify-center">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info & Reorder Controls */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-neutral-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{formatBytes(item.size)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveImage(index, index - 1)}
                          title="Move Up"
                          className="p-1 rounded bg-white hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={index === images.length - 1}
                          onClick={() => handleMoveImage(index, index + 1)}
                          title="Move Down"
                          className="p-1 rounded bg-white hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Create Action */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Ready to assemble {images.length} pages</span>
            </div>

            <button
              id="btn-create-pdf"
              disabled={isProcessing}
              onClick={handleGeneratePdf}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>Create PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* State 3: Processing State */}
      {isProcessing && (
        <div
          id="processing-state-panel"
          className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center mx-auto animate-pulse">
            <FileImage className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-bold text-xl text-neutral-900">
              Processing…
            </h3>
            <p className="text-sm text-neutral-600">{statusMessage}</p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-neutral-900 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-500 font-medium">
              <span>Client-side rendering</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* State 4: Done / Download State */}
      {generatedPdfBlob && !isProcessing && (
        <div
          id="done-state-panel"
          className="bg-white rounded-2xl border-2 border-emerald-500/80 p-8 sm:p-10 text-center space-y-6 shadow-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Done
            </span>
            <h3 className="font-heading font-bold text-2xl text-neutral-900">
              Your PDF is Ready!
            </h3>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              {images.length} {images.length === 1 ? 'page' : 'pages'} compiled successfully ({formatBytes(generatedPdfSize)}).
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-download-pdf"
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>

            <button
              id="btn-start-over"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      )}

      {/* SEO & Informative Content Section below */}
      <SeoContentSection tool="jpg-to-pdf" />
    </div>
  );
};
