import React from "react";
import { QRConfig } from "../../types";
import { Palette, Eye, Sparkles } from "lucide-react";

interface ColorsTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
}

const PALETTE_PRESETS = [
  { fg: "#000000", bg: "#ffffff", label: "Classic Black & White" },
  { fg: "#1e1b4b", bg: "#f0f9ff", label: "Midnight & Sky" },
  { fg: "#06b6d4", bg: "#090d16", label: "Cyber Neon" },
  { fg: "#eab308", bg: "#0f0f11", label: "Obsidian Gold" },
  { fg: "#be185d", bg: "#fff1f2", label: "Sakura Pink" },
  { fg: "#059669", bg: "#f0fdf4", label: "Emerald Fresh" },
];

export const ColorsTab: React.FC<ColorsTabProps> = ({ config, onChangeConfig }) => {
  const { color } = config;

  const updateColor = (partialColor: Partial<QRConfig["color"]>) => {
    onChangeConfig({
      color: {
        ...color,
        ...partialColor,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Color Palette Presets */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span>Quick Color Palettes</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PALETTE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() =>
                updateColor({
                  foreground: p.fg,
                  background: p.bg,
                  transparentBackground: false,
                  useGradient: false,
                })
              }
              className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex rounded-md overflow-hidden border border-slate-700">
                <div className="w-4 h-6" style={{ backgroundColor: p.fg }} />
                <div className="w-4 h-6" style={{ backgroundColor: p.bg }} />
              </div>
              <span className="text-[11px] font-medium text-slate-300 truncate">
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Foreground & Background Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Foreground Color */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            QR Foreground Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color.foreground}
              onChange={(e) => updateColor({ foreground: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={color.foreground}
              onChange={(e) => updateColor({ foreground: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300">
              Background Color
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={color.transparentBackground}
                onChange={(e) =>
                  updateColor({ transparentBackground: e.target.checked })
                }
                className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <span>Transparent BG</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              disabled={color.transparentBackground}
              value={color.background}
              onChange={(e) => updateColor({ background: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 disabled:opacity-30"
            />
            <input
              type="text"
              disabled={color.transparentBackground}
              value={color.background}
              onChange={(e) => updateColor({ background: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 disabled:opacity-30"
            />
          </div>
        </div>
      </div>

      {/* Gradient Options */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Enable Foreground Color Gradient</span>
          </label>
          <input
            type="checkbox"
            checked={color.useGradient}
            onChange={(e) => updateColor({ useGradient: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
          />
        </div>

        {color.useGradient && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gradient Color 2
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.gradientColor2 || "#ec4899"}
                    onChange={(e) => updateColor({ gradientColor2: e.target.value })}
                    className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={color.gradientColor2 || "#ec4899"}
                    onChange={(e) => updateColor({ gradientColor2: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gradient Direction
                </label>
                <select
                  value={color.gradientType}
                  onChange={(e) =>
                    updateColor({
                      gradientType: e.target.value as "linear" | "radial",
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
                >
                  <option value="linear">Linear Gradient</option>
                  <option value="radial">Radial Center Glow</option>
                </select>
              </div>
            </div>

            {color.gradientType === "linear" && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Gradient Angle</span>
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
                  className="w-full accent-indigo-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Corner Eye Colors */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Custom Corner Eye Colors</span>
          </label>
          <input
            type="checkbox"
            checked={color.customEyeColors}
            onChange={(e) => updateColor({ customEyeColors: e.target.checked })}
            className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
          />
        </div>

        {color.customEyeColors && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Corner Frame Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color.eyeFrameColor || color.foreground}
                  onChange={(e) => updateColor({ eyeFrameColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={color.eyeFrameColor || color.foreground}
                  onChange={(e) => updateColor({ eyeFrameColor: e.target.value })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Corner Inner Eye Dot Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color.eyeDotColor || color.foreground}
                  onChange={(e) => updateColor({ eyeDotColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={color.eyeDotColor || color.foreground}
                  onChange={(e) => updateColor({ eyeDotColor: e.target.value })}
                  className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
