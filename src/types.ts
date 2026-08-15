export type RoutePath = '/' | '/jpg-to-pdf' | '/compress-pdf' | '/privacy' | '/terms';

export interface ImageFileItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  width: number;
  height: number;
  type: string;
}

export type PageSizeOption = 'auto' | 'a4';
export type OrientationOption = 'portrait' | 'landscape';
export type MarginOption = 'none' | 'small';

export interface JpgToPdfSettings {
  pageSize: PageSizeOption;
  orientation: OrientationOption;
  fitImage: boolean;
  margin: MarginOption;
}

export type CompressionLevel = 'recommended' | 'strong' | 'maximum';

export interface CompressionOptionConfig {
  id: CompressionLevel;
  label: string;
  badge: string;
  description: string;
  scaleDpi: number;
  quality: number;
}

export interface CompressionResult {
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  blob: Blob;
  downloadUrl: string;
  fileName: string;
  durationMs: number;
  isLargerOrSame?: boolean;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  jsonLd?: Record<string, unknown>;
}
