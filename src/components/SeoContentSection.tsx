import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Zap, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface SeoContentSectionProps {
  tool: 'jpg-to-pdf' | 'compress-pdf';
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({ tool }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (tool === 'jpg-to-pdf') {
    const faqs: FaqItem[] = [
      {
        question: 'Are my images uploaded to any server?',
        answer:
          'No. All image conversions are processed locally inside your web browser using HTML5 Canvas and WebAssembly. Your files never leave your device.',
      },
      {
        question: 'Can I combine multiple JPG and PNG images into one PDF?',
        answer:
          'Yes! You can select multiple images at once or add more sequentially. You can reorder them, adjust margins or page sizing, and generate a single unified PDF.',
      },
      {
        question: 'Is there a limit on how many images I can convert?',
        answer:
          'Because the conversion runs locally on your device, there are no artificial server limits. Processing is limited only by your browser’s available memory.',
      },
      {
        question: 'What page sizes are supported?',
        answer:
          'You can choose "Auto" (which matches each page exactly to image dimensions) or standard "A4" (in portrait or landscape orientation with optional small margins).',
      },
    ];

    return (
      <section className="mt-20 pt-12 border-t border-neutral-200" aria-labelledby="seo-content-heading">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Section 1: What & How */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 id="seo-content-heading" className="font-heading font-bold text-xl text-neutral-900 mb-3">
                What is JPG to PDF Conversion?
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                JPG to PDF conversion packages your image files (JPG, JPEG, PNG, and WebP) into an industry-standard, multi-page PDF document. PDFs preserve formatting across all desktop and mobile devices, making them ideal for documents, receipts, portfolios, and official submissions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
                Is the conversion private?
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Yes, 100% private. Unlike standard online converters that upload your confidential photos and receipts to remote cloud servers, our converter runs entirely in your local browser memory. Zero files are uploaded.
              </p>
            </div>
          </div>

          {/* Section 2: How to Convert Steps */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
            <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-8 text-center sm:text-left">
              How to Convert JPG to PDF in 4 Quick Steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Select Images</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Drag and drop JPG or PNG images into the dropzone or click to browse.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Reorder Pages</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Arrange images in the exact sequence you want them to appear in the PDF.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Adjust Settings</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Optionally select A4 or Auto page sizing, orientation, and margin preferences.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Create &amp; Download</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Click Create PDF and instantly download the compiled file to your device.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: FAQ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-neutral-700" />
              <h2 className="font-heading font-bold text-2xl text-neutral-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-neutral-900 hover:bg-neutral-50/80 cursor-pointer"
                    aria-expanded={openFaqIndex === idx}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-200 flex-shrink-0 ${
                        openFaqIndex === idx ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // PDF Compressor SEO content
  const faqs: FaqItem[] = [
    {
      question: 'How does client-side PDF compression work?',
      answer:
        'The compressor inspects document elements and high-resolution raster layers inside your browser, re-encoding them with modern compression algorithms without sending a single byte to an external server.',
    },
    {
      question: 'Does PDF compression reduce document quality?',
      answer:
        'With "Recommended" mode, compression is balanced to keep text crisp and images visually clear for digital reading and emailing. "Strong" and "Maximum" prioritize file size reduction.',
    },
    {
      question: 'Is my PDF uploaded anywhere?',
      answer:
        'Never. The entire compression process executes inside your browser using client-side WebAssembly. No files leave your device.',
    },
    {
      question: 'Why didn’t my PDF shrink significantly?',
      answer:
        'PDFs containing only pure vector text, simple shapes, or images that are already heavily compressed cannot be compressed much further without stripping essential data. We always show honest compression stats.',
    },
  ];

  return (
    <section className="mt-20 pt-12 border-t border-neutral-200" aria-labelledby="seo-compress-heading">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Section 1: What & Why */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h2 id="seo-compress-heading" className="font-heading font-bold text-xl text-neutral-900 mb-3">
              What does PDF compression do?
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              PDF compression reduces the byte footprint of PDF documents by downscaling redundant image data, removing unnecessary object structures, and applying high-efficiency stream compression so files fit email limits and upload portals.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3">
              Is the PDF uploaded?
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              No. Your PDF remains 100% on your machine. We never transfer your sensitive business contracts, medical forms, bank statements, or personal records to external servers.
            </p>
          </div>
        </div>

        {/* Section 2: How to Compress */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs">
          <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-8 text-center sm:text-left">
            How to Compress a PDF in 3 Clicks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Select PDF</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Choose the PDF file you want to compress from your desktop or phone.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Choose Level</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Select Recommended, Strong, or Maximum compression according to your needs.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-heading font-semibold text-base text-neutral-900 mb-1">Download PDF</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Click Compress PDF and download your lighter, optimized PDF instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Compression Quality Guidance */}
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8">
          <h3 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Choosing the Right Compression Level
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
            <li>
              <strong className="text-white">Recommended:</strong> Best for resumes, official forms, and documents with fine text. Maintains excellent sharpness.
            </li>
            <li>
              <strong className="text-white">Strong:</strong> Great for slide decks, reports with charts, and general multi-page documents.
            </li>
            <li>
              <strong className="text-white">Maximum:</strong> Ideal when meeting strict upload limits (e.g. government or school portals requiring &lt;2MB files).
            </li>
          </ul>
        </div>

        {/* Section 4: FAQ */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-neutral-700" />
            <h2 className="font-heading font-bold text-2xl text-neutral-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-neutral-900 hover:bg-neutral-50/80 cursor-pointer"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 flex-shrink-0 ${
                      openFaqIndex === idx ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
