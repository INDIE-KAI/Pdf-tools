import React from 'react';
import { RoutePath } from '../types';

export const TermsPage: React.FC<{ onNavigate: (path: RoutePath) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12">
      <div className="text-center mb-10">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 mb-3">
          Terms of Service
        </h1>
        <p className="text-neutral-600 text-base">
          Simple, transparent terms for using PDF Tools.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-xs space-y-6 text-neutral-700 leading-relaxed text-sm sm:text-base">
        <div>
          <h2 className="font-heading font-bold text-lg text-neutral-900 mb-2">1. Usage of the Service</h2>
          <p>
            PDF Tools provides free client-side PDF utility functions directly in your browser. You may use this tool for personal, educational, and commercial purposes.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-lg text-neutral-900 mb-2">2. Client-Side Execution</h2>
          <p>
            All processing is performed directly on your device. You are responsible for ensuring that you have sufficient device memory and compute capabilities when processing very large files.
          </p>
        </div>

        <div>
          <h2 className="font-heading font-bold text-lg text-neutral-900 mb-2">3. Disclaimer of Warranties</h2>
          <p>
            The software is provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of the software.
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
