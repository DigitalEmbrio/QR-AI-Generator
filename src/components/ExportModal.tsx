import React, { useState } from "react";
import { X, Download, FileImage, FileText, Check, Sparkles } from "lucide-react";
import { QRConfig } from "../types";
import { renderQRCodeCanvas } from "../utils/qrRenderer";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QRConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [format, setFormat] = useState<"png" | "jpeg" | "svg">("png");
  const [resolution, setResolution] = useState<number>(1024);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Create offscreen canvas for chosen resolution
      const offscreenCanvas = document.createElement("canvas");
      await renderQRCodeCanvas({
        config,
        canvas: offscreenCanvas,
        targetSize: resolution,
      });

      const fileName = `qrcode-ai-${config.type}-${Date.now()}`;

      if (format === "svg") {
        // Convert canvas image to vector SVG container
        const dataUrl = offscreenCanvas.toDataURL("image/png");
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${resolution}" height="${resolution}" viewBox="0 0 ${resolution} ${resolution}">
  <image href="${dataUrl}" width="${resolution}" height="${resolution}"/>
</svg>`;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        triggerDownload(URL.createObjectURL(blob), `${fileName}.svg`);
      } else if (format === "jpeg") {
        const dataUrl = offscreenCanvas.toDataURL("image/jpeg", 0.95);
        triggerDownload(dataUrl, `${fileName}.jpg`);
      } else {
        // PNG
        const dataUrl = offscreenCanvas.toDataURL("image/png");
        triggerDownload(dataUrl, `${fileName}.png`);
      }

      setTimeout(onClose, 500);
    } catch (e) {
      console.error("Export download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const triggerDownload = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold">Export High-Res QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">File Format</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "png", label: "PNG (Lossless)", ext: ".png" },
              { id: "jpeg", label: "JPEG (Web)", ext: ".jpg" },
              { id: "svg", label: "SVG (Vector)", ext: ".svg" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as any)}
                className={`py-3 px-2 rounded-xl text-xs font-medium border text-center transition flex flex-col items-center gap-1 ${
                  format === f.id
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileImage className="w-4 h-4" />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Resolution Size</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { size: 512, label: "512 x 512 px", desc: "Web & Mobile" },
              { size: 1024, label: "1024 x 1024 px", desc: "HD Print & Poster" },
              { size: 2048, label: "2048 x 2048 px", desc: "Ultra 4K Print" },
            ].map((r) => (
              <button
                key={r.size}
                onClick={() => setResolution(r.size)}
                className={`p-3 rounded-xl border text-left transition ${
                  resolution === r.size
                    ? "bg-purple-600/20 border-purple-500 text-purple-200 font-semibold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <p className="text-xs font-bold">{r.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Download Action */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
        >
          {downloading ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>Download {format.toUpperCase()} ({resolution}px)</span>
        </button>
      </div>
    </div>
  );
};
