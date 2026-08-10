import React from "react";
import { CornerFrameStyle, CornerDotStyle, DotStyle, QRConfig } from "../../types";
import { Grid, Shield, Maximize2 } from "lucide-react";

interface ShapesStyleTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
}

const DOT_STYLES: { id: DotStyle; label: string }[] = [
  { id: "squares", label: "Classic Squares" },
  { id: "dots", label: "Dots" },
  { id: "rounded", label: "Soft Rounded" },
  { id: "extra-rounded", label: "Pills / Extra Rounded" },
  { id: "classy", label: "Classy" },
  { id: "diamond", label: "Diamonds" },
  { id: "fluid", label: "Fluid Organic" },
  { id: "star", label: "Stars" },
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

export const ShapesStyleTab: React.FC<ShapesStyleTabProps> = ({
  config,
  onChangeConfig,
}) => {
  return (
    <div className="space-y-6">
      {/* Dot Pattern Style */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Grid className="w-4 h-4 text-indigo-400" />
          <span>Data Module Pattern</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DOT_STYLES.map((d) => {
            const isSelected = config.dotStyle === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onChangeConfig({ dotStyle: d.id })}
                className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Frame Style */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Maximize2 className="w-4 h-4 text-purple-400" />
          <span>Corner Frame Style</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CORNER_FRAME_STYLES.map((f) => {
            const isSelected = config.cornerFrameStyle === f.id;
            return (
              <button
                key={f.id}
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
          <Maximize2 className="w-4 h-4 text-pink-400" />
          <span>Corner Eye Dot Style</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {CORNER_DOT_STYLES.map((e) => {
            const isSelected = config.cornerDotStyle === e.id;
            return (
              <button
                key={e.id}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Quiet Zone Margin */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Quiet Zone Margin</span>
            <span className="font-mono text-indigo-400">{config.margin}px</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={config.margin}
            onChange={(e) => onChangeConfig({ margin: parseInt(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Error Correction Level */}
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Error Correction
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {config.errorCorrectionLevel === "H" ? "30% Recovery" : "15-25% Recovery"}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(["L", "M", "Q", "H"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChangeConfig({ errorCorrectionLevel: lvl })}
                className={`py-1 rounded-lg text-xs font-bold transition ${
                  config.errorCorrectionLevel === lvl
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
