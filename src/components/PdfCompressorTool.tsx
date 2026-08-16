import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Minimize2,
  FileText,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingDown,
  Info,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CompressionLevel, CompressionResult } from '../types';
import { formatBytes, downloadBlob, isPdf } from '../utils/fileUtils';
import { compressPdfFile, COMPRESSION_OPTIONS } from '../services/pdfCompressorService';
import { trackToolOpened, trackFileSelected, trackPdfCompressed, trackDownloadClicked } from '../utils/analytics';
import { FileDropzone } from './FileDropzone';
import { PrivacyBanner } from './PrivacyBanner';
import { SeoContentSection } from './SeoContentSection';

export const PdfCompressorTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result state
  const [result, setResult] = useState<CompressionResult | null>(null);

  // Track tool opened on mount
  useEffect(() => {
    trackToolOpened('pdf_compressor');
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setErrorMessage(null);
    const file = files[0];
    if (!file) return;

    if (!isPdf(file)) {
      setErrorMessage('Please select a valid PDF document (.pdf).');
      return;
    }

    if (file.size > 200 * 1024 * 1024) {
      setErrorMessage('This file is extremely large (>200 MB). Try a smaller file for browser memory stability.');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    trackFileSelected('pdf_compressor');
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgressPercent(5);
    setStatusMessage('Preparing PDF...');
    setErrorMessage(null);

    try {
      const compressionResult = await compressPdfFile(
        selectedFile,
        compressionLevel,
        (percent, stageText) => {
          setProgressPercent(percent);
          setStatusMessage(stageText);
        }
      );

      setResult(compressionResult);
      trackPdfCompressed();

      if (!compressionResult.isLargerOrSame) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
          });
        } catch {
          // Fallback
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'This PDF could not be processed in your browser. Try a different file.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    trackDownloadClicked('pdf_compressor');
    downloadBlob(result.blob, result.fileName);
  };

  const handleReset = () => {
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setProgressPercent(0);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold">
          <Minimize2 className="w-3.5 h-3.5 text-neutral-700" />
          <span>Browser PDF Compressor</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
          Compress PDF Online
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-lg mx-auto">
          Reduce PDF file size directly in your browser without uploading to any server. Fast, safe, and private.
        </p>
      </div>

      {/* Privacy Notice */}
      <PrivacyBanner compact />

      {/* Error Alert */}
      {errorMessage && (
        <div
          id="compress-error-banner"
          className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Compression error</p>
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

      {/* Step 1: Dropzone when no file selected */}
      {!selectedFile && !result && (
        <FileDropzone
          id="compress-pdf-dropzone"
          accept=".pdf"
          multiple={false}
          title="Select PDF file to compress"
          subtitle="Drag &amp; drop your PDF here or click to browse"
          buttonText="Choose PDF"
          onFilesSelected={handleFilesSelected}
        />
      )}

      {/* Step 2: File Selected & Compression Level Options */}
      {selectedFile && !result && !isProcessing && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Selected File Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200/70">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-sm sm:text-base text-neutral-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-neutral-500 font-medium">
                  Original size: <strong className="text-neutral-700">{formatBytes(selectedFile.size)}</strong>
                </p>
              </div>
            </div>

            <button
              id="btn-change-file"
              onClick={handleReset}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:underline cursor-pointer flex-shrink-0 ml-4"
            >
              Change File
            </button>
          </div>

          {/* Compression Level Selector Cards */}
          <div className="space-y-3">
            <label className="block font-heading font-bold text-sm text-neutral-900">
              Select Compression Level
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(COMPRESSION_OPTIONS) as CompressionLevel[]).map((levelKey) => {
                const opt = COMPRESSION_OPTIONS[levelKey];
                const isSelected = compressionLevel === levelKey;
                return (
                  <div
                    key={levelKey}
                    id={`option-${levelKey}`}
                    onClick={() => setCompressionLevel(levelKey)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="font-heading font-bold text-base">
                          {opt.label}
                        </span>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs leading-relaxed ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-600'
                        }`}
                      >
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Processed 100% locally in browser</span>
            </div>

            <button
              id="btn-start-compression"
              onClick={handleCompress}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Compress PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Processing Screen */}
      {isProcessing && (
        <div
          id="compress-processing-panel"
          className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center space-y-6 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center mx-auto animate-pulse">
            <Minimize2 className="w-8 h-8" />
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
              <span>Client-side optimization</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Done / Download Result Screen */}
      {result && !isProcessing && (
        <div
          id="compress-done-panel"
          className="bg-white rounded-2xl border-2 border-emerald-500/80 p-6 sm:p-10 space-y-8 shadow-md"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Done
            </span>
            <h3 className="font-heading font-bold text-2xl text-neutral-900">
              {result.isLargerOrSame ? 'PDF Processed' : 'PDF Compressed Successfully!'}
            </h3>
          </div>

          {/* Size Comparison Card */}
          <div className="bg-neutral-50 rounded-2xl p-5 sm:p-6 border border-neutral-200/80">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
              {/* Original */}
              <div className="py-2 sm:py-0">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Original
                </span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-neutral-700 block">
                  {formatBytes(result.originalSize)}
                </span>
              </div>

              {/* Compressed */}
              <div className="py-2 sm:py-0 sm:px-4">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Compressed
                </span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-emerald-700 block">
                  {formatBytes(result.compressedSize)}
                </span>
              </div>

              {/* Reduction */}
              <div className="py-2 sm:py-0 sm:px-4 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Size Reduction
                </span>
                {result.reductionPercent > 0 ? (
                  <span className="inline-flex items-center gap-1 font-heading font-bold text-xl sm:text-2xl text-emerald-600">
                    <TrendingDown className="w-5 h-5" />
                    Reduced by {result.reductionPercent}%
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-neutral-600">
                    Already minimal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Honest Notice if PDF couldn't be meaningfully reduced */}
          {result.isLargerOrSame && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Notice:</strong> This PDF is already highly optimized with vector graphics or pre-compressed assets. Re-encoding did not yield a smaller file size. You can download the output or keep your original file.
              </p>
            </div>
          )}

          {/* Download & Reset CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-download-compressed-pdf"
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Download className="w-5 h-5" />
              <span>Download Compressed PDF</span>
            </button>

            <button
              id="btn-compress-start-over"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      )}

      {/* SEO & Educational Content Section below */}
      <SeoContentSection tool="compress-pdf" />
    </div>
  );
};
