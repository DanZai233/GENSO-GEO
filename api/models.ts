import type { VercelRequest, VercelResponse } from "@vercel/node";
import { UnifiedLLM } from "unillm-sdk";

/**
 * 拉取指定厂商支持的模型列表(前端选择厂商后调用)。
 * 端点不支持列表时,unillm-sdk 自动回退内置注册表(source: "registry")。
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { provider, apiKey, baseUrl, model } = req.body || {};
    const llm = new UnifiedLLM({
      envPrefix: "GENSOGEO_AI_",
      provider,
      apiKey,
      baseUrl,
      model,
    });
    const result = await llm.listModels();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Vercel models list error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to list models",
    });
  }
}
