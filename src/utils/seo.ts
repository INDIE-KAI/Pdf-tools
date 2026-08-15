import { useEffect } from 'react';
import { RoutePath, SeoMetadata } from '../types';

const BASE_URL = 'https://ais-pre-wukvddyym5cywb5eaqgcnw-290485625799.asia-southeast1.run.app';

export const SEO_DATA: Record<RoutePath, SeoMetadata> = {
  '/': {
    title: 'Free PDF Tools – JPG to PDF & PDF Compressor',
    description:
      'Convert JPG and PNG images to PDF and compress PDF files directly in your browser. Free, private and no file uploads.',
    canonical: `${BASE_URL}/`,
    ogTitle: 'Free PDF Tools – JPG to PDF & PDF Compressor',
    ogDescription:
      'Convert JPG and PNG images to PDF and compress PDF files directly in your browser. Free, private and no file uploads.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Free PDF Tools',
      url: `${BASE_URL}/`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All modern web browsers',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Client-side PDF tools to convert images to PDF and compress PDFs locally in browser.',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
    },
  },
  '/jpg-to-pdf': {
    title: 'JPG to PDF Converter – Convert Images to PDF Online',
    description:
      'Convert JPG and PNG images to a PDF directly in your browser. Combine multiple images, reorder them and download your PDF.',
    canonical: `${BASE_URL}/jpg-to-pdf`,
    ogTitle: 'JPG to PDF Converter – Convert Images to PDF Online',
    ogDescription:
      'Convert JPG and PNG images to a PDF directly in your browser. Combine multiple images, reorder them and download your PDF.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'JPG to PDF Converter',
      url: `${BASE_URL}/jpg-to-pdf`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All modern web browsers',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Convert JPG and PNG images into a single PDF directly in your browser. Fast, free, and private.',
    },
  },
  '/compress-pdf': {
    title: 'PDF Compressor – Compress PDF Files Online',
    description:
      'Compress PDF files directly in your browser without uploading them. Reduce PDF file size while keeping your files private.',
    canonical: `${BASE_URL}/compress-pdf`,
    ogTitle: 'PDF Compressor – Compress PDF Files Online',
    ogDescription:
      'Compress PDF files directly in your browser without uploading them. Reduce PDF file size while keeping your files private.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'PDF Compressor',
      url: `${BASE_URL}/compress-pdf`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All modern web browsers',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description:
        'Compress PDF files locally in your browser without server uploads. Choose from Recommended, Strong, or Maximum compression.',
    },
  },
  '/privacy': {
    title: 'Privacy Policy – 100% Client-Side PDF Tools',
    description:
      'Learn about our zero-upload privacy commitment. All PDF conversions and compressions happen entirely on your device.',
    canonical: `${BASE_URL}/privacy`,
    ogTitle: 'Privacy Policy – PDF Tools',
    ogDescription:
      'Learn about our zero-upload privacy commitment. All PDF conversions and compressions happen entirely on your device.',
  },
  '/terms': {
    title: 'Terms of Service – PDF Tools',
    description:
      'Terms of service for using the free client-side PDF tools.',
    canonical: `${BASE_URL}/terms`,
    ogTitle: 'Terms of Service – PDF Tools',
    ogDescription:
      'Terms of service for using the free client-side PDF tools.',
  },
};

export function useSeo(path: RoutePath) {
  useEffect(() => {
    const meta = SEO_DATA[path] || SEO_DATA['/'];

    // Update title
    document.title = meta.title;

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', meta.description);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', meta.canonical);

    // Update Open Graph tags
    const updateMetaTag = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMetaTag('og:title', meta.ogTitle);
    updateMetaTag('og:description', meta.ogDescription);
    updateMetaTag('og:url', meta.canonical);

    // Inject JSON-LD
    let scriptTag = document.getElementById('app-structured-data') as HTMLScriptElement | null;
    if (meta.jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'app-structured-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(meta.jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [path]);
}
