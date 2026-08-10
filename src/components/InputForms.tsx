import React from "react";
import {
  EmailData,
  PhoneData,
  QRDataMap,
  QRType,
  SmsData,
  TextData,
  UrlData,
  VCardData,
  WhatsAppData,
  WifiData,
} from "../types";
import { Link, Wifi, Lock, Eye, EyeOff, MessageCircle } from "lucide-react";

interface InputFormsProps {
  type: QRType;
  data: QRDataMap[QRType];
  onChange: (newData: any) => void;
}

const UrlInputForm: React.FC<{
  data: UrlData;
  onChange: (newData: UrlData) => void;
}> = ({ data, onChange }) => {
  const urlData = data || { url: "" };
  const [showUtm, setShowUtm] = React.useState(false);
  const [utmSource, setUtmSource] = React.useState("");
  const [utmMedium, setUtmMedium] = React.useState("");
  const [utmCampaign, setUtmCampaign] = React.useState("");

  const handleApplyUtm = () => {
    let baseUrl = urlData.url.split("?")[0] || urlData.url;
    const params = new URLSearchParams();
    if (utmSource) params.set("utm_source", utmSource);
    if (utmMedium) params.set("utm_medium", utmMedium);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);

    const fullUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    onChange({ ...urlData, url: fullUrl });
  };

  return (
    <div className="space-y-3">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
          <Link className="w-4 h-4" />
        </div>
        <input
          type="url"
          placeholder="https://example.com/my-website"
          value={urlData.url}
          onChange={(e) => onChange({ ...urlData, url: e.target.value })}
          className="w-full pl-10 pr-24 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono transition shadow-inner"
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowUtm(!showUtm)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase transition ${
              showUtm
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            + UTM
          </button>
          <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold" title="Press enter to render">
            ↵
          </div>
        </div>
      </div>

      {/* UTM Builder Panel */}
      {showUtm && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
            <span>UTM Tag Builder</span>
            <span className="text-[10px] text-indigo-400">Auto-appends to URL</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Source (e.g. qrcode)"
              value={utmSource}
              onChange={(e) => setUtmSource(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-xs focus:outline-none"
            />
            <input
              type="text"
              placeholder="Medium (e.g. print)"
              value={utmMedium}
              onChange={(e) => setUtmMedium(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-xs focus:outline-none"
            />
            <input
              type="text"
              placeholder="Campaign (e.g. promo2026)"
              value={utmCampaign}
              onChange={(e) => setUtmCampaign(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 text-xs focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUtm}
            className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            Apply UTM Parameters
          </button>
        </div>
      )}
    </div>
  );
};

const WifiInputForm: React.FC<{
  data: WifiData;
  onChange: (newData: WifiData) => void;
}> = ({ data, onChange }) => {
  const [showWifiPass, setShowWifiPass] = React.useState(false);
  const wifiData = data || {
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          Network Name (SSID)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Wifi className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Home_WiFi_5G"
            value={wifiData.ssid}
            onChange={(e) => onChange({ ...wifiData, ssid: e.target.value })}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showWifiPass ? "text" : "password"}
              placeholder="WiFi Password"
              value={wifiData.password}
              onChange={(e) => onChange({ ...wifiData, password: e.target.value })}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowWifiPass(!showWifiPass)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              {showWifiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Security Encryption
          </label>
          <select
            value={wifiData.encryption}
            onChange={(e) =>
              onChange({
                ...wifiData,
                encryption: e.target.value as "WPA" | "WEP" | "nopass",
              })
            }
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="WPA">WPA / WPA2 / WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={wifiData.hidden}
          onChange={(e) => onChange({ ...wifiData, hidden: e.target.checked })}
          className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
        />
        <span>Hidden SSID Network</span>
      </label>
    </div>
  );
};

export const InputForms: React.FC<InputFormsProps> = ({ type, data, onChange }) => {
  switch (type) {
    case "url":
      return <UrlInputForm data={data as UrlData} onChange={onChange} />;

    case "wifi":
      return <WifiInputForm data={data as WifiData} onChange={onChange} />;

    case "vcard": {
      const v = (data as VCardData) || {
        firstName: "",
        lastName: "",
        organization: "",
        title: "",
        phoneMobile: "",
        phoneWork: "",
        email: "",
        website: "",
        street: "",
        city: "",
        country: "",
      };
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                value={v.firstName}
                onChange={(e) => onChange({ ...v, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                value={v.lastName}
                onChange={(e) => onChange({ ...v, lastName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company / Org</label>
              <input
                type="text"
                placeholder="Acme Corp"
                value={v.organization}
                onChange={(e) => onChange({ ...v, organization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="Design Director"
                value={v.title}
                onChange={(e) => onChange({ ...v, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone</label>
              <input
                type="tel"
                placeholder="+1 234 567 890"
                value={v.phoneMobile}
                onChange={(e) => onChange({ ...v, phoneMobile: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={v.email}
                onChange={(e) => onChange({ ...v, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Website</label>
            <input
              type="url"
              placeholder="https://portfolio.com"
              value={v.website}
              onChange={(e) => onChange({ ...v, website: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      );
    }

    case "whatsapp": {
      const w = (data as WhatsAppData) || { phone: "", message: "" };
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              WhatsApp Phone Number (with Country Code)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-500">
                <MessageCircle className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="+628123456789 or 1234567890"
                value={w.phone}
                onChange={(e) => onChange({ ...w, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Pre-filled Message (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Hi! I scanned your QR code and would like to learn more..."
              value={w.message}
              onChange={(e) => onChange({ ...w, message: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      );
    }

    case "text": {
      const t = (data as TextData) || { text: "" };
      return (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Plain Text Content
          </label>
          <textarea
            rows={3}
            placeholder="Type any custom text, promo code, or message here..."
            value={t.text}
            onChange={(e) => onChange({ ...t, text: e.target.value })}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      );
    }

    case "email": {
      const e = (data as EmailData) || { email: "", subject: "", body: "" };
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              placeholder="support@company.com"
              value={e.email}
              onChange={(ev) => onChange({ ...e, email: ev.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="Inquiry from QR Scan"
              value={e.subject}
              onChange={(ev) => onChange({ ...e, subject: ev.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Message Body
            </label>
            <textarea
              rows={2}
              placeholder="Type initial email body text..."
              value={e.body}
              onChange={(ev) => onChange({ ...e, body: ev.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      );
    }

    case "phone": {
      const p = (data as PhoneData) || { phone: "" };
      return (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            Phone Number to Call
          </label>
          <input
            type="tel"
            placeholder="+1 800 555 0199"
            value={p.phone}
            onChange={(e) => onChange({ ...e, phone: e.target.value })}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      );
    }

    case "sms": {
      const s = (data as SmsData) || { phone: "", message: "" };
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              SMS Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 234 567 890"
              value={s.phone}
              onChange={(e) => onChange({ ...s, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Text Message Body
            </label>
            <textarea
              rows={2}
              placeholder="JOIN offer 123"
              value={s.message}
              onChange={(e) => onChange({ ...s, message: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};

