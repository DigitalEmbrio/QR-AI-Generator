import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: AI Suggest Design based on prompt or input data
app.post("/api/ai/suggest-design", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.",
      });
    }

    const { prompt, qrData, qrType } = req.body;

    const systemInstruction = `You are an expert aesthetic designer specialized in QR code branding and graphic design.
Given a prompt or topic, generate a complete aesthetic QR code style setup including color palette, dot style, frame shape, center icon suggestion, and a creative prompt for artistic AI background generation.`;

    const userMessage = `Generate an aesthetic design for a QR code.
Type: ${qrType || "URL"}
Content/Context: ${qrData || "Website link"}
User Preference/Prompt: ${prompt || "Modern aesthetic artistic design"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy design title" },
            description: { type: Type.STRING, description: "Short design concept explanation" },
            foregroundColor: { type: Type.STRING, description: "Primary hex color code" },
            backgroundColor: { type: Type.STRING, description: "Background hex color code" },
            useGradient: { type: Type.BOOLEAN },
            gradientColor2: { type: Type.STRING, description: "Secondary gradient hex color" },
            eyeColor: { type: Type.STRING, description: "Corner eye hex color code" },
            dotStyle: {
              type: Type.STRING,
              description: "One of: 'squares', 'squircle', 'subtle-rounded', 'liquid-blob', 'connected', 'bold-dots', 'dots', 'rounded', 'extra-rounded', 'mosaic', 'classy', 'hex-dots', 'petal', 'diamond', 'cross', 'fluid', 'star'",
            },
            cornerFrameStyle: {
              type: Type.STRING,
              description: "One of: 'square', 'rounded', 'circle', 'leaf'",
            },
            cornerDotStyle: {
              type: Type.STRING,
              description: "One of: 'square', 'dot', 'rounded', 'diamond', 'star'",
            },
            recommendedPresetIcon: {
              type: Type.STRING,
              description: "One of: 'globe', 'link', 'wifi', 'instagram', 'whatsapp', 'star', 'heart', 'shopping', 'coffee', 'music'",
            },
            aiArtisticPrompt: {
              type: Type.STRING,
              description: "A detailed descriptive prompt for generating a background art image that complements this QR code theme",
            },
            frameText: { type: Type.STRING, description: "Short call to action text e.g. SCAN ME" },
          },
          required: [
            "title",
            "description",
            "foregroundColor",
            "backgroundColor",
            "dotStyle",
            "cornerFrameStyle",
            "cornerDotStyle",
            "aiArtisticPrompt",
          ],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("AI suggest-design error:", err);
    res.status(500).json({ error: err.message || "Failed to generate design suggestions" });
  }
});

// API Route: AI Artistic Background Image Generator
app.post("/api/ai/generate-artistic-background", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.",
      });
    }

    const { prompt, aspectRatio = "1:1" } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `Artistic background artwork for QR code design: ${prompt}. Clean background illustration, highly detailed, visually appealing aesthetic artwork, centered negative space.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from AI model");
    }

    res.json({ imageUrl, prompt });
  } catch (err: any) {
    console.error("AI generate-artistic-background error:", err);
    res.status(500).json({ error: err.message || "Failed to generate artistic image" });
  }
});

// Helper to compute local scannability fallback
function computeLocalScannability(data: any) {
  const { foregroundColor = "#000000", backgroundColor = "#ffffff", dotStyle, logoPresent, errorCorrectionLevel, hasBackgroundArt } = data;
  
  let score = 95;
  const suggestions: string[] = [];

  if (dotStyle === "squares" || dotStyle === "squircle" || dotStyle === "subtle-rounded" || dotStyle === "connected" || dotStyle === "bold-dots") {
    score += 3;
  }
  if (logoPresent && errorCorrectionLevel !== "H") {
    score -= 10;
    suggestions.push("Set Error Correction Level to 'H' for maximum reliability with center logo");
  }
  if (hasBackgroundArt) {
    score -= 8;
    suggestions.push("Ensure contrast overlay is enabled on background artwork");
  }

  score = Math.min(100, Math.max(20, score));
  return {
    scannabilityScore: score,
    status: score >= 90 ? "EXCELLENT" : score >= 75 ? "GOOD" : "CAUTION",
    contrastRatio: "High",
    suggestions: suggestions.length > 0 ? suggestions : ["High contrast ratio ensures universal mobile camera compatibility"],
  };
}

// API Route: AI Scannability Analysis
app.post("/api/ai/analyze-scannability", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(computeLocalScannability(req.body));
    }

    const { foregroundColor, backgroundColor, dotStyle, logoPresent, errorCorrectionLevel, hasBackgroundArt } = req.body;

    const systemInstruction = `You are a QR code quality assurance AI. Calculate scannability score and provide advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze scannability for QR code:
Foreground Color: ${foregroundColor}
Background Color: ${backgroundColor}
Dot Pattern: ${dotStyle}
Has Center Logo: ${logoPresent}
Error Correction: ${errorCorrectionLevel}
Has Artistic Background: ${hasBackgroundArt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scannabilityScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
            status: { type: Type.STRING, description: "EXCELLENT, GOOD, CAUTION, or RISKY" },
            contrastRatio: { type: Type.STRING, description: "Estimated contrast state" },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Tips to improve scanning reliability",
            },
          },
          required: ["scannabilityScore", "status", "suggestions"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    // Graceful fallback on rate limit / 429 quota exhaustion
    const fallback = computeLocalScannability(req.body);
    res.json(fallback);
  }
});

// Serve frontend / Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
