import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { QRTypeSelector } from "./components/QRTypeSelector";
import { InputForms } from "./components/InputForms";
import { AIGeneratorTab } from "./components/CustomizerTabs/AIGeneratorTab";
import { ShapesStyleTab } from "./components/CustomizerTabs/ShapesStyleTab";
import { ColorsTab } from "./components/CustomizerTabs/ColorsTab";
import { LogoTab } from "./components/CustomizerTabs/LogoTab";
import { FrameTab } from "./components/CustomizerTabs/FrameTab";
import { DesignsTab } from "./components/CustomizerTabs/DesignsTab";
import { QRPreviewCanvasComponent } from "./components/QRPreviewCanvasComponent";
import { AIScannabilityBadge } from "./components/AIScannabilityBadge";
import { PresetsModal } from "./components/PresetsModal";
import { ExportModal } from "./components/ExportModal";
import { QRScannerModal } from "./components/QRScannerModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AIPreset, QRConfig, QRType } from "./types";
import { PRESET_THEMES } from "./data/presets";
import {
  Sparkles,
  Grid,
  Palette,
  Image as ImageIcon,
  LayoutTemplate,
  Wand2,
  Bookmark,
  Share2,
  Layers,
  Camera,
  Check,
  Dices,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "qrcode_ai_saved_library_v1";

const DEFAULT_CONFIG: QRConfig = {
  id: "default-1",
  title: "My Custom QR Code",
  type: "url",
  data: { url: "https://ai.studio" },
  dotStyle: "rounded",
  cornerFrameStyle: "rounded",
  cornerDotStyle: "rounded",
  color: {
    foreground: "#0f172a",
    background: "#ffffff",
    transparentBackground: false,
    useGradient: true,
    gradientType: "linear",
    gradientColor2: "#4f46e5",
    gradientAngle: 45,
    customEyeColors: false,
    eyeFrameColor: "#0f172a",
    eyeDotColor: "#4f46e5",
  },
  logo: {
    enabled: true,
    type: "preset",
    presetIcon: "link",
    sizeRatio: 0.2,
    shape: "circle",
    border: true,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
  },
  frame: {
    enabled: true,
    style: "banner-bottom",
    text: "SCAN ME",
    textColor: "#ffffff",
    frameColor: "#4f46e5",
  },
  aiArt: {
    enabled: false,
    prompt: "",
    imageUrl: "",
    blendMode: "background-art",
    opacity: 0.8,
    contrastOverlay: 0.3,
    invertQR: false,
  },
  errorCorrectionLevel: "H",
  margin: 2,
  createdAt: Date.now(),
};

export default function App() {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [qrStyleMode, setQrStyleMode] = useState<"custom" | "image" | "ai">("custom");
  const [activeTab, setActiveTab] = useState<"designs" | "logo" | "style" | "colors" | "advanced">("designs");
  const [savedItems, setSavedItems] = useState<QRConfig[]>([]);

  // Modals state
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load saved items from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedItems(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to load saved items from localStorage:", e);
    }
  }, []);

  // Save items to localStorage helper
  const persistSavedItems = (newItems: QRConfig[]) => {
    setSavedItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn("Failed to save items to localStorage:", e);
    }
  };

  const handleSaveToLibrary = () => {
    const newItem: QRConfig = {
      ...config,
      id: "qr-" + Date.now(),
      createdAt: Date.now(),
      title: config.title || `QR ${config.type.toUpperCase()}`,
    };
    persistSavedItems([newItem, ...savedItems]);
  };

  const handleDeleteSavedItem = (id: string) => {
    persistSavedItems(savedItems.filter((i) => i.id !== id));
  };

  const handleClearAllHistory = () => {
    persistSavedItems([]);
  };

  // Handler: Apply Preset
  const handleSelectPreset = (preset: AIPreset) => {
    setConfig((prev) => ({
      ...prev,
      dotStyle: preset.dotStyle,
      cornerFrameStyle: preset.cornerFrameStyle,
      cornerDotStyle: preset.cornerDotStyle,
      color: {
        ...prev.color,
        foreground: preset.foregroundColor,
        background: preset.backgroundColor,
        useGradient: preset.useGradient ?? false,
        gradientColor2: preset.gradientColor2 || preset.foregroundColor,
        customEyeColors: !!(preset.eyeFrameColor || preset.eyeDotColor),
        eyeFrameColor: preset.eyeFrameColor || preset.foregroundColor,
        eyeDotColor: preset.eyeDotColor || preset.foregroundColor,
      },
      logo: {
        ...prev.logo,
        enabled: preset.presetIcon ? true : prev.logo.enabled,
        presetIcon: preset.presetIcon || prev.logo.presetIcon,
      },
      frame: {
        ...prev.frame,
        enabled: preset.frameText ? true : prev.frame.enabled,
        text: preset.frameText || prev.frame.text,
      },
      aiArt: {
        ...prev.aiArt,
        prompt: preset.samplePrompt,
      },
    }));
  };

  // Handler: Randomize / Surprise me
  const handleSurpriseMe = () => {
    const randomPreset = PRESET_THEMES[Math.floor(Math.random() * PRESET_THEMES.length)];
    handleSelectPreset(randomPreset);
  };

  // Handler: Optimize for Redmi and Default Phone Camera App
  const handleOptimizeForRedmi = () => {
    setConfig((prev) => ({
      ...prev,
      dotStyle: "rounded",
      cornerFrameStyle: "rounded",
      cornerDotStyle: "rounded",
      color: {
        ...prev.color,
        foreground: "#0a0a0c",
        background: "#ffffff",
        transparentBackground: false,
        useGradient: false,
      },
      errorCorrectionLevel: "H",
      margin: 3,
      aiArt: {
        ...prev.aiArt,
        enabled: false,
      },
    }));
  };

  const isCurrentSaved = savedItems.some((item) => item.id === config.id);

  // Helper text for step 1 header title
  const getStep1Title = () => {
    switch (config.type) {
      case "url": return "Make QR code from website URL";
      case "whatsapp": return "Make QR code for WhatsApp Message";
      case "wifi": return "Make QR code for Wi-Fi Access";
      case "vcard": return "Make QR code for Digital Contact Card";
      case "email": return "Make QR code for Email Sender";
      case "phone": return "Make QR code for Direct Call";
      default: return `Make QR code for ${config.type.toUpperCase()}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Navbar */}
      <Navbar
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExport={() => setIsExportOpen(true)}
        savedCount={savedItems.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Step 1: Content Type & Input Section */}
        <section className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5">
          {/* Step 1 Numbered Badge & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-sm text-indigo-400 shadow-md">
              1
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              {getStep1Title()}
            </h2>
          </div>

          {/* Interactive Icon Type Selector Bar */}
          <QRTypeSelector
            selectedType={config.type}
            onSelectType={(newType: QRType) => {
              setConfig((prev) => ({
                ...prev,
                type: newType,
              }));
            }}
          />

          {/* Form Input Box */}
          <InputForms
            type={config.type}
            data={config.data}
            onChange={(newData) =>
              setConfig((prev) => ({ ...prev, data: newData }))
            }
          />
        </section>

        {/* Step 2 & 3 + Step 4 Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Steps 2 and 3 (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 2: Choose Your QR Code Style (3 Mode Cards matching screenshot) */}
            <section className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-sm text-indigo-400 shadow-md">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                    Choose Your QR Code Style
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select the foundational rendering mode for your code
                  </p>
                </div>
              </div>

              {/* 3 Prominent Mode Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Card 1: Custom QR */}
                <button
                  type="button"
                  onClick={() => {
                    setQrStyleMode("custom");
                    setConfig((prev) => ({
                      ...prev,
                      aiArt: { ...prev.aiArt, enabled: false },
                    }));
                  }}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all text-center relative group ${
                    qrStyleMode === "custom"
                      ? "bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl"
                      : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2 group-hover:scale-105 transition">
                    <Grid className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-100">Custom QR</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Design your own</div>
                  {qrStyleMode === "custom" && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Card 2: Image QR */}
                <button
                  type="button"
                  onClick={() => {
                    setQrStyleMode("image");
                    setActiveTab("logo");
                  }}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all text-center relative group ${
                    qrStyleMode === "image"
                      ? "bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-xl"
                      : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-100">Image QR</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">With logo or background</div>
                  {qrStyleMode === "image" && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>

                {/* Card 3: QR Art */}
                <button
                  type="button"
                  onClick={() => {
                    setQrStyleMode("ai");
                    setConfig((prev) => ({
                      ...prev,
                      aiArt: { ...prev.aiArt, enabled: true },
                    }));
                  }}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all text-center relative group ${
                    qrStyleMode === "ai"
                      ? "bg-slate-800/90 border-purple-500 ring-2 ring-purple-500/30 shadow-xl"
                      : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="text-xs font-bold text-slate-100">QR Art</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">AI generated design</div>
                  {qrStyleMode === "ai" && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              </div>
            </section>

            {/* Step 3: Design Your QR Code (Subtabs & Customizer Panel) */}
            <section className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-sm text-indigo-400 shadow-md">
                    3
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                      Design Your QR Code
                    </h2>
                    <p className="text-xs text-slate-400">
                      Customize shapes, brand logos, colors, and frame text
                    </p>
                  </div>
                </div>
              </div>

              {/* Subtabs Selector Header */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
                {[
                  { id: "designs", label: "Designs", icon: LayoutTemplate },
                  { id: "logo", label: "Logo", icon: ImageIcon },
                  { id: "style", label: "Style", icon: Grid },
                  { id: "colors", label: "Colors", icon: Palette },
                  { id: "advanced", label: "Advanced", icon: Layers },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Panel Content */}
              <div className="pt-2">
                {activeTab === "designs" && (
                  <DesignsTab
                    config={config}
                    onSelectPreset={handleSelectPreset}
                    onSurpriseMe={handleSurpriseMe}
                  />
                )}

                {activeTab === "logo" && (
                  <LogoTab
                    config={config}
                    onChangeConfig={(partial) =>
                      setConfig((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}

                {activeTab === "style" && (
                  <ShapesStyleTab
                    config={config}
                    onChangeConfig={(partial) =>
                      setConfig((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}

                {activeTab === "colors" && (
                  <ColorsTab
                    config={config}
                    onChangeConfig={(partial) =>
                      setConfig((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}

                {activeTab === "advanced" && (
                  <FrameTab
                    config={config}
                    onChangeConfig={(partial) =>
                      setConfig((prev) => ({ ...prev, ...partial }))
                    }
                  />
                )}
              </div>

              {/* AI Prompt Generator overlay if QR Art Mode is selected */}
              {qrStyleMode === "ai" && (
                <div className="pt-4 border-t border-purple-500/20">
                  <AIGeneratorTab
                    config={config}
                    onChangeConfig={(partial) =>
                      setConfig((prev) => ({ ...prev, ...partial }))
                    }
                    onApplyPresetPrompt={(prompt) =>
                      setConfig((prev) => ({
                        ...prev,
                        aiArt: { ...prev.aiArt, prompt },
                      }))
                    }
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Step 4 Sticky Preview & Redmi Optimizer (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            <section className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-5">
              
              {/* Step 4 Badge & Title */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-sm text-indigo-400 shadow-md">
                    4
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100 tracking-tight">
                      Preview Your QR Code
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Review and download your QR code
                    </p>
                  </div>
                </div>
              </div>

              {/* Canvas Preview Container */}
              <QRPreviewCanvasComponent
                config={config}
                onSaveToLibrary={handleSaveToLibrary}
                onOpenExportModal={() => setIsExportOpen(true)}
                isSaved={isCurrentSaved}
              />

              {/* Scannability Meter & Indonesian Redmi Camera Optimizer */}
              <AIScannabilityBadge
                config={config}
                onOptimizeForRedmi={handleOptimizeForRedmi}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onLoadScannedData={(text) => {
          setConfig((prev) => ({
            ...prev,
            type: "url",
            data: { url: text },
          }));
        }}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedItems={savedItems}
        onLoadItem={(item) => setConfig(item)}
        onDeleteItem={handleDeleteSavedItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}

