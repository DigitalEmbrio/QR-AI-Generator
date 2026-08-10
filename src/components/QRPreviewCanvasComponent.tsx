import React, { useEffect, useRef, useState } from "react";
import { QRConfig } from "../types";
import { renderQRCodeCanvas } from "../utils/qrRenderer";
import { Download, Bookmark, Copy, Check, Sparkles, Eye } from "lucide-react";

interface QRPreviewCanvasComponentProps {
  config: QRConfig;
  onSaveToLibrary: () => void;
  onOpenExportModal: () => void;
  isSaved?: boolean;
}

export const QRPreviewCanvasComponent: React.FC<QRPreviewCanvasComponentProps> = ({
  config,
  onSaveToLibrary,
  onOpenExportModal,
  isSaved,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  // Redraw canvas whenever config changes
  useEffect(() => {
    let isMounted = true;
    const draw = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderQRCodeCanvas({
          config,
          canvas: canvasRef.current,
          targetSize: 800, // High res internal rendering
        });
      } catch (e) {
        console.error("Error rendering QR code canvas:", e);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };

    draw();
    return () => {
      isMounted = false;
    };
  }, [config]);

  // Copy Canvas Image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, "image/png");
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Frame Preview Container */}
      <div className="relative group w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center">
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-2xl transition-all duration-300"
          />

          {/* Rendering Overlay */}
          {isRendering && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex items-center gap-2 w-full max-w-[380px]">
        {/* Copy Image */}
        <button
          onClick={handleCopyImage}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition"
          title="Copy image to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400" />
          )}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>

        {/* Save to Library */}
        <button
          onClick={onSaveToLibrary}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-medium transition ${
            isSaved
              ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
              : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-amber-400 text-amber-400" : "text-amber-400"}`} />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </button>

        {/* High Res Export */}
        <button
          onClick={onOpenExportModal}
          className="flex-[1.4] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
