export { DashboardOptions, serveDashboard, startDashboard } from './dashboard.js';
import 'node:http';

/** 支持的模型厂商 ID */
type ProviderId = "openai" | "anthropic" | "gemini" | "volcengine" | "deepseek" | "moonshot" | "qwen" | "zhipu" | "xai" | "groq" | "mistral" | "ollama" | "siliconflow" | "custom";
/** 厂商的协议类型:openai = OpenAI 兼容 chat/completions;anthropic = Messages API;gemini = generateContent */
type ProviderKind = "openai" | "anthropic" | "gemini";
interface TextPart {
    type: "text";
    text: string;
}
interface ImagePart {
    type: "image";
    /** 图片 http(s) URL(OpenAI 系 / Anthropic 支持;Gemini 请用 base64) */
    imageUrl?: string;
    /** base64 编码的图片数据 */
    base64?: string;
    /** 图片 MIME 类型,如 image/png,缺省按 image/png 处理 */
    mimeType?: string;
}
type ContentPart = TextPart | ImagePart;
/** 消息内容:纯文本,或混合内容(文本 + 图片) */
type MessageContent = string | ContentPart[];
interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: MessageContent;
}
/** 模型配置(可来自代码 / env / unillm.config.json 三处,优先级从高到低) */
interface ProviderConfig {
    provider?: ProviderId;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    /** 单次请求超时(毫秒),默认 120000 */
    timeoutMs?: number;
    /** 失败重试次数,默认 2 */
    retries?: number;
    /** 附加请求头 */
    headers?: Record<string, string>;
    /** 自定义环境变量前缀,如 "GENSOGEO_AI_" 会额外读取 GENSOGEO_AI_PROVIDER / GENSOGEO_AI_API_KEY / GENSOGEO_AI_MODEL / GENSOGEO_AI_API_BASE 等 */
    envPrefix?: string;
    /** 自定义 OpenAI 兼容厂商时使用 */
    custom?: {
        label?: string;
        models?: string[];
    };
}
interface ChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    /** 请求 JSON 输出(openai 系走 response_format,gemini 走 responseMimeType,anthropic 走提示词约束) */
    json?: boolean;
    /** 流式输出(仅 chatStream 使用) */
    stream?: boolean;
    signal?: AbortSignal;
    headers?: Record<string, string>;
}
interface ChatResult {
    text: string;
    provider: ProviderId;
    model: string;
    usage?: {
        inputTokens?: number;
        outputTokens?: number;
        totalTokens?: number;
    };
    finishReason?: string;
}
/** 模型列表结果(source: api = 厂商真实返回,registry = 端点不支持时回退内置注册表) */
interface ModelListResult {
    provider: ProviderId;
    models: string[];
    source: "api" | "registry";
    raw?: unknown[];
}
/** 厂商元信息(注册表条目) */
interface ProviderMeta {
    id: ProviderId;
    label: string;
    kind: ProviderKind;
    defaultBaseUrl: string;
    defaultModels: string[];
    /** 是否必须提供 API key(Ollama 等本地服务不需要) */
    needsApiKey: boolean;
    /** 用于自动探测的 env 变量名(按顺序) */
    envKey: string[];
    envBase?: string[];
    envModel?: string[];
    docs?: string;
    note?: string;
}

/**
 * 厂商注册表:所有受支持的厂商在此登记。
 * 新增厂商只需在此加一条记录,client 无需改动(openai 系全部走同一适配器)。
 */
declare const PROVIDERS: ProviderMeta[];
declare function getProvider(id: ProviderId): ProviderMeta;
declare function providerExists(id: string): id is ProviderId;
declare function normalizeProviderId(id: string | undefined | null): ProviderId | undefined;

