import React, { useState } from "react";
import { CornerFrameStyle, CornerDotStyle, DotStyle, QRConfig } from "../../types";
import { Grid, Shield, Maximize2, CheckCircle2, Sparkles, Zap } from "lucide-react";

interface ShapesStyleTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
}

interface DotStyleItem {
  id: DotStyle;
  label: string;
  subLabel: string;
  category: "easy-scan" | "modern" | "artistic";
  scannability: string;
  scannabilityScore: number;
}

const DOT_STYLES: DotStyleItem[] = [
  // 1. High Scannability (Paling Mudah Di-scan - 98-100%)
  {
    id: "squares",
    label: "Classic Square",
    subLabel: "Standar ISO resmi",
    category: "easy-scan",
    scannability: "100% Ultra Scan",
    scannabilityScore: 100,
  },
  {
    id: "squircle",
    label: "Squircle Apple",
    subLabel: "Kotak halus modern",
    category: "easy-scan",
    scannability: "99% Mudah Scan",
    scannabilityScore: 99,
  },
  {
    id: "subtle-rounded",
    label: "Subtle Rounded",
    subLabel: "Sudut lembut presisi",
    category: "easy-scan",
    scannability: "99% Mudah Scan",
    scannabilityScore: 99,
  },
  {
    id: "connected",
    label: "Connected Smooth",
    subLabel: "Blok menyatu tanpa celah",
    category: "easy-scan",
    scannability: "98% Mudah Scan",
    scannabilityScore: 98,
  },
  {
    id: "bold-dots",
    label: "Bold Circle",
    subLabel: "Titik bulat tebal padat",
    category: "easy-scan",
    scannability: "98% Mudah Scan",
    scannabilityScore: 98,
  },

  // 2. Modern & Stylish (92-96%)
  {
    id: "rounded",
    label: "Soft Rounded",
    subLabel: "Melengkung elegan",
    category: "modern",
    scannability: "95% Bagus",
    scannabilityScore: 95,
  },
  {
    id: "extra-rounded",
    label: "Pills / Capsule",
    subLabel: "Kapsul melengkung",
    category: "modern",
    scannability: "94% Bagus",
    scannabilityScore: 94,
  },
  {
    id: "dots",
    label: "Classic Dots",
    subLabel: "Titik lingkaran reguler",
    category: "modern",
    scannability: "92% Bagus",
    scannabilityScore: 92,
  },
  {
    id: "mosaic",
    label: "Mosaic Tiles",
    subLabel: "Ubin geometris selang-seling",
    category: "modern",
    scannability: "94% Bagus",
    scannabilityScore: 94,
  },
  {
    id: "classy",
    label: "Classy Curve",
    subLabel: "Gaya diagonal modern",
    category: "modern",
    scannability: "93% Bagus",
    scannabilityScore: 93,
  },
  {
    id: "hex-dots",
    label: "Hexagon Cyber",
    subLabel: "Segi enam futuristik",
    category: "modern",
    scannability: "93% Bagus",
    scannabilityScore: 93,
  },

  // 3. Artistic & Decorative
  {
    id: "petal",
    label: "Petal / Leaf",
    subLabel: "Kelopak daun artistik",
    category: "artistic",
    scannability: "91% Unik",
    scannabilityScore: 91,
  },
  {
    id: "cross",
    label: "Tech Cross",
    subLabel: "Palang plus tebal",
    category: "artistic",
    scannability: "90% Unik",
    scannabilityScore: 90,
  },
  {
    id: "diamond",
    label: "Diamonds",
    subLabel: "Belah ketupat geometris",
    category: "artistic",
    scannability: "89% Unik",
    scannabilityScore: 89,
  },
  {
    id: "fluid",
    label: "Fluid Bubble",
    subLabel: "Gelembung organik",
    category: "artistic",
    scannability: "88% Unik",
    scannabilityScore: 88,
  },
  {
    id: "star",
    label: "Stars",
    subLabel: "Bintang dekoratif",
    category: "artistic",
    scannability: "86% Unik",
    scannabilityScore: 86,
  },
];

const CORNER_FRAME_STYLES: { id: CornerFrameStyle; label: string }[] = [
  { id: "square", label: "Square Frame" },
  { id: "rounded", label: "Rounded Frame" },
  { id: "circle", label: "Circle Frame" },
  { id: "leaf", label: "Leaf Frame" },
];

const CORNER_DOT_STYLES: { id: CornerDotStyle; label: string }[] = [
  { id: "square", label: "Square Eye" },
  { id: "dot", label: "Circle Eye" },
  { id: "rounded", label: "Rounded Eye" },
  { id: "diamond", label: "Diamond Eye" },
  { id: "star", label: "Star Eye" },
];

