import React from "react";
import { AIPreset, QRConfig } from "../../types";
import { PRESET_THEMES } from "../../data/presets";
import { Sparkles, Dices, Check, Wand2 } from "lucide-react";

interface DesignsTabProps {
  config: QRConfig;
  onSelectPreset: (preset: AIPreset) => void;
  onSurpriseMe: () => void;
}

export const DesignsTab: React.FC<DesignsTabProps> = ({
  config,
  onSelectPreset,
  onSurpriseMe,
}) => {
  return (
    <div className="space-y-4">
      {/* Templates Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Templates & Styles</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
              {PRESET_THEMES.length} Presets
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Pick a professionally designed visual theme or randomize for inspiration
          </p>
        </div>

        {/* Surprise me Button */}
        <button
          type="button"
          onClick={onSurpriseMe}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition active:scale-95"
        >
          <Dices className="w-4 h-4 text-purple-200 animate-bounce" />
          <span>Surprise me</span>
        </button>
      </div>

      {/* Preset Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PRESET_THEMES.map((p) => {
          const isSelected =
            config.color.foreground === p.foregroundColor &&
            config.color.background === p.backgroundColor &&
            config.dotStyle === p.dotStyle;

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

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Card Info Label */}
              <div className="w-full mt-2.5 space-y-0.5">
                <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition truncate">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
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
