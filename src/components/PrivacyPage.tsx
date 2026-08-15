import React from 'react';
import { ShieldCheck, Lock, HardDrive, CheckCircle } from 'lucide-react';
import { RoutePath } from '../types';

export const PrivacyPage: React.FC<{ onNavigate: (path: RoutePath) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 mb-3">
          Privacy Policy
        </h1>
        <p className="text-neutral-600 text-base">
          Our core principle: Your files never leave your device.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-xs space-y-8 text-neutral-700 leading-relaxed text-sm sm:text-base">
        <div>
          <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            1. Zero-Upload Architecture
          </h2>
          <p>
            PDF Tools is engineered as an entirely client-side web application. When you select an image or PDF file, the file is read and processed strictly within your web browser’s memory using JavaScript, HTML5 Canvas, and WebAssembly.
          </p>
          <p className="mt-2 font-medium text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-200/60">
            We operate no backend servers for file processing or file storage. None of your photos, documents, or metadata are ever transmitted over the network.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-neutral-700" />
            2. File Retention &amp; Memory
          </h2>
          <p>
            Because all tasks run in temporary browser memory, closing or refreshing the page instantly purges all loaded files. No copies remain on any disk or database.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-xl text-neutral-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-neutral-700" />
            3. Analytics and Tracking
          </h2>
          <p>
            We do not log the contents, file names, or metadata of any files you convert or compress.
          </p>
        </div>

        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs text-neutral-600">Last updated: August 2026</span>
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
