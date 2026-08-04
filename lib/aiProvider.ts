/**
 * AI Provider 适配层 —— 已迁移到统一大模型包 unillm-sdk。
 *
 * 行为与旧实现完全兼容:
 * - 同一组环境变量(AI_PROVIDER / GEMINI_API_KEY / VOLCENGINE_* / OPENAI_COMPATIBLE_*
 *   以及 GENSOGEO_AI_* 前缀),Vercel 上的存量配置无需改动
 * - 未配置任何厂商时默认 gemini(保持旧行为)
 * - 额外支持前端下发 modelConfig(provider/model/apiKey/baseUrl),优先于环境变量
 */
import {
  UnifiedLLM,
  type ProviderConfig,
  type ProviderId,
} from "unillm-sdk";

export type AiProvider = "gemini" | "volcengine" | "openai-compatible";

export interface GenerationResult {
  data: Record<string, unknown>;
  provider: AiProvider;
  model: string;
}

/** 与旧实现一致的自定义环境变量前缀 */
const ENV_PREFIX = "GENSOGEO_AI_";

/** unillm 厂商 ID → GENSO 兼容 ID(openai 系统一归为 openai-compatible) */
function toGensoProvider(id: ProviderId): AiProvider {
  if (id === "gemini") return "gemini";
  if (id === "volcengine") return "volcengine";
  return "openai-compatible";
}

/** 旧行为:任何厂商相关的环境变量都没配时,默认 gemini */
function defaultProviderWhenUnconfigured(): ProviderId | undefined {
  const configured = [
    "GENSOGEO_AI_PROVIDER",
    "AI_PROVIDER",
    "UNILLM_PROVIDER",
    "GENSOGEO_AI_API_KEY",
    "UNILLM_API_KEY",
    "GEMINI_API_KEY",
    "GOOGLE_API_KEY",
    "VOLCENGINE_API_KEY",
    "ARK_API_KEY",
    "OPENAI_COMPATIBLE_API_KEY",
    "CUSTOM_API_KEY",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "DEEPSEEK_API_KEY",
    "MOONSHOT_API_KEY",
    "DASHSCOPE_API_KEY",
    "ZHIPU_API_KEY",
    "XAI_API_KEY",
    "GROQ_API_KEY",
    "MISTRAL_API_KEY",
    "SILICONFLOW_API_KEY",
  ].some((name) => process.env[name]?.trim());
  return configured ? undefined : "gemini";
}

export function getConfiguredProvider(): AiProvider {
  return toGensoProvider(
    new UnifiedLLM({ envPrefix: ENV_PREFIX, provider: defaultProviderWhenUnconfigured() }).provider,
  );
}

/**
 * 用统一大模型包生成 JSON。
 * @param prompt      提示词
 * @param modelConfig 可选的前端下发配置(用户在前端选择的厂商/模型/Key),优先于环境变量
 */
export async function generateJsonWithModel(
  prompt: string,
  modelConfig?: ProviderConfig,
): Promise<GenerationResult> {
  const llm = new UnifiedLLM({
    envPrefix: ENV_PREFIX,
    provider: defaultProviderWhenUnconfigured(),
    ...(modelConfig || {}),
  });
  const data = await llm.generateJson(prompt);
  return {
    data: data as Record<string, unknown>,
    provider: toGensoProvider(llm.provider),
    model: llm.config.model || "",
  };
}
