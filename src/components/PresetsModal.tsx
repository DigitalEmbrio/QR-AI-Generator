import React from "react";
import { X, Sparkles, Check } from "lucide-react";
import { AIPreset } from "../types";
import { PRESET_THEMES } from "../data/presets";

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: AIPreset) => void;
  activePresetId?: string;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  activePresetId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl text-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold">Curated Aesthetic AI Presets</h3>
              <p className="text-xs text-slate-400">
                Instantly apply styled color palettes, dot geometries, and AI prompts.
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

        {/* Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto pr-1">
          {PRESET_THEMES.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPreset(p);
                  onClose();
                }}
                className={`relative p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 group overflow-hidden ${
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
                  <p className="text-xs text-slate-400 mt-0.5">{p.tagline}</p>
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
