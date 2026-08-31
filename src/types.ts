export type QRType =
  | "url"
  | "wifi"
  | "vcard"
  | "text"
  | "email"
  | "phone"
  | "whatsapp"
  | "sms";

export interface UrlData {
  url: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phoneMobile: string;
  phoneWork: string;
  email: string;
  website: string;
  street: string;
  city: string;
  country: string;
}

export interface TextData {
  text: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export type QRDataMap = {
  url: UrlData;
  wifi: WifiData;
  vcard: VCardData;
  text: TextData;
  email: EmailData;
  phone: PhoneData;
  whatsapp: WhatsAppData;
  sms: SmsData;
};

export type DotStyle =
  | "squares"
  | "squircle"
  | "subtle-rounded"
  | "liquid-blob"
  | "connected"
  | "bold-dots"
  | "dots"
  | "rounded"
  | "extra-rounded"
  | "mosaic"
  | "classy"
  | "hex-dots"
  | "petal"
  | "diamond"
  | "cross"
  | "fluid"
  | "star";

export type CornerFrameStyle = "square" | "rounded" | "circle" | "leaf";

export type CornerDotStyle = "square" | "dot" | "rounded" | "diamond" | "star";

export interface ColorConfig {
  foreground: string;
  background: string;
  transparentBackground: boolean;
  useGradient: boolean;
  gradientType: "linear" | "radial";
  gradientColor2: string;
  gradientAngle: number; // in degrees
  customEyeColors: boolean;
  eyeFrameColor: string;
  eyeDotColor: string;
}

export interface LogoConfig {
  enabled: boolean;
  type: "preset" | "custom";
  presetIcon:
    | "none"
    | "globe"
    | "link"
    | "wifi"
    | "instagram"
    | "whatsapp"
    | "facebook"
    | "twitter"
    | "youtube"
    | "tiktok"
    | "star"
    | "heart"
    | "shopping"
    | "coffee"
    | "music"
    | "lightning";
  customImageUrl?: string;
  sizeRatio: number; // 0.1 to 0.3
  shape: "circle" | "square" | "rounded" | "none";
  border: boolean;
  borderColor: string;
  backgroundColor: string;
}

export interface FrameConfig {
  enabled: boolean;
  style: "banner-bottom" | "badge-top" | "box-outline" | "pill-bottom";
  text: string;
  textColor: string;
  frameColor: string;
}

export interface AIArtConfig {
  enabled: boolean;
  prompt: string;
  imageUrl: string;
  blendMode: "overlay-art" | "background-art" | "subtle-watermark" | "embedded-center";
  opacity: number; // 0 to 1
  contrastOverlay: number; // 0 to 1
  invertQR: boolean;
  isGenerating?: boolean;
}

export interface SpecialEffectsConfig {
  glow: boolean;
  texture: boolean;
  confetti: boolean;
}

export interface QRConfig {
  id: string;
  title: string;
  type: QRType;
  data: QRDataMap[QRType];
  dotStyle: DotStyle;
  cornerFrameStyle: CornerFrameStyle;
  cornerDotStyle: CornerDotStyle;
  color: ColorConfig;
  effects?: SpecialEffectsConfig;
  logo: LogoConfig;
  frame: FrameConfig;
  aiArt: AIArtConfig;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number;
  createdAt: number;
}

export interface AIPreset {
  id: string;
  name: string;
  tagline: string;
  category: "classic" | "business" | "social" | "minimal" | "luxury" | "cyber" | "nature" | "vibrant" | "artistic";
  thumbnailBg: string;
  foregroundColor: string;
  backgroundColor: string;
  useGradient?: boolean;
  gradientColor2?: string;
  dotStyle: DotStyle;
  cornerFrameStyle: CornerFrameStyle;
  cornerDotStyle: CornerDotStyle;
  eyeFrameColor?: string;
  eyeDotColor?: string;
  samplePrompt: string;
  presetIcon?: LogoConfig["presetIcon"];
  frameText?: string;
}

export interface ScannabilityResult {
  scannabilityScore: number;
  status: "EXCELLENT" | "GOOD" | "CAUTION" | "RISKY";
  contrastRatio?: string;
  suggestions: string[];
}
