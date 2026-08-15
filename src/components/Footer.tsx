import React from 'react';
import { ShieldCheck, Lock, Cpu, Heart } from 'lucide-react';
import { RoutePath } from '../types';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-20">
      {/* Privacy Callout Banner */}
      <div className="bg-emerald-50/70 border-b border-emerald-100 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left text-sm text-emerald-900 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            <span>Privacy Guarantee:</span>
          </div>
          <span>Your files never leave your device. All processing runs locally inside your web browser.</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                P
              </div>
              <span className="font-heading font-bold text-lg text-neutral-900">PDF Tools</span>
            </div>
            <p className="text-neutral-600 text-sm max-w-md leading-relaxed">
              Fast, privacy-first PDF utility tools built for modern web browsers. Convert JPG and PNG images into PDFs and compress PDF file sizes locally with no server uploads.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                No data collected
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                Browser WebAssembly
              </span>
            </div>
          </div>

          {/* Col 2: Tools */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-neutral-900 uppercase tracking-wider mb-3">
              Tools
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <button
                  id="footer-link-jpg-to-pdf"
                  onClick={() => onNavigate('/jpg-to-pdf')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer text-left"
                >
                  JPG to PDF Converter
                </button>
              </li>
              <li>
                <button
                  id="footer-link-compress-pdf"
                  onClick={() => onNavigate('/compress-pdf')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer text-left"
                >
                  PDF Compressor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Info */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-neutral-900 uppercase tracking-wider mb-3">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <button
                  id="footer-link-privacy"
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-link-terms"
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} PDF Tools. Free &amp; Open Client-Side Utility.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for privacy &amp; speed.
          </p>
        </div>
      </div>
    </footer>
  );
};
