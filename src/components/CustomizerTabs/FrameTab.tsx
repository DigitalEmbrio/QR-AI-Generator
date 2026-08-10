import React from "react";
import { FrameConfig, QRConfig } from "../../types";
import { Type, LayoutTemplate } from "lucide-react";

interface FrameTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
}

const PRESET_CALL_TO_ACTIONS = [
  "SCAN ME",
  "SCAN FOR MENU",
  "CONNECT WIFI",
  "FOLLOW US",
  "VIP ACCESS",
  "GET OFFER",
  "READ MORE",
  "ADD CONTACT",
];

export const FrameTab: React.FC<FrameTabProps> = ({ config, onChangeConfig }) => {
  const { frame } = config;

  const updateFrame = (partialFrame: Partial<FrameConfig>) => {
    onChangeConfig({
      frame: {
        ...frame,
        ...partialFrame,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Enable Decorative Frame Toggle */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-100">Call-To-Action Frame Banner</h4>
          <p className="text-[11px] text-slate-400">
            Add a decorative CTA label frame around the QR code to increase scan rates.
          </p>
        </div>
        <input
          type="checkbox"
          checked={frame.enabled}
          onChange={(e) => updateFrame({ enabled: e.target.checked })}
          className="w-5 h-5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
        />
      </div>

      {frame.enabled && (
        <div className="space-y-4">
          {/* CTA Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-400" />
              <span>Call-To-Action Text</span>
            </label>
            <input
              type="text"
              value={frame.text}
              onChange={(e) => updateFrame({ text: e.target.value })}
              placeholder="e.g. SCAN ME"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-600 uppercase tracking-wide focus:outline-none focus:border-indigo-500"
            />

            {/* Quick CTA Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_CALL_TO_ACTIONS.map((cta, idx) => (
                <button
                  key={idx}
                  onClick={() => updateFrame({ text: cta })}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  {cta}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Style */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <LayoutTemplate className="w-4 h-4 text-purple-400" />
              <span>Banner Layout Style</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "banner-bottom", label: "Bottom Banner" },
                { id: "badge-top", label: "Top Badge" },
                { id: "pill-bottom", label: "Rounded Pill" },
                { id: "box-outline", label: "Full Border Box" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() =>
                    updateFrame({ style: st.id as FrameConfig["style"] })
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                    frame.style === st.id
                      ? "bg-purple-600 border-purple-500 text-white font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Frame Banner Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.frameColor || "#4f46e5"}
                  onChange={(e) => updateFrame({ frameColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={frame.frameColor || "#4f46e5"}
                  onChange={(e) => updateFrame({ frameColor: e.target.value })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                CTA Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={frame.textColor || "#ffffff"}
                  onChange={(e) => updateFrame({ textColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={frame.textColor || "#ffffff"}
                  onChange={(e) => updateFrame({ textColor: e.target.value })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