interface ResolvedConfig {
    provider: ProviderId;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeoutMs: number;
    retries: number;
    headers?: Record<string, string>;
    custom?: {
        label?: string;
        models?: string[];
    };
    /** 自定义环境变量前缀(来自代码传参,用于 env 读取) */
    envPrefix?: string;
    /** provider 的来源说明,便于排错 */
    providerSource: string;
}
interface ConfigFileShape extends ProviderConfig {
    /** 各厂商独立覆盖,当 provider 命中时合并到顶层 */
    providers?: Record<string, ProviderConfig>;
}
/** 把 ${ENV_VAR} 形式的占位符替换为环境变量值 */
declare function interpolateEnv(value: string): string;
/**
 * 读取 unillm.config.json(默认取 cwd,可用 UNILLM_CONFIG 指定路径)。
 * 兼容手写配置:支持 // 与 /* *\/ 注释、尾逗号(JSON5 风格)。
 */
declare function loadConfigFile(path?: string): ConfigFileShape;
/**
 * 解析最终配置,优先级(高 → 低):
 *   代码传参 > envPrefix 专用变量(如 GENSOGEO_AI_*)> UNILLM_* > 厂商专用变量
 *   > unillm.config.json > 旧版 AI_* 通用变量 > 注册表默认值
 */
declare function resolveConfig(input?: ProviderConfig): ResolvedConfig;
/** 按优先级探测:哪个厂商的 API key 环境变量存在,就用哪个 */
declare function autoDetectProvider(): ProviderId | null;
/** 探测某厂商的 key 是否在环境中可用(供 dashboard 展示) */
declare function envKeyPresent(id: ProviderId): boolean;

/** 统一的错误类型:带 HTTP 状态码与厂商信息,便于上层识别限流/超时/鉴权 */
declare class LLMError extends Error {
    status?: number;
    provider?: ProviderId;
    code?: string;
    constructor(message: string, opts?: {
        status?: number;
        provider?: ProviderId;
        code?: string;
    });
}
declare function isLLMError(err: unknown): err is LLMError;
/** 从文本中稳健地提取 JSON(去代码围栏、截取首个 {…} 块) */
declare function parseJsonText(rawText: string): unknown;

/**
 * 统一大模型客户端。
 * 用法:
 *   const llm = new UnifiedLLM({ provider: "deepseek", apiKey: "sk-..." });
 *   await llm.chat([{ role: "user", content: "你好" }]);
 */
declare class UnifiedLLM {
    readonly config: ResolvedConfig;
    constructor(config?: ProviderConfig);
    get provider(): ProviderId;
    /** 解析出本次调用的生效配置(支持按请求覆盖) */
    private effective;
    /** 消息归一化:字符串 prompt → [{ role: "user", content }] */
    private toMessages;
    /** 非流式对话,返回完整结果 */
    chat(messages: string | ChatMessage[], opts?: ChatOptions): Promise<ChatResult>;
    private callOnce;
    /** 流式对话,逐段产出文本增量 */
    chatStream(messages: string | ChatMessage[], opts?: ChatOptions): AsyncGenerator<string>;
    /** 流式对话,一次性收集完整文本 */
    chatStreamText(messages: string | ChatMessage[], opts?: ChatOptions): Promise<string>;
    /** 生成 JSON(自动兜底解析,不怕厂商不支持 response_format) */
    generateJson(input: string | ChatMessage[], opts?: ChatOptions): Promise<unknown>;
    /** 生成纯文本 */
    generateText(input: string | ChatMessage[], opts?: ChatOptions): Promise<string>;
    /**
     * 拉取当前厂商支持的模型列表(OpenAI 系 GET /models,Gemini / Anthropic 同理)。
     * 端点不支持列表时自动回退注册表内置模型,source 标明数据来源。
     */
    listModels(overrides?: ProviderConfig): Promise<ModelListResult>;
}
/** 便捷工厂 */
declare function createLLM(config?: ProviderConfig): UnifiedLLM;

export { type ChatMessage, type ChatOptions, type ChatResult, type ConfigFileShape, type ContentPart, type ImagePart, LLMError, type MessageContent, type ModelListResult, PROVIDERS, type ProviderConfig, type ProviderId, type ProviderKind, type ProviderMeta, type ResolvedConfig, type TextPart, UnifiedLLM, autoDetectProvider, createLLM, envKeyPresent, getProvider, interpolateEnv, isLLMError, loadConfigFile, normalizeProviderId, parseJsonText, providerExists, resolveConfig };
