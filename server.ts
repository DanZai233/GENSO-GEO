import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { UnifiedLLM } from "unillm-sdk";
import { generateDescriptionName, generatePlaceName } from "./lib/nameGeneration.js";
import emaNotesHandler from "./api/ema-notes.js";
import providersHandler from "./api/providers.js";
import modelsHandler from "./api/models.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.post("/api/generate-name", async (req, res) => {
  try {
    const data = await generatePlaceName(req.body || {}, req.body?.modelConfig);
    res.json(data);
  } catch (error) {
    console.error("Name generation error:", error);
    res.status(500).json({
      error: "Failed to generate name",
    });
  }
});

app.post("/api/generate-description-name", async (req, res) => {
  try {
    const data = await generateDescriptionName(req.body || {}, req.body?.modelConfig);
    res.json(data);
  } catch (error) {
    console.error("Description generation error:", error);
    res.status(500).json({
      error: "Failed to generate custom name from description",
    });
  }
});

// 厂商注册表 + 模型列表(前端 AI 设置面板用)
app.get("/api/providers", (req, res) => {
  void providersHandler(req as any, res as any);
});

app.post("/api/models", (req, res) => {
  void modelsHandler(req as any, res as any);
});

app.get("/api/ema-notes", (req, res) => {
  void emaNotesHandler(req as any, res as any);
});

app.post("/api/ema-notes", (req, res) => {
  void emaNotesHandler(req as any, res as any);
});

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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
