import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span>Your files never leave your device</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-emerald-50/90 border border-emerald-200/80 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-950 flex items-center gap-1.5">
            Privacy First Processing
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> No Server Upload
            </span>
          </p>
          <p className="text-xs text-emerald-800 mt-0.5">
            Your files never leave your device. All rendering and compression executes locally in your browser memory.
          </p>
        </div>
      </div>
    </div>
  );
};
