import React, { useState } from "react";
import { AIPreset, QRConfig } from "../../types";
import { PRESET_THEMES } from "../../data/presets";
import { Dices, Check, CheckCircle2, Layers } from "lucide-react";

interface DesignsTabProps {
  config: QRConfig;
  onSelectPreset: (preset: AIPreset) => void;
  onSurpriseMe: () => void;
}

type PresetFilter = "all" | "classic" | "business" | "social" | "artistic";

export const DesignsTab: React.FC<DesignsTabProps> = ({
  config,
  onSelectPreset,
  onSurpriseMe,
}) => {
  const [activeCategory, setActiveCategory] = useState<PresetFilter>("all");

  const filteredPresets = PRESET_THEMES.filter((p) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "classic") return p.category === "classic" || p.id === "classic-iso-standard";
    if (activeCategory === "business") return p.category === "business" || p.category === "classic" || p.category === "minimal";
    if (activeCategory === "social") return p.category === "social";
    if (activeCategory === "artistic") return p.category === "artistic" || p.category === "luxury" || p.category === "cyber" || p.category === "nature" || p.category === "vibrant";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Templates Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Model & Template Siap Pakai</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              {PRESET_THEMES.length} Desain
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Pilih model standar universal yang umum dipakai untuk bisnis, kasir, resto, atau media sosial
          </p>
        </div>

        {/* Surprise me Button */}
        <button
          type="button"
          onClick={onSurpriseMe}
          className="flex items-center self-start sm:self-auto gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition active:scale-95 shrink-0"
        >
          <Dices className="w-4 h-4 text-purple-200" />
          <span>Acak Desain</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "all", label: "Semua Model" },
          { id: "classic", label: "⭐ Standar Universal (100% Scan)" },
          { id: "business", label: "Bisnis & Kantor" },
          { id: "social", label: "Sosial & Chat" },
          { id: "artistic", label: "Artistik & Kreatif" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id as PresetFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? "bg-white text-slate-900 shadow-md scale-100"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preset Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredPresets.map((p) => {
          const isSelected =
            config.color.foreground.toLowerCase() === p.foregroundColor.toLowerCase() &&
            config.color.background.toLowerCase() === p.backgroundColor.toLowerCase() &&
            config.dotStyle === p.dotStyle;

          const isClassicUniversal = p.id === "classic-iso-standard" || p.category === "classic";

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p)}
              className={`group relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-200 text-left overflow-hidden ${
                isSelected
                  ? "bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl scale-[1.02]"
                  : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              {/* Card Mini Background Preview Box */}
              <div
                className="w-full aspect-[4/3] rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-2 border border-slate-800/60"
                style={{ background: p.thumbnailBg }}
              >
                {/* Simulated Mini QR Dots Representation */}
                <div className="w-12 h-12 rounded-lg bg-black/40 backdrop-blur-[2px] p-1.5 flex flex-col justify-between items-center shadow-lg">
                  <div className="w-full flex justify-between">
                    <div
                      className="w-3.5 h-3.5 rounded-sm border-2"
                      style={{ borderColor: p.foregroundColor }}
                    >
                      <div
                        className="w-1.5 h-1.5 m-0.5 rounded-xs"
                        style={{ backgroundColor: p.foregroundColor }}
                      />
                    </div>
                    <div
                      className="w-3.5 h-3.5 rounded-sm border-2"
                      style={{ borderColor: p.foregroundColor }}
                    >
                      <div
                        className="w-1.5 h-1.5 m-0.5 rounded-xs"
                        style={{ backgroundColor: p.foregroundColor }}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-end">
                    <div
                      className="w-3.5 h-3.5 rounded-sm border-2"
                      style={{ borderColor: p.foregroundColor }}
                    >
                      <div
                        className="w-1.5 h-1.5 m-0.5 rounded-xs"
                        style={{ backgroundColor: p.foregroundColor }}
                      />
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: p.gradientColor2 || p.foregroundColor }}
                    />
                  </div>
                </div>

                {/* 100% Scan Badge for Classic Universal */}
                {isClassicUniversal && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-white font-extrabold text-[8px] tracking-tight uppercase shadow">
                    100% Scan
                  </div>
                )}

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Card Info Label */}
              <div className="w-full mt-2.5 space-y-0.5">
                <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition truncate">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {p.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
