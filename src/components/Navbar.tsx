import React from "react";
import { Sparkles, Scan, History, QrCode, Palette, Download } from "lucide-react";

interface NavbarProps {
  onOpenPresets: () => void;
  onOpenScanner: () => void;
  onOpenHistory: () => void;
  onExport: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPresets,
  onOpenScanner,
  onOpenHistory,
  onExport,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                QR <span className="text-indigo-400">AI</span> Generator
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Aesthetic & Artistic AI QR Code Generator
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Preset Styles Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Aesthetic Presets"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Presets</span>
          </button>

          {/* QR Scanner */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Scan QR Code"
          >
            <Scan className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Saved Codes"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Library</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Quick Export Button */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-md shadow-indigo-500/25 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="font-semibold">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
