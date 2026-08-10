import React, { useState } from "react";
import { Sparkles, Image, ShieldCheck, Wand2, RefreshCw, AlertCircle, Layers, Contrast } from "lucide-react";
import { QRConfig } from "../../types";

interface AIGeneratorTabProps {
  config: QRConfig;
  onChangeConfig: (newPartial: Partial<QRConfig>) => void;
  onApplyPresetPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  "Cyberpunk neon alley with glowing cyan rain",
  "Minimalist Japanese cherry blossom watercolor",
  "Luxury dark obsidian marble with liquid gold veins",
  "Lush tropical emerald rainforest with sunlight mist",
  "Retro 80s synthwave sunset over purple grid",
  "Studio Ghibli aesthetic fluffy clouds & blue sky",
];

export const AIGeneratorTab: React.FC<AIGeneratorTabProps> = ({
  config,
  onChangeConfig,
  onApplyPresetPrompt,
}) => {
  const [promptText, setPromptText] = useState(config.aiArt.prompt || "");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handler: AI Auto-Design (Color, Shapes, Theme Prompt)
  const handleAutoDesign = async () => {
    setIsSuggesting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/ai/suggest-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          qrData: JSON.stringify(config.data),
          qrType: config.type,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate AI suggestion");
      }

      const suggestion = await res.json();

      onChangeConfig({
        dotStyle: suggestion.dotStyle || config.dotStyle,
        cornerFrameStyle: suggestion.cornerFrameStyle || config.cornerFrameStyle,
        cornerDotStyle: suggestion.cornerDotStyle || config.cornerDotStyle,
        color: {
          ...config.color,
          foreground: suggestion.foregroundColor || config.color.foreground,
          background: suggestion.backgroundColor || config.color.background,
          useGradient: suggestion.useGradient ?? config.color.useGradient,
          gradientColor2: suggestion.gradientColor2 || config.color.gradientColor2,
          eyeFrameColor: suggestion.eyeColor || config.color.eyeFrameColor,
          eyeDotColor: suggestion.eyeColor || config.color.eyeDotColor,
        },
        logo: {
          ...config.logo,
          enabled: suggestion.recommendedPresetIcon ? true : config.logo.enabled,
          presetIcon: suggestion.recommendedPresetIcon || config.logo.presetIcon,
        },
        frame: {
          ...config.frame,
          enabled: suggestion.frameText ? true : config.frame.enabled,
          text: suggestion.frameText || config.frame.text,
        },
        aiArt: {
          ...config.aiArt,
          prompt: suggestion.aiArtisticPrompt || promptText,
        },
      });

      if (suggestion.aiArtisticPrompt) {
        setPromptText(suggestion.aiArtisticPrompt);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error generating AI suggestion");
    } finally {
      setIsSuggesting(false);
    }
  };

  // Handler: Generate Background Art Image via Gemini
  const handleGenerateArt = async () => {
    const finalPrompt = promptText.trim() || "Aesthetic artistic abstract background design";
    setIsGeneratingArt(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/ai/generate-artistic-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate AI image");
      }

      const data = await res.json();

      onChangeConfig({
        aiArt: {
          ...config.aiArt,
          enabled: true,
          prompt: finalPrompt,
          imageUrl: data.imageUrl,
          contrastOverlay: Math.max(0.2, config.aiArt.contrastOverlay),
        },
        // Ensure error correction is at H for background image blending
        errorCorrectionLevel: "H",
      });
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to generate artistic image");
    } finally {
      setIsGeneratingArt(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* AI Concept Prompt Input */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-100">AI Design Prompt</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            Powered by Gemini
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Describe your visual vision or brand vibe. Gemini AI will configure matching colors, shapes, and background artwork.
        </p>

        <textarea
          rows={3}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="e.g. A serene Japanese cherry blossom garden with soft pink watercolor tones and golden light"
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
            Quick Inspirations:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptText(qp);
                  onApplyPresetPrompt(qp);
                }}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
              >
                {qp.split(" ")[0]} {qp.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAutoDesign}
            disabled={isSuggesting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-md transition"
          >
            {isSuggesting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span>AI Auto-Design Theme</span>
          </button>

          <button
            onClick={handleGenerateArt}
            disabled={isGeneratingArt}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-md transition"
          >
            {isGeneratingArt ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Image className="w-4 h-4" />
            )}
            <span>Generate AI Artwork</span>
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Background Artwork Controls (if enabled) */}
      {config.aiArt.enabled && config.aiArt.imageUrl && (
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-semibold text-slate-200">
                AI Background Blending Controls
              </h4>
            </div>
            <button
              onClick={() =>
                onChangeConfig({
                  aiArt: { ...config.aiArt, enabled: false },
                })
              }
              className="text-[11px] text-rose-400 hover:underline"
            >
              Remove Artwork
            </button>
          </div>

          {/* Contrast Mask Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Readability Contrast Overlay</span>
              <span className="font-mono text-indigo-400">
                {Math.round(config.aiArt.contrastOverlay * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={config.aiArt.contrastOverlay}
              onChange={(e) =>
                onChangeConfig({
                  aiArt: {
                    ...config.aiArt,
                    contrastOverlay: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-500"
            />
            <p className="text-[10px] text-slate-500">
              Higher overlay ensures smartphone camera scanning speed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
