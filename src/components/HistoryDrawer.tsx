import React from "react";
import { X, Trash2, Edit3, Bookmark, ArrowRight, Clock, Plus } from "lucide-react";
import { QRConfig } from "../types";
import { formatQRDataString } from "../utils/qrEncoder";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: QRConfig[];
  onLoadItem: (item: QRConfig) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 p-6 space-y-6 shadow-2xl text-slate-100 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold">Saved QR Library</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {savedItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Empty State */}
          {savedItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 p-6 text-slate-500">
              <Clock className="w-10 h-10 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-400">No Saved QR Codes Yet</p>
              <p className="text-xs max-w-xs">
                Click the "Save" button under any generated QR code to store it in your library.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {savedItems.map((item) => {
                const targetText = formatQRDataString(item);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-3 group transition"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 truncate">
                        {item.title || "Untitled Design"}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate font-mono">
                        {targetText}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onLoadItem(item);
                          onClose();
                        }}
                        className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
                        title="Load into Editor"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clear All Footer */}
          {savedItems.length > 0 && (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Library</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
