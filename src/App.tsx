/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RoutePath } from './types';
import { useSeo } from './utils/seo';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { JpgToPdfTool } from './components/JpgToPdfTool';
import { PdfCompressorTool } from './components/PdfCompressorTool';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';

export default function App() {
  // Determine initial route from URL
  const getPathFromLocation = (): RoutePath => {
    const p = window.location.pathname.toLowerCase();
    if (p === '/jpg-to-pdf') return '/jpg-to-pdf';
    if (p === '/compress-pdf') return '/compress-pdf';
    if (p === '/privacy') return '/privacy';
    if (p === '/terms') return '/terms';
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<RoutePath>(getPathFromLocation);

  // Sync SEO metadata (Title, Description, Canonical URL, OpenGraph, JSON-LD)
  useSeo(currentPath);

  // Listen for browser forward/backward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPathFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: RoutePath) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Header Navigation */}
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {currentPath === '/' && <HomeView onNavigate={navigate} />}
        {currentPath === '/jpg-to-pdf' && <JpgToPdfTool />}
        {currentPath === '/compress-pdf' && <PdfCompressorTool />}
        {currentPath === '/privacy' && <PrivacyPage onNavigate={navigate} />}
        {currentPath === '/terms' && <TermsPage onNavigate={navigate} />}
      </main>

      {/* Shared Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
