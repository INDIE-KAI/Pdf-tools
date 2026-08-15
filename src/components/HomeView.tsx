import React from 'react';
import { FileImage, Minimize2, ArrowRight, ShieldCheck, Zap, Lock, Smartphone } from 'lucide-react';
import { RoutePath } from '../types';

interface HomeViewProps {
  onNavigate: (path: RoutePath) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-16 space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto" aria-labelledby="home-hero-heading">
        {/* Privacy Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Your files never leave your device</span>
        </div>

        {/* Primary H1 */}
        <h1
          id="home-hero-heading"
          className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.1]"
        >
          PDF Tools. <span className="text-emerald-700">Private by Design.</span>
        </h1>

        {/* Supporting Text */}
        <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          Convert images to PDF and compress PDFs directly in your browser. Your files stay on your device.
        </p>
      </section>

      {/* Two Prominent Tool Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" aria-label="Available PDF Tools">
        {/* Tool Card 1: Images -> PDF */}
        <div
          id="tool-card-jpg-to-pdf"
          className="bg-white rounded-2xl border-2 border-neutral-200/90 hover:border-neutral-900/80 p-7 sm:p-9 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <FileImage className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="font-heading font-bold text-2xl text-neutral-900">
                Images → PDF
              </h2>
              <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full">
                JPG &amp; PNG
              </span>
            </div>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
              Convert JPG and PNG images into a single PDF.
            </p>
          </div>

          <button
            id="cta-convert-images-to-pdf"
            onClick={() => onNavigate('/jpg-to-pdf')}
            className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 group-hover:bg-neutral-800 transition-all cursor-pointer shadow-sm hover:translate-y-[-1px]"
          >
            <span>Convert Images to PDF</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Tool Card 2: Compress PDF */}
        <div
          id="tool-card-compress-pdf"
          className="bg-white rounded-2xl border-2 border-neutral-200/90 hover:border-neutral-900/80 p-7 sm:p-9 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between group"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-6 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <Minimize2 className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="font-heading font-bold text-2xl text-neutral-900">
                Compress PDF
              </h2>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Up to 70% Off
              </span>
            </div>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
              Reduce PDF file size directly in your browser.
            </p>
          </div>

          <button
            id="cta-compress-pdf"
            onClick={() => onNavigate('/compress-pdf')}
            className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 group-hover:bg-neutral-800 transition-all cursor-pointer shadow-sm hover:translate-y-[-1px]"
          >
            <span>Compress PDF</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Trust & Architecture Features */}
      <section className="bg-white rounded-2xl p-8 sm:p-10 border border-neutral-200/80 shadow-xs">
        <h3 className="font-heading font-bold text-xl text-neutral-900 mb-6 text-center sm:text-left">
          Why Client-Side PDF Tools?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 font-semibold">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-semibold text-neutral-900 text-base">Complete Privacy</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No files are uploaded to any server. Your medical records, contracts, and personal photos stay on your hardware.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center mb-3 font-semibold">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-semibold text-neutral-900 text-base">Instant Processing</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              No waiting for file uploads or slow cloud queues. High-performance browser WebAssembly processes files in seconds.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center mb-3 font-semibold">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-semibold text-neutral-900 text-base">Mobile-First &amp; Free</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Works seamlessly on iOS, Android, tablets, and desktop browsers. No sign-up, subscriptions, or watermarks.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
