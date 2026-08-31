import React, { useState } from "react";
import { X, Sparkles, Check } from "lucide-react";
import { AIPreset } from "../types";
import { PRESET_THEMES } from "../data/presets";

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: AIPreset) => void;
  activePresetId?: string;
}

type PresetFilter = "all" | "classic" | "business" | "social" | "artistic";

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  activePresetId,
}) => {
  const [activeCategory, setActiveCategory] = useState<PresetFilter>("all");

  if (!isOpen) return null;

  const filteredPresets = PRESET_THEMES.filter((p) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "classic") return p.category === "classic" || p.id === "classic-iso-standard";
    if (activeCategory === "business") return p.category === "business" || p.category === "classic" || p.category === "minimal";
    if (activeCategory === "social") return p.category === "social";
    if (activeCategory === "artistic") return p.category === "artistic" || p.category === "luxury" || p.category === "cyber" || p.category === "nature" || p.category === "vibrant";
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold">Katalog Model & Preset QR Code</h3>
              <p className="text-xs text-slate-400">
                Pilih model standar universal (100% terbaca) atau tema artistik profesional.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {[
            { id: "all", label: "Semua Model" },
            { id: "classic", label: "⭐ Standar Universal" },
            { id: "business", label: "Bisnis & Kantor" },
            { id: "social", label: "Sosial & Chat" },
            { id: "artistic", label: "Artistik & Kreatif" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as PresetFilter)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? "bg-white text-slate-900 shadow-md"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto pr-1">
          {filteredPresets.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPreset(p);
                  onClose();
                }}
                className={`relative p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2.5 group overflow-hidden ${
                  isSelected
                    ? "bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/30"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                }`}
              >
                {/* Background Accent Banner */}
                <div
                  className="h-12 w-full rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: p.thumbnailBg }}
                >
                  <div
                    className="w-8 h-8 rounded-lg shadow-md flex items-center justify-center"
                    style={{ backgroundColor: p.backgroundColor }}
                  >
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: p.foregroundColor }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition">
                      {p.name}
                    </h4>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-indigo-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{p.tagline}</p>
                </div>

                {/* Prompt Preview Badge */}
                <div className="text-[10px] text-slate-500 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 line-clamp-1 italic">
                  "{p.samplePrompt}"
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
