import { GoogleGenAI } from "@google/genai";

export type AiProvider = "gemini" | "volcengine" | "openai-compatible";

export interface GenerationResult {
  data: Record<string, unknown>;
  provider: AiProvider;
  model: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
}

const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";
const DEFAULT_VOLCENGINE_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3";

export function getConfiguredProvider(): AiProvider {
  const configured = firstEnv(["AI_PROVIDER", "GENSOGEO_AI_PROVIDER", "MIANLEME_AI_PROVIDER"]).toLowerCase().trim();

  if (configured === "volcengine" || configured === "ark") return "volcengine";
  if (configured === "openai-compatible" || configured === "openai_compatible") return "openai-compatible";
  if (configured === "gemini" || configured === "google") return "gemini";

  if (firstEnv(["VOLCENGINE_API_KEY", "ARK_API_KEY", "GENSOGEO_AI_API_KEY", "MIANLEME_AI_API_KEY"])) return "volcengine";
  if (firstEnv(["OPENAI_COMPATIBLE_API_KEY", "OPENAI_API_KEY"]) && firstEnv(["OPENAI_COMPATIBLE_BASE_URL", "OPENAI_API_BASE"])) return "openai-compatible";
  return "gemini";
}

export async function generateJsonWithModel(prompt: string): Promise<GenerationResult> {
  const provider = getConfiguredProvider();
  const rawText = provider === "gemini"
    ? await generateWithGemini(prompt)
    : provider === "volcengine"
      ? await generateWithOpenAiCompatible(prompt, {
          apiKey: requireFirstEnv(["VOLCENGINE_API_KEY", "ARK_API_KEY", "GENSOGEO_AI_API_KEY", "MIANLEME_AI_API_KEY"], "Volcengine Ark API key is not configured."),
          baseUrl: firstEnv(["VOLCENGINE_BASE_URL", "VOLCENGINE_API_BASE", "ARK_API_BASE", "GENSOGEO_AI_API_BASE", "MIANLEME_AI_API_BASE"]) || DEFAULT_VOLCENGINE_BASE_URL,
          model: firstEnv(["VOLCENGINE_MODEL", "VOLCENGINE_MODEL_NAME", "ARK_MODEL", "ARK_MODEL_ID", "ARK_ENDPOINT_ID", "GENSOGEO_AI_MODEL", "MIANLEME_AI_MODEL", "AI_MODEL"]),
          missingModelMessage: "Volcengine Ark model/endpoint is not configured. Set VOLCENGINE_MODEL to your Ark endpoint ID.",
          jsonMode: false,
        })
      : await generateWithOpenAiCompatible(prompt, {
          apiKey: requireFirstEnv(["OPENAI_COMPATIBLE_API_KEY", "OPENAI_API_KEY", "GENSOGEO_AI_API_KEY"], "OpenAI-compatible API key is not configured."),
          baseUrl: requireFirstEnv(["OPENAI_COMPATIBLE_BASE_URL", "OPENAI_API_BASE", "GENSOGEO_AI_API_BASE"], "OpenAI-compatible base URL is not configured."),
          model: firstEnv(["OPENAI_COMPATIBLE_MODEL", "OPENAI_MODEL_NAME", "GENSOGEO_AI_MODEL", "AI_MODEL"]),
          missingModelMessage: "OpenAI-compatible model is not configured. Set OPENAI_COMPATIBLE_MODEL or AI_MODEL.",
          jsonMode: true,
        });

  return {
    data: parseJsonObject(rawText),
    provider,
    model: resolveModelName(provider),
  };
}

async function generateWithGemini(prompt: string) {
  const ai = new GoogleGenAI({
    apiKey: requireFirstEnv(["GEMINI_API_KEY", "GOOGLE_API_KEY", "GENSOGEO_AI_API_KEY", "MIANLEME_AI_API_KEY"], "Gemini API key is not configured."),
  });

  const model = firstEnv(["GEMINI_MODEL", "GEMINI_MODEL_NAME", "GOOGLE_MODEL_NAME", "GENSOGEO_AI_MODEL", "MIANLEME_AI_MODEL", "AI_MODEL"]) || DEFAULT_GEMINI_MODEL;
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return response.text || "{}";
}

async function generateWithOpenAiCompatible(
  prompt: string,
  config: {
    apiKey: string;
    baseUrl: string;
    model: string;
    missingModelMessage: string;
    jsonMode: boolean;
  },
) {
  if (!config.model) {
    throw new Error(config.missingModelMessage);
  }

  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const body = {
    model: config.model,
    messages: [
      {
        role: "system",
        content: "You are a careful multilingual naming engine. Return strict JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: Number(process.env.AI_TEMPERATURE || 0.85),
    max_tokens: Number(process.env.AI_MAX_TOKENS || 2000),
  };
  const requestBody = config.jsonMode
    ? { ...body, response_format: { type: "json_object" } }
    : body;

  let response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  let payload = await response.json().catch(() => ({}));

  if (!response.ok && JSON.stringify(payload).toLowerCase().includes("response_format")) {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    payload = await response.json().catch(() => ({}));
  }

  if (!response.ok) {
    const message = typeof payload?.error?.message === "string"
      ? payload.error.message
      : `OpenAI-compatible request failed with ${response.status}`;
    throw new Error(message);
  }

  const completion = payload as ChatCompletionResponse;
  const content = completion.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => part.text || "")
      .join("")
      .trim();
  }

  throw new Error("Model returned an empty response.");
}

function parseJsonObject(rawText: string) {
  const trimmed = rawText.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("Model did not return valid JSON.");
  }
}

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}

function requireFirstEnv(names: string[], message: string) {
  const value = firstEnv(names);
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function resolveModelName(provider: AiProvider) {
  if (provider === "gemini") return firstEnv(["GEMINI_MODEL", "GEMINI_MODEL_NAME", "GOOGLE_MODEL_NAME", "GENSOGEO_AI_MODEL", "MIANLEME_AI_MODEL", "AI_MODEL"]) || DEFAULT_GEMINI_MODEL;
  if (provider === "volcengine") return firstEnv(["VOLCENGINE_MODEL", "VOLCENGINE_MODEL_NAME", "ARK_MODEL", "ARK_MODEL_ID", "ARK_ENDPOINT_ID", "GENSOGEO_AI_MODEL", "MIANLEME_AI_MODEL", "AI_MODEL"]);
  return firstEnv(["OPENAI_COMPATIBLE_MODEL", "OPENAI_MODEL_NAME", "GENSOGEO_AI_MODEL", "AI_MODEL"]);
}
