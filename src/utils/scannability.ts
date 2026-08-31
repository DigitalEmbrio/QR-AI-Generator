import { QRConfig, ScannabilityResult } from "../types";

/**
 * Convert hex color string to RGB numbers
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16),
    };
  }
  return null;
}

/**
 * Calculate relative luminance according to WCAG 2.1 definition
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculate color contrast ratio between two hex colors (1:1 to 21:1)
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex) || { r: 0, g: 0, b: 0 };
  const bg = hexToRgb(bgHex) || { r: 255, g: 255, b: 255 };

  const l1 = getRelativeLuminance(fg.r, fg.g, fg.b);
  const l2 = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Instant local heuristic analysis of QR Code scannability
 * Highly accurate, zero latency, no rate limits
 */
export function evaluateScannability(config: QRConfig): ScannabilityResult {
  let score = 0;
  const suggestions: string[] = [];

  const bgColor = config.color.transparentBackground ? "#ffffff" : config.color.background;
  const fgColor = config.color.foreground;
  const contrast = calculateContrastRatio(fgColor, bgColor);

  // 1. Color Contrast Evaluation (Max 40 pts)
  if (contrast >= 7) {
    score += 40;
  } else if (contrast >= 4.5) {
    score += 32;
    suggestions.push("Warna kontras sudah cukup baik (AA), namun tingkatkan kontras untuk hasil maksimal di ruang gelap.");
  } else if (contrast >= 3) {
    score += 20;
    suggestions.push("⚠️ Kontras warna agak rendah. Kamera bawaan HP mungkin butuh waktu lebih lama untuk fokus.");
  } else {
    score += 8;
    suggestions.push("❌ Kontras warna sangat rendah! Scanner HP mungkin gagal mendeteksi kode QR. Gunakan warna gelap di atas latar terang.");
  }

  // 2. Dot Style Evaluation (Max 35 pts)
  switch (config.dotStyle) {
    case "squares":
    case "squircle":
    case "subtle-rounded":
    case "connected":
    case "bold-dots":
      score += 35;
      break;
    case "rounded":
    case "extra-rounded":
    case "mosaic":
    case "classy":
    case "hex-dots":
      score += 30;
      break;
    case "dots":
    case "petal":
      score += 26;
      break;
    case "diamond":
    case "cross":
    case "fluid":
    case "star":
      score += 22;
      suggestions.push("Pola titik artistik membutuhkan kontras tinggi agar terbaca cepat oleh kamera bawaan.");
      break;
    default:
      score += 30;
  }

  // 3. Error Correction Level (Max 15 pts)
  switch (config.errorCorrectionLevel) {
    case "H":
      score += 15;
      break;
    case "Q":
      score += 12;
      break;
    case "M":
      score += 9;
      break;
    case "L":
      score += 5;
      if (config.logo.enabled) {
        suggestions.push("⚠️ Pasang logo dengan Error Correction Level L dapat membuat QR sulit dibaca. Ubah ke Level H.");
      }
      break;
  }

  // 4. Margin & Logo Penalty / Bonus (Max 10 pts)
  if (config.margin >= 2) {
    score += 10;
  } else {
    score += 4;
    suggestions.push("Tambahkan margin (Quiet Zone) minimal 2px agar tepi QR mudah dikenali kamera.");
  }

  if (config.logo.enabled) {
    if (config.errorCorrectionLevel !== "H" && config.errorCorrectionLevel !== "Q") {
      score = Math.max(20, score - 15);
      suggestions.push("Logo di tengah memerlukan Error Correction Level 'H' (30% recovery).");
    } else {
      score = Math.max(30, score - 2);
    }
  }

  // 5. AI Background Art effect
  if (config.aiArt.enabled && config.aiArt.imageUrl) {
    if (!config.aiArt.contrastOverlay) {
      score = Math.max(30, score - 14);
      suggestions.push("Aktifkan 'Contrast Shield / Overlay' saat memakai background gambar agar titik QR tetap terbaca jelas.");
    } else {
      score = Math.max(40, score - 4);
    }
  }

  // Clamp score
  const finalScore = Math.min(100, Math.max(10, Math.round(score)));

  let status: ScannabilityResult["status"] = "EXCELLENT";
  if (finalScore < 60) {
    status = "RISKY";
  } else if (finalScore < 80) {
    status = "CAUTION";
  } else if (finalScore < 95) {
    status = "GOOD";
  }

  if (suggestions.length === 0) {
    suggestions.push("Kombinasi kontras dan bentuk optimal! QR Code sangat cepat dan gampang di-scan oleh semua smartphone.");
  }

  return {
    scannabilityScore: finalScore,
    status,
    contrastRatio: `${contrast.toFixed(1)}:1`,
    suggestions,
  };
}
