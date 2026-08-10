import {
  EmailData,
  PhoneData,
  QRConfig,
  SmsData,
  TextData,
  UrlData,
  VCardData,
  WhatsAppData,
  WifiData,
} from "../types";

export function formatQRDataString(config: QRConfig): string {
  const { type, data } = config;

  switch (type) {
    case "url": {
      const urlData = data as UrlData;
      let url = (urlData.url || "https://ai.studio").trim();
      if (!/^https?:\/\//i.test(url) && url.length > 0) {
        url = "https://" + url;
      }
      return url || "https://ai.studio";
    }

    case "wifi": {
      const wifi = data as WifiData;
      const ssid = wifi.ssid || "MyWiFiNetwork";
      const enc = wifi.encryption || "WPA";
      const pass = wifi.password || "";
      const hidden = wifi.hidden ? "H:true;" : "";
      if (enc === "nopass") {
        return `WIFI:S:${ssid};T:nopass;${hidden};`;
      }
      return `WIFI:S:${ssid};T:${enc};P:${pass};${hidden};`;
    }

    case "vcard": {
      const v = data as VCardData;
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${v.lastName || ""};${v.firstName || ""}`,
        `FN:${(v.firstName + " " + v.lastName).trim() || "Contact"}`,
      ];
      if (v.organization) lines.push(`ORG:${v.organization}`);
      if (v.title) lines.push(`TITLE:${v.title}`);
      if (v.phoneMobile) lines.push(`TEL;TYPE=CELL:${v.phoneMobile}`);
      if (v.phoneWork) lines.push(`TEL;TYPE=WORK:${v.phoneWork}`);
      if (v.email) lines.push(`EMAIL:${v.email}`);
      if (v.website) lines.push(`URL:${v.website}`);
      if (v.street || v.city || v.country) {
        lines.push(`ADR:;;${v.street || ""};${v.city || ""};;;${v.country || ""}`);
      }
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "text": {
      const t = data as TextData;
      return t.text || "Hello from AI QR Studio!";
    }

    case "email": {
      const e = data as EmailData;
      const email = e.email || "hello@example.com";
      const params = new URLSearchParams();
      if (e.subject) params.set("subject", e.subject);
      if (e.body) params.set("body", e.body);
      const query = params.toString();
      return `mailto:${email}${query ? "?" + query : ""}`;
    }

    case "phone": {
      const p = data as PhoneData;
      return `tel:${p.phone || "+1234567890"}`;
    }

    case "whatsapp": {
      const w = data as WhatsAppData;
      const cleanPhone = (w.phone || "").replace(/[^0-9]/g, "");
      const msg = encodeURIComponent(w.message || "");
      return `https://wa.me/${cleanPhone || "1234567890"}${msg ? "?text=" + msg : ""}`;
    }

    case "sms": {
      const s = data as SmsData;
      return `SMSTO:${s.phone || "+1234567890"}:${s.message || ""}`;
    }

    default:
      return "https://ai.studio";
  }
}
