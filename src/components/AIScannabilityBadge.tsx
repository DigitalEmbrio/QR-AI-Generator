import React, { useMemo, useState } from "react";
import { ShieldCheck, CheckCircle2, Smartphone, Info, Zap, AlertCircle } from "lucide-react";
import { QRConfig } from "../types";
import { evaluateScannability } from "../utils/scannability";

interface AIScannabilityBadgeProps {
  config: QRConfig;
  onOptimizeForRedmi?: () => void;
}

export const AIScannabilityBadge: React.FC<AIScannabilityBadgeProps> = ({
  config,
  onOptimizeForRedmi,
}) => {
  const [showRedmiExplanation, setShowRedmiExplanation] = useState(false);

  // Compute scannability locally in real-time (0 network latency, 0 rate limit)
  const result = useMemo(() => {
    return evaluateScannability(config);
  }, [
    config.color.foreground,
    config.color.background,
    config.color.transparentBackground,
    config.dotStyle,
    config.logo.enabled,
    config.errorCorrectionLevel,
    config.margin,
    config.aiArt.enabled,
    config.aiArt.imageUrl,
    config.aiArt.contrastOverlay,
  ]);

  const score = result.scannabilityScore;
  const isHighScannability = score >= 90;
  const isMedium = score >= 70 && score < 90;

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 space-y-3.5 shadow-xl">
      {/* Top Scannability Meter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>Scannability Meter</span>
            </div>
            <p className="text-[10px] text-slate-400">Kontras: {result.contrastRatio || "15:1"}</p>
          </div>
        </div>

        {/* High Scannability Badge */}
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide uppercase flex items-center gap-1 shadow-sm ${
            isHighScannability
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
              : isMedium
              ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
              : "bg-rose-500/15 border border-rose-500/30 text-rose-400"
          }`}
        >
          {isHighScannability ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          <span>
            {isHighScannability ? "High Scannability" : isMedium ? "Medium Scannability" : "Low Contrast"} ({score}%)
          </span>
        </div>
      </div>

      {/* Continuous Spectrum Gradient Health Bar */}
      <div className="relative space-y-1">
        <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 via-yellow-400 to-emerald-400 p-[1px] overflow-hidden relative shadow-inner">
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-white border border-slate-950 rounded-full shadow-md transition-all duration-300"
            style={{ left: `calc(${score}% - 4px)` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-semibold text-slate-500 tracking-wider uppercase">
          <span>Low</span>
          <span>Medium</span>
          <span className="text-emerald-400 font-bold">Optimal Camera Target</span>
        </div>
      </div>

      {/* Suggestions if any issue */}
      {result.suggestions.length > 0 && score < 95 && (
        <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-[11px] text-slate-300 space-y-1">
          {result.suggestions.map((sug, i) => (
            <p key={i} className="flex items-start gap-1.5">
              <span className="text-amber-400 shrink-0">•</span>
              <span>{sug}</span>
            </p>
          ))}
        </div>
      )}

      {/* Redmi & Camera App Scanner Optimization Card */}
      <div className="pt-1 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowRedmiExplanation(!showRedmiExplanation)}
            className="text-[11px] font-semibold text-slate-300 hover:text-indigo-300 flex items-center gap-1.5 transition text-left"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Mengapa Scanner Bawaan Redmi Kadang Tidak Terdeteksi?</span>
            <Info className="w-3 h-3 text-slate-500 shrink-0" />
          </button>
        </div>

        {/* Diagnostic Explanation Popup */}
        {showRedmiExplanation && (
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2 animate-fadeIn">
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-indigo-400">Penyebab Utama:</strong> Aplikasi kamera bawaan HP (seperti <span className="text-rose-400 font-bold">Redmi / Xiaomi</span>) menggunakan pemindai bawaan dasar dengan kriteria kontras sangat ketat (membutuhkan modul gelap pada latar putih bersih & modul tidak terlalu kecil).
            </p>
            <p className="text-slate-400 leading-relaxed">
              Sedangkan <strong className="text-emerald-400">Google Lens & Aplikasi Barcode</strong> menggunakan algoritma canggih yang mampu membaca gradasi warna, titik artistik, dan logo di tengah QR secara otomatis.
            </p>
            <div className="p-2 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-[10px] text-indigo-200">
              💡 <strong>Solusi Instant:</strong> Klik tombol di bawah untuk otomatis mengoptimalkan QR ke kontras & pola standar agar <strong>100% terbaca di Kamera Bawaan Redmi</strong> dan semua smartphone!
            </div>
          </div>
        )}

        {/* 1-Click Redmi Camera Optimizer Button */}
        {onOptimizeForRedmi && (
          <button
            type="button"
            onClick={onOptimizeForRedmi}
            className="w-full py-2.5 px-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md group"
          >
            <Zap className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
            <span>⚡ Optimal untuk Kamera Redmi & Semua HP</span>
          </button>
        )}
      </div>
    </div>
  );
};


