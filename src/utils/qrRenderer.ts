import QRCode from "qrcode";
import { QRConfig } from "../types";
import { formatQRDataString } from "./qrEncoder";

interface RenderOptions {
  config: QRConfig;
  canvas: HTMLCanvasElement;
  targetSize?: number; // Canvas width/height in px
}

// Preset Icon SVGs converted to Path Data / Drawing instructions
export const PRESET_ICONS_SVG: Record<string, string> = {
  globe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  wifi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>`,
  tiktok: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  shopping: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  music: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  lightning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

/**
 * Custom Canvas Renderer for Aesthetic & Artistic QR Codes
 */
export async function renderQRCodeCanvas({
  config,
  canvas,
  targetSize = 800,
}: RenderOptions): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const qrText = formatQRDataString(config);

  // Generate QR Raw Matrix
  const qrRaw = QRCode.create(qrText, {
    errorCorrectionLevel: config.errorCorrectionLevel || "H",
  });

  const moduleCount = qrRaw.modules.size; // e.g., 25, 29, 33...
  const marginModules = config.margin ?? 2;
  const totalModules = moduleCount + marginModules * 2;

  canvas.width = targetSize;
  canvas.height = targetSize;

  // Clear canvas
  ctx.clearRect(0, 0, targetSize, targetSize);

  // Frame Calculation
  const isFrameEnabled = config.frame?.enabled;
  let qrX = 0;
  let qrY = 0;
  let qrSize = targetSize;

  if (isFrameEnabled) {
    const frameColor = config.frame.frameColor || "#4f46e5";
    const textColor = config.frame.textColor || "#ffffff";
    const frameStyle = config.frame.style || "banner-bottom";
    const frameText = config.frame.text || "SCAN ME";

    // 1. Draw Outer Frame Container with Rounded Corners
    const outerRadius = targetSize * 0.08;
    ctx.fillStyle = frameColor;
    drawRoundRect(ctx, 0, 0, targetSize, targetSize, outerRadius);
    ctx.fill();

    // Calculate Inner QR Box Dimensions
    qrSize = targetSize * 0.78;
    qrX = (targetSize - qrSize) / 2;

    if (frameStyle === "badge-top") {
      qrY = targetSize * 0.17; // Placed lower to accommodate top badge

      // Draw Top Badge / Pill
      const badgeW = Math.min(targetSize * 0.65, frameText.length * targetSize * 0.035 + targetSize * 0.18);
      const badgeH = targetSize * 0.085;
      const badgeX = (targetSize - badgeW) / 2;
      const badgeY = targetSize * 0.045;

      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
      ctx.fill();

      // Badge Text
      ctx.fillStyle = textColor;
      ctx.font = `900 ${targetSize * 0.034}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frameText.toUpperCase(), targetSize / 2, badgeY + badgeH / 2);
      ctx.restore();
    } else if (frameStyle === "banner-bottom" || frameStyle === "pill-bottom") {
      qrY = targetSize * 0.045; // Placed at top

      // Draw Bottom Banner or Pill
      const isPill = frameStyle === "pill-bottom";
      const bannerW = isPill
        ? Math.min(targetSize * 0.7, Math.max(targetSize * 0.45, frameText.length * targetSize * 0.035 + targetSize * 0.18))
        : targetSize * 0.82;
      const bannerH = targetSize * 0.095;
      const bannerX = (targetSize - bannerW) / 2;
      const bannerY = qrY + qrSize + (targetSize - (qrY + qrSize) - bannerH) / 2;

      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      const bannerRadius = isPill ? bannerH / 2 : targetSize * 0.03;
      drawRoundRect(ctx, bannerX, bannerY, bannerW, bannerH, bannerRadius);
      ctx.fill();

      // Banner Text
      ctx.fillStyle = textColor;
      ctx.font = `900 ${targetSize * 0.036}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(frameText.toUpperCase(), targetSize / 2, bannerY + bannerH / 2);
      ctx.restore();
    } else {
      // Box outline or standard frame
      qrY = (targetSize - qrSize) / 2;
    }

    // Draw Inner White/Custom Card Base for QR Code
    const innerCardRadius = targetSize * 0.04;
    ctx.save();
    ctx.fillStyle = config.color.background || "#ffffff";
    drawRoundRect(ctx, qrX, qrY, qrSize, qrSize, innerCardRadius);
    ctx.fill();
    ctx.restore();
  }

  const moduleSize = qrSize / totalModules;
  const offsetX = qrX + marginModules * moduleSize;
  const offsetY = qrY + marginModules * moduleSize;

  // 1. Draw Inner QR Box Background
  if (config.color.transparentBackground && !config.aiArt.enabled && !isFrameEnabled) {
    // Transparent background
  } else if (config.aiArt.enabled && config.aiArt.imageUrl) {
    // Draw AI Background Image inside inner box
    await drawBackgroundImage(ctx, config.aiArt.imageUrl, qrX, qrY, qrSize);

    // Apply Contrast Mask if enabled
    if (config.aiArt.contrastOverlay > 0) {
      ctx.save();
      ctx.fillStyle = config.color.background;
      ctx.globalAlpha = config.aiArt.contrastOverlay;
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.restore();
    }
  } else {
    // Solid or Gradient Background inside inner box
    ctx.save();
    ctx.fillStyle = config.color.background;
    drawRoundRect(ctx, qrX, qrY, qrSize, qrSize, isFrameEnabled ? targetSize * 0.04 : 0);
    ctx.fill();
    ctx.restore();
  }

  // Draw Texture Effect if enabled
  if (config.effects?.texture) {
    ctx.save();
    ctx.fillStyle = config.color.foreground;
    ctx.globalAlpha = 0.05;
    const step = 8;
    for (let tx = qrX; tx < qrX + qrSize; tx += step) {
      for (let ty = qrY; ty < qrY + qrSize; ty += step) {
        if ((Math.floor(tx / step) + Math.floor(ty / step)) % 2 === 0) {
          ctx.beginPath();
          ctx.arc(tx + step / 2, ty + step / 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // Draw Confetti Effect if enabled
  if (config.effects?.confetti) {
    ctx.save();
    const confettiColors = ["#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
    // Deterministic pseudo-random seed based on size
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dist = qrSize * 0.46 + ((i * 17) % 30) - 15;
      const cx = qrX + qrSize / 2 + Math.cos(angle) * dist;
      const cy = qrY + qrSize / 2 + Math.sin(angle) * dist;
      
      // Keep inside container
      if (cx >= 8 && cx <= targetSize - 8 && cy >= 8 && cy <= targetSize - 8) {
        ctx.fillStyle = confettiColors[i % confettiColors.length];
        ctx.globalAlpha = 0.65;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((i * 45 * Math.PI) / 180);
        if (i % 3 === 0) {
          ctx.fillRect(-3, -3, 6, 6);
        } else if (i % 3 === 1) {
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-4, -1.5, 8, 3);
        }
        ctx.restore();
      }
    }
    ctx.restore();
  }

  // Helper to check if a module is inside Finder Pattern (top-left, top-right, bottom-left 7x7 areas)
  const isFinderPattern = (r: number, c: number): boolean => {
    if (r < 7 && c < 7) return true; // Top-Left
    if (r < 7 && c >= moduleCount - 7) return true; // Top-Right
    if (r >= moduleCount - 7 && c < 7) return true; // Bottom-Left
    return false;
  };

  // 2. Prepare Foreground Fill (Solid or Gradient)
  let fgStyle: string | CanvasGradient = config.color.foreground;
  if (config.color.useGradient) {
    if (config.color.gradientType === "radial") {
      const grad = ctx.createRadialGradient(
        qrX + qrSize / 2,
        qrY + qrSize / 2,
        10,
        qrX + qrSize / 2,
        qrY + qrSize / 2,
        qrSize / 1.2
      );
      grad.addColorStop(0, config.color.foreground);
      grad.addColorStop(1, config.color.gradientColor2 || config.color.foreground);
      fgStyle = grad;
    } else {
      // Linear gradient with angle
      const rad = ((config.color.gradientAngle || 45) * Math.PI) / 180;
      const x1 = (qrX + qrSize / 2) - (Math.cos(rad) * qrSize) / 2;
      const y1 = (qrY + qrSize / 2) - (Math.sin(rad) * qrSize) / 2;
      const x2 = (qrX + qrSize / 2) + (Math.cos(rad) * qrSize) / 2;
      const y2 = (qrY + qrSize / 2) + (Math.sin(rad) * qrSize) / 2;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, config.color.foreground);
      grad.addColorStop(1, config.color.gradientColor2 || config.color.foreground);
      fgStyle = grad;
    }
  }

  // 3. Draw Data Modules (excluding 7x7 finder patterns & logo area)
  ctx.fillStyle = fgStyle;
  if (config.effects?.glow) {
    ctx.shadowColor = typeof fgStyle === "string" ? fgStyle : config.color.foreground;
    ctx.shadowBlur = Math.max(3, moduleSize * 0.4);
  } else {
    ctx.shadowBlur = 0;
  }

  // Calculate logo exclusion box if logo is enabled
  let logoMinRow = -1,
    logoMaxRow = -1,
    logoMinCol = -1,
    logoMaxCol = -1;
  if (config.logo.enabled) {
    const logoRatio = config.logo.sizeRatio || 0.22;
    const logoModules = Math.ceil(moduleCount * logoRatio);
    const center = Math.floor(moduleCount / 2);
    const half = Math.floor(logoModules / 2);
    logoMinRow = center - half;
    logoMaxRow = center + half;
    logoMinCol = center - half;
    logoMaxCol = center + half;
  }

  // Helper to check active dark module
  const isModuleDarkAndActive = (r: number, c: number): boolean => {
    if (r < 0 || r >= moduleCount || c < 0 || c >= moduleCount) return false;
    if (isFinderPattern(r, c)) return false;
    if (
      config.logo.enabled &&
      r >= logoMinRow &&
      r <= logoMaxRow &&
      c >= logoMinCol &&
      c <= logoMaxCol
    ) {
      return false;
    }
    return qrRaw.modules.get(r, c) === 1;
  };

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      // Is matrix module active (1)?
      const isDark = qrRaw.modules.get(r, c) === 1;

      if (!isDark) continue;
      if (isFinderPattern(r, c)) continue;

      // Skip modules under central logo
      if (
        config.logo.enabled &&
        r >= logoMinRow &&
        r <= logoMaxRow &&
        c >= logoMinCol &&
        c <= logoMaxCol
      ) {
        continue;
      }

      const x = offsetX + c * moduleSize;
      const y = offsetY + r * moduleSize;

      const neighbors = {
        top: isModuleDarkAndActive(r - 1, c),
        bottom: isModuleDarkAndActive(r + 1, c),
        left: isModuleDarkAndActive(r, c - 1),
        right: isModuleDarkAndActive(r, c + 1),
        topLeft: isModuleDarkAndActive(r - 1, c - 1),
        topRight: isModuleDarkAndActive(r - 1, c + 1),
        bottomLeft: isModuleDarkAndActive(r + 1, c - 1),
        bottomRight: isModuleDarkAndActive(r + 1, c + 1),
      };

      drawDotModule(ctx, x, y, moduleSize, config.dotStyle, fgStyle, neighbors);
    }
  }

  // 4. Draw Custom Finder Patterns (Corner Frames & Eyes)
  drawCornerFinderPatterns(
    ctx,
    offsetX,
    offsetY,
    moduleSize,
    moduleCount,
    config,
    fgStyle
  );

  // 5. Draw Central Logo / Branding
  if (config.logo.enabled) {
    await drawCenterLogo(ctx, qrX, qrY, qrSize, config.logo);
  }
}

interface ModuleNeighbors {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
}

/**
 * Draw single dot module based on selected DotStyle
 */
function drawDotModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: QRConfig["dotStyle"],
  fillStyle: string | CanvasGradient,
  neighbors: ModuleNeighbors
) {
  ctx.fillStyle = fillStyle;

  switch (style) {
    case "liquid-blob": {
      // Liquid Blob / Organic Flow / Circuit Metaballs (as in uploaded screenshot)
      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = size * 0.44;

      // Base central round module
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Fluid orthogonal connector bridges
      const bridgeW = size * 0.88;
      const halfB = bridgeW / 2;

      if (neighbors.top) {
        ctx.fillRect(cx - halfB, y, bridgeW, size * 0.5 + 0.5);
      }
      if (neighbors.bottom) {
        ctx.fillRect(cx - halfB, cy - 0.5, bridgeW, size * 0.5 + 0.5);
      }
      if (neighbors.left) {
        ctx.fillRect(x, cy - halfB, size * 0.5 + 0.5, bridgeW);
      }
      if (neighbors.right) {
        ctx.fillRect(cx - 0.5, cy - halfB, size * 0.5 + 0.5, bridgeW);
      }

      // Smooth diagonal corner fillings when adjacent paths turn
      if (neighbors.top && neighbors.right && neighbors.topRight) {
        ctx.fillRect(cx, y, size * 0.5, size * 0.5);
      }
      if (neighbors.bottom && neighbors.right && neighbors.bottomRight) {
        ctx.fillRect(cx, cy, size * 0.5, size * 0.5);
      }
      if (neighbors.bottom && neighbors.left && neighbors.bottomLeft) {
        ctx.fillRect(x, cy, size * 0.5, size * 0.5);
      }
      if (neighbors.top && neighbors.left && neighbors.topLeft) {
        ctx.fillRect(x, y, size * 0.5, size * 0.5);
      }
      break;
    }
    case "squircle": {
      // Modern Apple-style Squircle (96% area coverage, ultra-high scannability)
      const r = size * 0.2;
      drawRoundRect(ctx, x + size * 0.02, y + size * 0.02, size * 0.96, size * 0.96, r);
      ctx.fill();
      break;
    }
    case "subtle-rounded": {
      // Crisp subtle corners (98% area coverage, maximum camera readability)
      const r = size * 0.12;
      drawRoundRect(ctx, x + size * 0.01, y + size * 0.01, size * 0.98, size * 0.98, r);
      ctx.fill();
      break;
    }
    case "connected": {
      // Neighbor-aware connected modules (continuous flow, zero gap threshold errors)
      const r = size * 0.42;
      const tl = !neighbors.top && !neighbors.left ? r : 0;
      const tr = !neighbors.top && !neighbors.right ? r : 0;
      const br = !neighbors.bottom && !neighbors.right ? r : 0;
      const bl = !neighbors.bottom && !neighbors.left ? r : 0;
      drawCustomRoundRect(ctx, x, y, size, size, tl, tr, br, bl);
      ctx.fill();
      break;
    }
    case "bold-dots": {
      // Bold large circle (96% diameter coverage, highly visible to camera sensors)
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.48, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "dots": {
      // Classic regular circle
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.42, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "rounded": {
      const r = size * 0.28;
      drawRoundRect(ctx, x + size * 0.04, y + size * 0.04, size * 0.92, size * 0.92, r);
      ctx.fill();
      break;
    }
    case "extra-rounded": {
      const r = size * 0.44;
      drawRoundRect(ctx, x + size * 0.04, y + size * 0.04, size * 0.92, size * 0.92, r);
      ctx.fill();
      break;
    }
    case "mosaic": {
      // Alternating geometric mosaic tiles
      const col = Math.round(x / size);
      const row = Math.round(y / size);
      const alt = (col + row) % 2 === 0;
      const r = size * 0.38;
      if (alt) {
        drawCustomRoundRect(ctx, x + size * 0.03, y + size * 0.03, size * 0.94, size * 0.94, r, 0, r, 0);
      } else {
        drawCustomRoundRect(ctx, x + size * 0.03, y + size * 0.03, size * 0.94, size * 0.94, 0, r, 0, r);
      }
      ctx.fill();
      break;
    }
    case "classy": {
      drawCustomRoundRect(
        ctx,
        x + size * 0.03,
        y + size * 0.03,
        size * 0.94,
        size * 0.94,
        0,
        size * 0.42,
        0,
        size * 0.42
      );
      ctx.fill();
      break;
    }
    case "hex-dots": {
      drawHexagon(ctx, x + size / 2, y + size / 2, size * 0.48);
      ctx.fill();
      break;
    }
    case "petal": {
      drawCustomRoundRect(
        ctx,
        x + size * 0.03,
        y + size * 0.03,
        size * 0.94,
        size * 0.94,
        size * 0.46,
        0,
        size * 0.46,
        0
      );
      ctx.fill();
      break;
    }
    case "diamond": {
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y + size * 0.04);
      ctx.lineTo(x + size * 0.96, y + size / 2);
      ctx.lineTo(x + size / 2, y + size * 0.96);
      ctx.lineTo(x + size * 0.04, y + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "cross": {
      const pad = size * 0.04;
      const w = size - pad * 2;
      const arm = w * 0.42;
      const offset = (w - arm) / 2;
      ctx.fillRect(x + pad + offset, y + pad, arm, w);
      ctx.fillRect(x + pad, y + pad + offset, w, arm);
      break;
    }
    case "fluid": {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.48, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "star": {
      drawStar(ctx, x + size / 2, y + size / 2, 4, size * 0.48, size * 0.22);
      ctx.fill();
      break;
    }
    case "squares":
    default: {
      ctx.fillRect(x, y, size, size);
      break;
    }
  }
}

/**
 * Draw the three Corner Finder Patterns (7x7 modules each)
 */
function drawCornerFinderPatterns(
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  moduleSize: number,
  moduleCount: number,
  config: QRConfig,
  defaultFgStyle: string | CanvasGradient
) {
  const corners = [
    { r: 0, c: 0 }, // Top-Left
    { r: 0, c: moduleCount - 7 }, // Top-Right
    { r: moduleCount - 7, c: 0 }, // Bottom-Left
  ];

  const frameColor =
    config.color.customEyeColors && config.color.eyeFrameColor
      ? config.color.eyeFrameColor
      : defaultFgStyle;

  const dotColor =
    config.color.customEyeColors && config.color.eyeDotColor
      ? config.color.eyeDotColor
      : defaultFgStyle;

  corners.forEach(({ r, c }) => {
    const fx = offsetX + c * moduleSize;
    const fy = offsetY + r * moduleSize;
    const frameSize = 7 * moduleSize;

    // 1. Draw Outer Frame (7x7 with 1 module thickness)
    ctx.fillStyle = frameColor;
    const frameStyle = config.cornerFrameStyle;

    if (frameStyle === "circle") {
      // Outer Circle
      ctx.beginPath();
      ctx.arc(fx + frameSize / 2, fy + frameSize / 2, frameSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Clear Inner Hole (5x5)
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(
        fx + frameSize / 2,
        fy + frameSize / 2,
        (5 * moduleSize) / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
    } else if (frameStyle === "rounded") {
      const radius = moduleSize * 2;
      drawRoundRect(ctx, fx, fy, frameSize, frameSize, radius);
      ctx.fill();

      // Clear Inner Hole
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      drawRoundRect(
        ctx,
        fx + moduleSize,
        fy + moduleSize,
        5 * moduleSize,
        5 * moduleSize,
        radius * 0.6
      );
      ctx.fill();
      ctx.restore();
    } else if (frameStyle === "leaf") {
      const radius = frameSize * 0.5;
      ctx.beginPath();
      ctx.moveTo(fx + radius, fy);
      ctx.arcTo(fx + frameSize, fy, fx + frameSize, fy + frameSize, radius);
      ctx.arcTo(fx + frameSize, fy + frameSize, fx, fy + frameSize, 0);
      ctx.arcTo(fx, fy + frameSize, fx, fy, radius);
      ctx.arcTo(fx, fy, fx + frameSize, fy, 0);
      ctx.closePath();
      ctx.fill();

      // Clear Inner Hole
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(fx + moduleSize, fy + moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.restore();
    } else {
      // Square
      ctx.fillRect(fx, fy, frameSize, frameSize);
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(fx + moduleSize, fy + moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.restore();
    }

    // 2. Draw Inner Eye Dot (3x3 modules centered)
    ctx.fillStyle = dotColor;
    const eyeX = fx + 2 * moduleSize;
    const eyeY = fy + 2 * moduleSize;
    const eyeSize = 3 * moduleSize;

    const eyeStyle = config.cornerDotStyle;
    if (eyeStyle === "dot" || eyeStyle === "rounded") {
      ctx.beginPath();
      ctx.arc(eyeX + eyeSize / 2, eyeY + eyeSize / 2, eyeSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (eyeStyle === "diamond") {
      ctx.beginPath();
      ctx.moveTo(eyeX + eyeSize / 2, eyeY);
      ctx.lineTo(eyeX + eyeSize, eyeY + eyeSize / 2);
      ctx.lineTo(eyeX + eyeSize / 2, eyeY + eyeSize);
      ctx.lineTo(eyeX, eyeY + eyeSize / 2);
      ctx.closePath();
      ctx.fill();
    } else if (eyeStyle === "star") {
      drawStar(ctx, eyeX + eyeSize / 2, eyeY + eyeSize / 2, 4, eyeSize / 2, eyeSize / 4);
      ctx.fill();
    } else {
      // Square
      ctx.fillRect(eyeX, eyeY, eyeSize, eyeSize);
    }
  });
}

/**
 * Draw Central Logo / Icon
 */
async function drawCenterLogo(
  ctx: CanvasRenderingContext2D,
  qrX: number,
  qrY: number,
  qrSize: number,
  logoConfig: QRConfig["logo"]
) {
  const logoRatio = logoConfig.sizeRatio || 0.22;
  const logoSize = qrSize * logoRatio;
  const logoX = qrX + (qrSize - logoSize) / 2;
  const logoY = qrY + (qrSize - logoSize) / 2;

  // Draw Logo Background container
  ctx.save();
  ctx.fillStyle = logoConfig.backgroundColor || "#ffffff";
  if (logoConfig.border) {
    ctx.strokeStyle = logoConfig.borderColor || "#000000";
    ctx.lineWidth = Math.max(2, logoSize * 0.05);
  }

  if (logoConfig.shape === "circle") {
    ctx.beginPath();
    ctx.arc(
      logoX + logoSize / 2,
      logoY + logoSize / 2,
      logoSize / 2 + 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    if (logoConfig.border) ctx.stroke();
  } else if (logoConfig.shape === "rounded") {
    drawRoundRect(
      ctx,
      logoX - 4,
      logoY - 4,
      logoSize + 8,
      logoSize + 8,
      logoSize * 0.25
    );
    ctx.fill();
    if (logoConfig.border) ctx.stroke();
  } else if (logoConfig.shape === "square") {
    ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
    if (logoConfig.border) ctx.strokeRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);
  }
  ctx.restore();

  // Render Preset Icon SVG or Custom Image
  if (logoConfig.type === "preset" && logoConfig.presetIcon !== "none") {
    const svgStr = PRESET_ICONS_SVG[logoConfig.presetIcon];
    if (svgStr) {
      await renderSvgToCanvas(ctx, svgStr, logoX, logoY, logoSize);
    }
  } else if (logoConfig.type === "custom" && logoConfig.customImageUrl) {
    try {
      const img = await loadImage(logoConfig.customImageUrl);
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
    } catch (e) {
      console.warn("Failed to load logo image:", e);
    }
  }
}

/**
 * Utility: Draw Rounded Rectangle
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Utility: Draw Custom Rounded Rectangle with distinct corner radii
 */
function drawCustomRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
) {
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr > 0) ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  if (br > 0) ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  if (bl > 0) ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  if (tl > 0) ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}

/**
 * Utility: Draw Regular Hexagon
 */
function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * Utility: Draw Star
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

/**
 * Helper: Load image from URL / Base64
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Helper: Draw AI Background Image
 */
async function drawBackgroundImage(
  ctx: CanvasRenderingContext2D,
  imageUrl: string,
  x: number,
  y: number,
  targetSize: number
) {
  try {
    const img = await loadImage(imageUrl);
    ctx.drawImage(img, x, y, targetSize, targetSize);
  } catch (e) {
    console.warn("Error drawing background image:", e);
  }
}

/**
 * Helper: Render SVG string onto canvas
 */
function renderSvgToCanvas(
  ctx: CanvasRenderingContext2D,
  svgStr: string,
  x: number,
  y: number,
  size: number
): Promise<void> {
  return new Promise((resolve) => {
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x, y, size, size);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    img.src = url;
  });
}
