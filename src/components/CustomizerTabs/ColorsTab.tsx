import React, { useState, useRef } from "react";
import { QRConfig } from "../../types";
import {
  Palette,
  Sparkles,
  ArrowLeftRight,
  Pipette,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Sliders,
} from "lucide-react";

interface ColorsTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
}

interface DualColorSwatch {
  fg: string;
  bg: string;
  transparent?: boolean;
  fg2?: string; // Optional gradient secondary
}

// 28 curated dual-color diagonal swatches matching screenshot
const COLOR_SWATCHES: DualColorSwatch[] = [
  { fg: "#000000", bg: "#ffffff" },
  { fg: "#1e293b", bg: "#ffffff" },
  { fg: "#0f3d64", bg: "#ffffff" },
  { fg: "#1d4ed8", bg: "#ffffff" },
  { fg: "#2e7d32", bg: "#ffffff" },
  { fg: "#784421", bg: "#ffffff" },
  { fg: "#dc2626", bg: "#ffffff" },
  { fg: "#9333ea", bg: "#ffffff" },

  { fg: "#e11d48", bg: "#ffffff" },
  { fg: "#ea580c", bg: "#ffffff" },
  { fg: "#0d9488", bg: "#ffffff" },
  { fg: "#334155", bg: "#ffffff" },
  { fg: "#be123c", bg: "#ffffff" },
  { fg: "#4f46e5", bg: "#ffffff" },
  { fg: "#c2410c", bg: "#ffffff" },
  { fg: "#115e59", bg: "#ffffff" },

  { fg: "#064e3b", bg: "#ffffff" },
  { fg: "#854d0e", bg: "#ffffff" },
  { fg: "#0369a1", bg: "#ffffff" },
  { fg: "#881337", bg: "#ffffff" },
  { fg: "#581c87", bg: "#ffffff" },
  { fg: "#18181b", bg: "#ffffff" },
  { fg: "#1e3a5f", bg: "#ffffff" },
  { fg: "#1e353d", bg: "#ffffff" },

  { fg: "#172554", bg: "#ffffff" },
  { fg: "#4c0519", bg: "#ffffff" },
  { fg: "#14532d", bg: "#ffffff" },
  { fg: "#0f0728", bg: "#ffffff" },
  { fg: "#000000", bg: "#ffffff", transparent: true },
  { fg: "#0f3d64", bg: "#ffffff", transparent: true },
  { fg: "#9333ea", bg: "#ffffff", transparent: true },
  { fg: "#dc2626", bg: "#ffffff", transparent: true },
];