// Mini Visual Preview for each dot shape
const DotPreviewShape: React.FC<{ styleId: DotStyle; isSelected: boolean }> = ({
  styleId,
  isSelected,
}) => {
  const colorClass = isSelected ? "bg-indigo-400" : "bg-slate-300";

  switch (styleId) {
    case "squares":
      return <div className={`w-3.5 h-3.5 ${colorClass}`} />;
    case "squircle":
      return <div className={`w-3.5 h-3.5 rounded-sm ${colorClass}`} />;
    case "subtle-rounded":
      return <div className={`w-3.5 h-3.5 rounded-[2px] ${colorClass}`} />;
    case "connected":
      return (
        <div className="flex gap-[1px]">
          <div className={`w-2 h-3.5 rounded-l-md ${colorClass}`} />
          <div className={`w-2 h-3.5 rounded-r-md ${colorClass}`} />
        </div>
      );
    case "bold-dots":
      return <div className={`w-3.5 h-3.5 rounded-full ${colorClass}`} />;
    case "dots":
      return <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />;
    case "rounded":
      return <div className={`w-3.5 h-3.5 rounded-md ${colorClass}`} />;
    case "extra-rounded":
      return <div className={`w-3.5 h-3.5 rounded-lg ${colorClass}`} />;
    case "mosaic":
      return (
        <div className="w-3.5 h-3.5 relative">
          <div className={`w-3.5 h-3.5 rounded-tl-md rounded-br-md ${colorClass}`} />
        </div>
      );
    case "classy":
      return <div className={`w-3.5 h-3.5 rounded-tr-md rounded-bl-md ${colorClass}`} />;
    case "hex-dots":
      return (
        <div
          className={`w-3.5 h-3.5 ${colorClass}`}
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        />
      );
    case "petal":
      return <div className={`w-3.5 h-3.5 rounded-tl-lg rounded-br-lg ${colorClass}`} />;
    case "diamond":
      return <div className={`w-3 h-3 rotate-45 ${colorClass}`} />;
    case "cross":
      return (
        <div className="w-3.5 h-3.5 relative flex items-center justify-center">
          <div className={`absolute w-3.5 h-1.5 ${colorClass}`} />
          <div className={`absolute w-1.5 h-3.5 ${colorClass}`} />
        </div>
      );
    case "fluid":
      return <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-indigo-400/40 ${colorClass}`} />;
    case "star":
      return (
        <div
          className={`w-3.5 h-3.5 ${colorClass}`}
          style={{ clipPath: "polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)" }}
        />
      );
    default:
      return <div className={`w-3.5 h-3.5 ${colorClass}`} />;
  }
};

export const ShapesStyleTab: React.FC<ShapesStyleTabProps> = ({
  config,
  onChangeConfig,
}) => {
  const [filterCategory, setFilterCategory] = useState<"all" | "easy-scan" | "modern" | "artistic">("all");

  const filteredDots = DOT_STYLES.filter((d) =>
    filterCategory === "all" ? true : d.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Dot Pattern Style Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-indigo-400" />
            <span>Bentuk Titik & Pola Isi QR (Data Modules)</span>
          </label>

          {/* Quick Category Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px]">
            <button
              type="button"
              onClick={() => setFilterCategory("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filterCategory === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Semua ({DOT_STYLES.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("easy-scan")}
              className={`px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition ${
                filterCategory === "easy-scan"
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Gampang Di-Scan (5)</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("modern")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filterCategory === "modern"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Modern (6)
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("artistic")}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                filterCategory === "artistic"
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Artistik (5)
            </button>
          </div>
        </div>

        {/* Highlight Banner if Easy-Scan Category is Selected or current item is high scannability */}
        <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] leading-tight">
              <strong>Tips Keterbacaan Scanner:</strong> Bentuk <em>Classic Square</em>, <em>Squircle</em>, <em>Subtle Rounded</em>, <em>Connected Smooth</em>, dan <em>Bold Circle</em> memiliki kepadatan piksel tinggi sehingga <strong>100% cepat terbaca</strong> di semua kamera HP (termasuk kamera bawaan Redmi/Xiaomi, Samsung, iPhone).
            </span>
          </div>
        </div>

        {/* Dot Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredDots.map((d) => {
            const isSelected = config.dotStyle === d.id;
            const isEasyScan = d.category === "easy-scan";

            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onChangeConfig({ dotStyle: d.id })}
                className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-md ring-1 ring-indigo-500/30"
                    : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition ${
                        isSelected
                          ? "bg-indigo-600/30 border-indigo-400"
                          : "bg-slate-900 border-slate-800 group-hover:border-slate-700"
                      }`}
                    >
                      <DotPreviewShape styleId={d.id} isSelected={isSelected} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{d.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{d.subLabel}</p>
                    </div>
                  </div>

                  {/* Scannability Chip */}
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      isEasyScan
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                        : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                    }`}
                  >
                    {d.scannability}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Frame Style */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Maximize2 className="w-4 h-4 text-purple-400" />
          <span>Bentuk Bingkai Sudut (Corner Frame Style)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CORNER_FRAME_STYLES.map((f) => {
            const isSelected = config.cornerFrameStyle === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChangeConfig({ cornerFrameStyle: f.id })}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-500 text-purple-200 font-semibold"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Dot Eye Style */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Bentuk Titik Mata Sudut (Corner Eye Dot)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CORNER_DOT_STYLES.map((e) => {
            const isSelected = config.cornerDotStyle === e.id;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => onChangeConfig({ cornerDotStyle: e.id })}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition ${
                  isSelected
                    ? "bg-pink-600/20 border-pink-500 text-pink-200 font-semibold"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Margin Padding Slider & Error Correction */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
        {/* Quiet Zone Margin */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Quiet Zone (Batas Tepi Putih)</span>
            <span className="font-mono text-indigo-400 font-bold">{config.margin}px</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={config.margin}
            onChange={(e) => onChangeConfig({ margin: parseInt(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">Margin yang cukup membantu scanner mendeteksi batas QR.</p>
        </div>

        {/* Error Correction Level */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Tingkat Error Correction
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {config.errorCorrectionLevel === "H" ? "Level H (30% Recovery)" : `${config.errorCorrectionLevel} (Toleransi)`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(["L", "M", "Q", "H"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChangeConfig({ errorCorrectionLevel: lvl })}
                className={`py-1 rounded-lg text-xs font-bold transition ${
                  config.errorCorrectionLevel === lvl
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400">Level H direkomendasikan jika memasang logo di tengah QR.</p>
        </div>
      </div>
    </div>
  );
};
