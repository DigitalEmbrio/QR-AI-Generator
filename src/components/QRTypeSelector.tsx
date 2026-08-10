import React, { useRef } from "react";
import {
  Globe,
  Instagram,
  Star,
  Wifi,
  FileText,
  Video,
  Facebook,
  Youtube,
  MessageCircle,
  Contact,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { QRType } from "../types";

interface QRTypeSelectorProps {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
}

export interface QRTypeOption {
  id: QRType;
  label: string;
  icon: React.FC<{ className?: string }>;
  badgeColor?: string;
}

const TYPES: QRTypeOption[] = [
  { id: "url", label: "WEBSITE URL", icon: Globe },
  { id: "whatsapp", label: "WHATSAPP", icon: MessageCircle, badgeColor: "text-emerald-400" },
  { id: "wifi", label: "WIFI NETWORK", icon: Wifi, badgeColor: "text-blue-400" },
  { id: "vcard", label: "VCARD CONTACT", icon: Contact, badgeColor: "text-purple-400" },
  { id: "text", label: "PLAIN TEXT", icon: FileText, badgeColor: "text-amber-400" },
  { id: "email", label: "EMAIL MSG", icon: Mail, badgeColor: "text-rose-400" },
  { id: "phone", label: "PHONE CALL", icon: Phone, badgeColor: "text-cyan-400" },
];

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -240 : 240,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full group">
      {/* Scroll Left Button */}
      <button
        onClick={() => handleScroll("left")}
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 items-center justify-center shadow-lg hover:bg-slate-800 hover:text-white transition"
        title="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1.5 px-0.5 no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = selectedType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectType(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
                isSelected
                  ? "bg-slate-800 text-white border-2 border-indigo-500 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20 scale-[1.02]"
                  : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-950 text-slate-400 group-hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => handleScroll("right")}
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 items-center justify-center shadow-lg hover:bg-slate-800 hover:text-white transition"
        title="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