export const ColorsTab: React.FC<ColorsTabProps> = ({ config, onChangeConfig }) => {
  const { color } = config;
  const effects = config.effects || { glow: false, texture: false, confetti: false };

  const [isColorAccordionOpen, setIsColorAccordionOpen] = useState(true);
  const [isEffectsAccordionOpen, setIsEffectsAccordionOpen] = useState(true);

  const fgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const fg2InputRef = useRef<HTMLInputElement>(null);

  const updateColor = (partialColor: Partial<QRConfig["color"]>) => {
    onChangeConfig({
      color: {
        ...color,
        ...partialColor,
      },
    });
  };

  const updateEffects = (partialEffects: Partial<typeof effects>) => {
    onChangeConfig({
      effects: {
        ...effects,
        ...partialEffects,
      },
    });
  };

  // Swap Foreground and Background colors
  const handleSwapColors = () => {
    updateColor({
      foreground: color.background,
      background: color.foreground,
      transparentBackground: false,
    });
  };

  // Current mode
  const currentMode = !color.useGradient
    ? "solid"
    : color.gradientType === "radial"
    ? "radial"
    : "gradient";

  const handleSelectMode = (mode: "solid" | "gradient" | "radial") => {
    if (mode === "solid") {
      updateColor({ useGradient: false });
    } else if (mode === "gradient") {
      updateColor({
        useGradient: true,
        gradientType: "linear",
        gradientColor2: color.gradientColor2 || "#4f46e5",
      });
    } else if (mode === "radial") {
      updateColor({
        useGradient: true,
        gradientType: "radial",
        gradientColor2: color.gradientColor2 || "#ec4899",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. WARNA CARD / ACCORDION */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg shadow-black/20">
        {/* Accordion Header */}
        <button
          onClick={() => setIsColorAccordionOpen(!isColorAccordionOpen)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold text-slate-100">Warna</span>
          </div>
          {isColorAccordionOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isColorAccordionOpen && (
          <div className="p-4 pt-1 space-y-4 border-t border-slate-800/60">
            {/* Top Layout: Left Split Preview & Right Mode/Swatches */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* LEFT: Large Diagonal Split Preview Card */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[200px] lg:max-w-none rounded-2xl overflow-hidden border border-slate-700/80 shadow-md">
                  {/* Top-Left Triangle (Foreground Color) */}
                  <div
                    onClick={() => fgInputRef.current?.click()}
                    className="absolute inset-0 cursor-pointer group"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: color.useGradient
                        ? color.gradientType === "radial"
                          ? `radial-gradient(circle, ${color.foreground} 0%, ${color.gradientColor2 || color.foreground} 100%)`
                          : `linear-gradient(${color.gradientAngle || 45}deg, ${color.foreground} 0%, ${color.gradientColor2 || color.foreground} 100%)`
                        : color.foreground,
                    }}
                  >
                    {/* Top-Left Eyedropper Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fgInputRef.current?.click();
                      }}
                      title="Ubah Warna Depan (Foreground)"
                      className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition shadow"
                    >
                      <Pipette className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom-Right Triangle (Background Color) */}
                  <div
                    onClick={() => bgInputRef.current?.click()}
                    className={`absolute inset-0 cursor-pointer group ${
                      color.transparentBackground ? "checkerboard-bg" : ""
                    }`}
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      backgroundColor: color.transparentBackground
                        ? undefined
                        : color.background,
                    }}
                  >
                    {/* Bottom-Right Eyedropper Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        bgInputRef.current?.click();
                      }}
                      title="Ubah Warna Latar (Background)"
                      className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 transition shadow"
                    >
                      <Pipette className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Center Swap Button (⇄) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                      type="button"
                      onClick={handleSwapColors}
                      title="Tukar Warna Depan & Latar"
                      className="pointer-events-auto w-8 h-8 rounded-full bg-slate-950/90 border border-slate-600/80 hover:border-indigo-400 text-slate-200 hover:text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Hidden Native Color Inputs */}
                <input
                  ref={fgInputRef}
                  type="color"
                  value={color.foreground}
                  onChange={(e) => updateColor({ foreground: e.target.value })}
                  className="sr-only"
                />
                <input
                  ref={bgInputRef}
                  type="color"
                  value={color.background}
                  onChange={(e) =>
                    updateColor({ background: e.target.value, transparentBackground: false })
                  }
                  className="sr-only"
                />
                <input
                  ref={fg2InputRef}
                  type="color"
                  value={color.gradientColor2 || "#ec4899"}
                  onChange={(e) => updateColor({ gradientColor2: e.target.value })}
                  className="sr-only"
                />

                {/* Hex Code Readout & Direct Inputs */}
                <div className="w-full mt-2.5 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-lg py-1 px-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Depan</div>
                    <input
                      type="text"
                      value={color.foreground}
                      onChange={(e) => updateColor({ foreground: e.target.value })}
                      className="w-full bg-transparent text-center text-xs font-mono font-semibold text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800 rounded-lg py-1 px-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Latar</div>
                    <input
                      type="text"
                      value={color.transparentBackground ? "Transparan" : color.background}
                      disabled={color.transparentBackground}
                      onChange={(e) => updateColor({ background: e.target.value })}
                      className="w-full bg-transparent text-center text-xs font-mono font-semibold text-slate-200 focus:outline-none disabled:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: Segmented Mode Tabs + Palette Grid */}
              <div className="lg:col-span-8 space-y-3">
                {/* Segmented Mode Selector: Solid | gradien | Radial */}
                <div className="flex p-1 bg-slate-950/90 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSelectMode("solid")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      currentMode === "solid"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectMode("gradient")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      currentMode === "gradient"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    gradien
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectMode("radial")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      currentMode === "radial"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Radial
                  </button>
                </div>

                {/* 28+ Diagonal Split Swatches Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {COLOR_SWATCHES.map((swatch, idx) => {
                    const isSelected =
                      color.foreground.toLowerCase() === swatch.fg.toLowerCase() &&
                      (swatch.transparent
                        ? color.transparentBackground
                        : !color.transparentBackground &&
                          color.background.toLowerCase() === swatch.bg.toLowerCase());

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          updateColor({
                            foreground: swatch.fg,
                            background: swatch.bg,
                            transparentBackground: !!swatch.transparent,
                          });
                        }}
                        className={`relative w-full aspect-[16/10] rounded-lg overflow-hidden border transition-all ${
                          isSelected
                            ? "border-white ring-2 ring-indigo-500 scale-[1.04] shadow-md"
                            : "border-slate-700/80 hover:border-slate-500 hover:scale-[1.02]"
                        }`}
                      >
                        {/* Top-Left Half (Foreground) */}
                        <div
                          className="absolute inset-0"
                          style={{
                            clipPath: "polygon(0 0, 100% 0, 0 100%)",
                            backgroundColor: swatch.fg,
                          }}
                        />

                        {/* Bottom-Right Half (Background or Checkerboard) */}
                        <div
                          className={`absolute inset-0 ${
                            swatch.transparent ? "checkerboard-bg" : ""
                          }`}
                          style={{
                            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                            backgroundColor: swatch.transparent ? undefined : swatch.bg,
                          }}
                        />

                        {/* Active Selection Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-slate-950/90 text-white flex items-center justify-center shadow">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Gradient Customizer Sub-panel (if Linear or Radial) */}
                {color.useGradient && (
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/90 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-medium flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Warna Gradasi Kedua</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fg2InputRef.current?.click()}
                          className="w-6 h-6 rounded-md border border-slate-700 shadow cursor-pointer"
                          style={{ backgroundColor: color.gradientColor2 || "#ec4899" }}
                        />
                        <span className="font-mono text-[11px] text-slate-300">
                          {color.gradientColor2 || "#ec4899"}
                        </span>
                      </div>
                    </div>

                    {color.gradientType === "linear" && (
                      <div className="space-y-1 pt-1 border-t border-slate-800/60">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Sudut Kemiringan Gradien</span>
                          <span className="font-mono text-indigo-400">
                            {color.gradientAngle || 45}°
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={360}
                          step={15}
                          value={color.gradientAngle || 45}
                          onChange={(e) =>
                            updateColor({ gradientAngle: parseInt(e.target.value) })
                          }
                          className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Corner Eye Colors Option */}
            <div className="pt-2 border-t border-slate-800/70">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Kustom Warna Mata Sudut (Corner Eyes)</span>
                </label>
                <input
                  type="checkbox"
                  checked={color.customEyeColors}
                  onChange={(e) => updateColor({ customEyeColors: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                />
              </div>

              {color.customEyeColors && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 mt-2 border-t border-slate-800/60">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                      Bingkai Sudut (Corner Frame)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.eyeFrameColor || color.foreground}
                        onChange={(e) => updateColor({ eyeFrameColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={color.eyeFrameColor || color.foreground}
                        onChange={(e) => updateColor({ eyeFrameColor: e.target.value })}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                      Titik Mata Sudut (Inner Eye Dot)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.eyeDotColor || color.foreground}
                        onChange={(e) => updateColor({ eyeDotColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={color.eyeDotColor || color.foreground}
                        onChange={(e) => updateColor({ eyeDotColor: e.target.value })}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. EFEK KHUSUS CARD / ACCORDION */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg shadow-black/20">
        {/* Accordion Header */}
        <button
          onClick={() => setIsEffectsAccordionOpen(!isEffectsAccordionOpen)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-slate-100">Efek Khusus</span>
          </div>
          {isEffectsAccordionOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isEffectsAccordionOpen && (
          <div className="p-4 pt-2 space-y-3.5 border-t border-slate-800/60">
            {/* Toggle 1: Cahaya */}
            <div className="flex items-center justify-between py-1">
              <label
                htmlFor="effect-cahaya"
                className="text-xs font-medium text-slate-200 cursor-pointer flex items-center gap-2"
              >
                <span>Cahaya</span>
              </label>
              <button
                id="effect-cahaya"
                type="button"
                role="switch"
                aria-checked={effects.glow}
                onClick={() => updateEffects({ glow: !effects.glow })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  effects.glow ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    effects.glow ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Tekstur */}
            <div className="flex items-center justify-between py-1">
              <label
                htmlFor="effect-tekstur"
                className="text-xs font-medium text-slate-200 cursor-pointer flex items-center gap-2"
              >
                <span>Tekstur</span>
              </label>
              <button
                id="effect-tekstur"
                type="button"
                role="switch"
                aria-checked={effects.texture}
                onClick={() => updateEffects({ texture: !effects.texture })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  effects.texture ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    effects.texture ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Konfeti */}
            <div className="flex items-center justify-between py-1">
              <label
                htmlFor="effect-konfeti"
                className="text-xs font-medium text-slate-200 cursor-pointer flex items-center gap-2"
              >
                <span>Konfeti</span>
              </label>
              <button
                id="effect-konfeti"
                type="button"
                role="switch"
                aria-checked={effects.confetti}
                onClick={() => updateEffects({ confetti: !effects.confetti })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  effects.confetti ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    effects.confetti ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
