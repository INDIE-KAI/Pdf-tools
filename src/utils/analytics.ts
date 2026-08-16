/**
 * Google Analytics 4 (GA4) Client-Side Tracking Utility
 * 
 * Strict Privacy Design:
 * Only anonymous product-usage events are tracked.
 * NEVER transmits filenames, file contents, file paths, document text,
 * or personally identifiable information.
 */

export type ToolType = 'jpg_to_pdf' | 'pdf_compressor';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Safely send an event to GA4 via gtag
 */
function sendGaEvent(eventName: string, params: Record<string, unknown>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    } else if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(['event', eventName, params]);
    }
  } catch (error) {
    // Fail silently so ad-blockers or analytics network errors never impact application features
    console.debug('[Analytics] Failed to send event:', error);
  }
}

/**
 * 1. tool_opened: Fire when a user actually opens / starts using one of the two tools.
 */
export function trackToolOpened(tool: ToolType): void {
  sendGaEvent('tool_opened', { tool });
}

/**
 * 2. file_selected: Fire when the user successfully selects a supported file.
 * Parameter: tool only (strictly no filenames, sizes, paths, or contents).
 */
export function trackFileSelected(tool: ToolType): void {
  sendGaEvent('file_selected', { tool });
}

/**
 * 3. pdf_created: Fire only after JPG/PNG -> PDF successfully completes.
 */
export function trackPdfCreated(): void {
  sendGaEvent('pdf_created', { tool: 'jpg_to_pdf' });
}

/**
 * 4. pdf_compressed: Fire only after PDF compression successfully completes.
 */
export function trackPdfCompressed(): void {
  sendGaEvent('pdf_compressed', { tool: 'pdf_compressor' });
}

/**
 * 5. download_clicked: Fire when the user clicks the final download button.
 */
export function trackDownloadClicked(tool: ToolType): void {
  sendGaEvent('download_clicked', { tool });
}
