import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/generate-name", async (req, res) => {
  try {
    const { placeName, country, locationType } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API Key is not configured." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are a legendary writer steeped in the lore of Touhou Project (东方Project) and Japanese folklore. Your specialty is creating mystical, spell-binding character names inspired by geographical landmarks.
    
Based on the real place: "${placeName}" in "${country}" (Type: ${locationType || 'Location'}), generate a character name in the distinct style of Touhou Project.
Names in Touhou Project blend traditional Japanese cultural elements, Shinto/Buddhist motifs, nature, weather, seasons, folklore, ghosts, yokai, or celestial themes. The character should have an intriguing title/archetype similar to "Shrine Maiden of Paradise" or "Ordinary Magician."

You MUST generate the results in three languages: Chinese (简体中文), English, and Japanese (日本語), keeping the formatting clean.

Provide the response as a JSON object with the following structure:
{
  "placeName_zh": "Translated or transliterated place name in Chinese",
  "placeName_en": "Place name in English",
  "placeName_ja": "Place name in Japanese (e.g. 京都清水寺, 神田明神)",

  "country_zh": "Country name in Chinese (e.g., 日本, 中国, 美国)",
  "country_en": "Country name in English",
  "country_ja": "Country name in Japanese (e.g., 日本, 中国, 米国)",

  "firstName_zh": "Given name in Chinese (e.g., 灵梦)",
  "lastName_zh": "Family name in Chinese (e.g., 博丽)",
  "fullName_zh": "Full name formatted elegantly in Chinese (e.g., 博丽灵梦)",
  "inspiration_zh": "A brief, poetic explanation in Chinese of how the geography, history, or atmosphere inspired this Touhou-themed name and their spell card theme",
  "characterArchetype_zh": "A Touhou-style character title/archetype in Chinese (e.g., 博丽神社的巫女 / 乐园的巫女)",

  "firstName_en": "Given name in English (e.g., Reimu)",
  "lastName_en": "Family name in English (e.g., Hakurei)",
  "fullName_en": "Full name formatted elegantly in English (e.g., Reimu Hakurei)",
  "inspiration_en": "A brief, poetic explanation in English of how the geography, history, or atmosphere inspired this Touhou-themed name and their spell card theme",
  "characterArchetype_en": "A Touhou-style character title/archetype in English (e.g., Shrine Maiden of Paradise / Hakurei Shrine Maiden)",

  "firstName_ja": "Given name in Japanese Kanji/Kana (e.g., 霊夢)",
  "lastName_ja": "Family name in Japanese Kanji/Kana (e.g., 博麗)",
  "fullName_ja": "Full name formatted elegantly in Japanese (e.g., 博麗 霊夢 / はくれい れいむ)",
  "inspiration_ja": "A brief, poetic explanation in Japanese of how the geography, history, or atmosphere inspired this Touhou-themed name and their spell card theme",
  "characterArchetype_ja": "A Touhou-style character title/archetype in Japanese (e.g., 楽園の巫女 / 博麗神社の巫女)"
}

IMPORTANT: Only return the raw JSON object, without any markdown formatting, code block markers, or comments. Ensure it is valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    // Inject fallbacks for backward compatibility
    data.placeName = data.placeName_zh || placeName;
    data.country = data.country_zh || country;
    data.firstName = data.firstName_zh || "";
    data.lastName = data.lastName_zh || "";
    data.fullName = data.fullName_zh || "";
    data.inspiration = data.inspiration_zh || "";
    data.characterArchetype = data.characterArchetype_zh || "";

    data.placeName_ja = data.placeName_ja || data.placeName_zh || placeName;
    data.country_ja = data.country_ja || data.country_zh || country;
    data.firstName_ja = data.firstName_ja || data.firstName_zh || "";
    data.lastName_ja = data.lastName_ja || data.lastName_zh || "";
    data.fullName_ja = data.fullName_ja || data.fullName_zh || "";
    data.inspiration_ja = data.inspiration_ja || data.inspiration_zh || "";
    data.characterArchetype_ja = data.characterArchetype_ja || data.characterArchetype_zh || "";

    res.json(data);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: "Failed to generate name" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
