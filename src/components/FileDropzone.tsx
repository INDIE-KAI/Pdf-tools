import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Plus, AlertCircle, FileCheck2 } from 'lucide-react';

interface FileDropzoneProps {
  id: string;
  accept: string;
  multiple?: boolean;
  title: string;
  subtitle: string;
  buttonText: string;
  onFilesSelected: (files: File[]) => void;
  className?: string;
  compact?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  id,
  accept,
  multiple = false,
  title,
  subtitle,
  buttonText,
  onFilesSelected,
  className = '',
  compact = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragError(null);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!droppedFiles.length) return;

    if (!multiple && droppedFiles.length > 1) {
      onFilesSelected([droppedFiles[0]]);
      return;
    }

    onFilesSelected(droppedFiles);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDragError(null);
    if (!e.target.files?.length) return;
    const selectedFiles = Array.from(e.target.files);
    onFilesSelected(selectedFiles);
    // Reset value so selecting the same file again triggers change
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerSelect = () => {
    inputRef.current?.click();
  };

  if (compact) {
    return (
      <div
        id={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerSelect}
        className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all ${
          isDragOver
            ? 'border-neutral-900 bg-neutral-100 scale-[1.01]'
            : 'border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50/80'
        } ${className}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          aria-label={title}
        />
        <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center flex-shrink-0">
          <Plus className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold text-neutral-900 block">{title}</span>
          <span className="text-xs text-neutral-500">{subtitle}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer group ${
        isDragOver
          ? 'border-neutral-900 bg-neutral-100/90 shadow-md ring-4 ring-neutral-200'
          : 'border-neutral-300 hover:border-neutral-400 bg-white shadow-sm hover:shadow'
      } ${className}`}
      onClick={triggerSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerSelect();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        aria-label={title}
      />

      <div className="flex flex-col items-center justify-center max-w-md mx-auto pointer-events-none">
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 ${
            isDragOver
              ? 'bg-neutral-900 text-white scale-110'
              : 'bg-neutral-100 text-neutral-700 group-hover:scale-105 group-hover:bg-neutral-200'
          }`}
        >
          {isDragOver ? (
            <FileCheck2 className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
          ) : (
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-800" />
          )}
        </div>

        <h3 className="font-heading font-bold text-lg sm:text-xl text-neutral-900 mb-2">
          {title}
        </h3>

        <p className="text-sm text-neutral-600 mb-6 max-w-sm leading-relaxed">
          {subtitle}
        </p>

        <button
          type="button"
          tabIndex={-1}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold shadow-sm group-hover:bg-neutral-800 transition-all pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            triggerSelect();
          }}
        >
          <Plus className="w-4 h-4" />
          {buttonText}
        </button>

        <div className="mt-4 text-xs text-neutral-600 flex items-center gap-1.5 font-medium">
          <span>Supported: {accept.replace(/\./g, ' ').toUpperCase()}</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">100% Client-Side</span>
        </div>
      </div>

      {dragError && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {dragError}
        </div>
      )}
    </div>
  );
};
