import React from 'react';
import { ShieldCheck, FileImage, Minimize2, Home } from 'lucide-react';
import { RoutePath } from '../types';

interface NavbarProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          id="nav-logo"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-neutral-800 transition-colors">
            P
          </div>
          <div>
            <span className="font-heading font-bold text-lg tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors block leading-tight">
              PDF Tools
            </span>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              100% Client-Side
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main Navigation">
          <button
            id="nav-link-home"
            onClick={() => onNavigate('/')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentPath === '/'
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            id="nav-link-jpg-to-pdf"
            onClick={() => onNavigate('/jpg-to-pdf')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentPath === '/jpg-to-pdf'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <FileImage className="w-4 h-4" />
            <span>JPG to PDF</span>
          </button>

          <button
            id="nav-link-compress-pdf"
            onClick={() => onNavigate('/compress-pdf')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentPath === '/compress-pdf'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
          >
            <Minimize2 className="w-4 h-4" />
            <span>Compress PDF</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-neutral-200 text-xs font-semibold text-neutral-700 bg-neutral-100/80 px-2.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Uploads</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
