import React from "react";
import { LogoConfig, QRConfig } from "../../types";
import { Image, Upload, Trash2, Check } from "lucide-react";

interface LogoTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
}

const PRESET_ICONS: { id: LogoConfig["presetIcon"]; label: string }[] = [
  { id: "globe", label: "Globe" },
  { id: "link", label: "Link" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "instagram", label: "Instagram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter / X" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
  { id: "shopping", label: "Shopping" },
  { id: "coffee", label: "Coffee Shop" },
  { id: "music", label: "Music" },
  { id: "lightning", label: "Energy" },
];

export const LogoTab: React.FC<LogoTabProps> = ({ config, onChangeConfig }) => {
  const { logo } = config;

  const updateLogo = (partialLogo: Partial<LogoConfig>) => {
    onChangeConfig({
      logo: {
        ...logo,
        ...partialLogo,
      },
      // Ensure error correction level is at least Q or H when logo is active
      errorCorrectionLevel: logo.enabled ? "H" : config.errorCorrectionLevel,
    });
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateLogo({
        type: "custom",
        customImageUrl: dataUrl,
        enabled: true,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Enable Logo Toggle */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-slate-100">Center Logo / Branding</h4>
          <p className="text-[11px] text-slate-400">
            Embed vector icon or custom brand logo in QR center (uses High Error Correction).
          </p>
        </div>
        <input
          type="checkbox"
          checked={logo.enabled}
          onChange={(e) => updateLogo({ enabled: e.target.checked })}
          className="w-5 h-5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
        />
      </div>

      {logo.enabled && (
        <div className="space-y-5">
          {/* Logo Source Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateLogo({ type: "preset" })}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                logo.type === "preset"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Preset Icons
            </button>
            <button
              onClick={() => updateLogo({ type: "custom" })}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                logo.type === "custom"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Upload Custom Logo
            </button>
          </div>

          {/* Preset Icons Selection */}
          {logo.type === "preset" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Choose Preset Icon</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                {PRESET_ICONS.map((ic) => {
                  const isSelected = logo.presetIcon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      onClick={() => updateLogo({ presetIcon: ic.id })}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-500 text-white font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xs truncate w-full">{ic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Logo Upload */}
          {logo.type === "custom" && (
            <div className="bg-slate-950 p-4 rounded-xl border border-dashed border-slate-800 space-y-3 text-center">
              {logo.customImageUrl ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={logo.customImageUrl}
                      alt="Custom logo preview"
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-slate-200">Custom Logo Loaded</p>
                    <button
                      onClick={() => updateLogo({ customImageUrl: undefined, type: "preset" })}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Logo</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-indigo-400" />
                  <p className="text-xs text-slate-300 font-medium">
                    Click to upload PNG, SVG, or JPG
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Transparent background logos work best
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Logo Size & Shape Adjustments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Logo Size */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Logo Size</span>
                <span className="font-mono text-indigo-400">
                  {Math.round((logo.sizeRatio || 0.2) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.28}
                step={0.02}
                value={logo.sizeRatio || 0.2}
                onChange={(e) => updateLogo({ sizeRatio: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Shape */}
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <label className="block text-xs font-medium text-slate-300">
                Logo Badge Shape
              </label>
              <select
                value={logo.shape}
                onChange={(e) =>
                  updateLogo({
                    shape: e.target.value as LogoConfig["shape"],
                  })
                }
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              >
                <option value="circle">Circle</option>
                <option value="rounded">Soft Rounded Square</option>
                <option value="square">Square</option>
                <option value="none">No Badge Background</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
