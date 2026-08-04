"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  LLMError: () => LLMError,
  PROVIDERS: () => PROVIDERS,
  UnifiedLLM: () => UnifiedLLM,
  autoDetectProvider: () => autoDetectProvider,
  createLLM: () => createLLM,
  envKeyPresent: () => envKeyPresent,
  getProvider: () => getProvider,
  interpolateEnv: () => interpolateEnv,
  isLLMError: () => isLLMError,
  loadConfigFile: () => loadConfigFile,
  normalizeProviderId: () => normalizeProviderId,
  parseJsonText: () => parseJsonText,
  providerExists: () => providerExists,
  resolveConfig: () => resolveConfig,
  serveDashboard: () => serveDashboard,
  startDashboard: () => startDashboard
});
module.exports = __toCommonJS(index_exports);

// src/providers.ts
var PROVIDERS = [
  {
    id: "openai",
    label: "OpenAI (GPT)",
    kind: "openai",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModels: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3-mini"],
    needsApiKey: true,
    envKey: ["OPENAI_API_KEY"],
    envModel: ["OPENAI_MODEL"],
    docs: "https://platform.openai.com/docs"
  },
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    kind: "anthropic",
    defaultBaseUrl: "https://api.anthropic.com/v1",
    defaultModels: [
      "claude-sonnet-4-20250514",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022"
    ],
    needsApiKey: true,
    envKey: ["ANTHROPIC_API_KEY"],
    envModel: ["ANTHROPIC_MODEL"],
    docs: "https://docs.anthropic.com"
  },
  {
    id: "gemini",
    label: "Google Gemini",
    kind: "gemini",
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModels: [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-3-flash",
      "gemini-3-pro",
      "gemini-3.5-flash"
    ],
    needsApiKey: true,
    envKey: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
    envModel: ["GEMINI_MODEL"],
    docs: "https://ai.google.dev",
    note: "\u56FE\u7247\u8F93\u5165\u8BF7\u4F7F\u7528 base64(\u4E0D\u652F\u6301\u76F4\u63A5\u4F20 URL)"
  },
  {
    id: "volcengine",
    label: "\u706B\u5C71\u5F15\u64CE\u8C46\u5305 (Volcengine Ark / Doubao)",
    kind: "openai",
    defaultBaseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    defaultModels: ["doubao-seed-2-0-pro", "doubao-3-0-turbo", "doubao-1-5-pro-32k"],
    needsApiKey: true,
    envKey: ["VOLCENGINE_API_KEY", "ARK_API_KEY"],
    envBase: ["VOLCENGINE_BASE_URL", "ARK_API_BASE"],
    envModel: ["VOLCENGINE_MODEL", "ARK_MODEL_ID", "ARK_ENDPOINT_ID"],
    docs: "https://www.volcengine.com/docs/82379/1097216",
    note: "model \u586B Ark \u63A5\u5165\u70B9 ID(ep-xxx)\u6216\u6A21\u578B\u540D"
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    kind: "openai",
    defaultBaseUrl: "https://api.deepseek.com",
    defaultModels: ["deepseek-chat", "deepseek-reasoner"],
    needsApiKey: true,
    envKey: ["DEEPSEEK_API_KEY"],
    envModel: ["DEEPSEEK_MODEL"],
    docs: "https://platform.deepseek.com"
  },
  {
    id: "moonshot",
    label: "Moonshot (Kimi)",
    kind: "openai",
    defaultBaseUrl: "https://api.moonshot.cn/v1",
    defaultModels: ["kimi-k2-0711-preview", "moonshot-v1-32k", "moonshot-v1-8k"],
    needsApiKey: true,
    envKey: ["MOONSHOT_API_KEY"],
    envModel: ["MOONSHOT_MODEL"],
    docs: "https://platform.moonshot.cn"
  },
  {
    id: "qwen",
    label: "\u963F\u91CC\u901A\u4E49\u5343\u95EE (DashScope)",
    kind: "openai",
    defaultBaseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    defaultModels: ["qwen-plus", "qwen-max", "qwen-turbo", "qwen2.5-72b-instruct"],
    needsApiKey: true,
    envKey: ["DASHSCOPE_API_KEY", "QWEN_API_KEY"],
    envBase: ["DASHSCOPE_BASE_URL", "QWEN_BASE_URL"],
    envModel: ["QWEN_MODEL"],
    docs: "https://help.aliyun.com/zh/model-studio"
  },
  {
    id: "zhipu",
    label: "\u667A\u8C31 GLM",
    kind: "openai",
    defaultBaseUrl: "https://open.bigmodel.cn/api/paas/v4",
    defaultModels: ["glm-4-plus", "glm-4-air", "glm-4-flash"],
    needsApiKey: true,
    envKey: ["ZHIPU_API_KEY", "GLM_API_KEY"],
    envBase: ["ZHIPU_BASE_URL"],
    envModel: ["ZHIPU_MODEL"],
    docs: "https://open.bigmodel.cn"
  },
  {
    id: "xai",
    label: "xAI (Grok)",
    kind: "openai",
    defaultBaseUrl: "https://api.x.ai/v1",
    defaultModels: ["grok-3", "grok-3-mini", "grok-2-latest"],
    needsApiKey: true,
    envKey: ["XAI_API_KEY", "GROK_API_KEY"],
    envModel: ["XAI_MODEL"],
    docs: "https://docs.x.ai"
  },
  {
    id: "groq",
    label: "Groq",
    kind: "openai",
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    defaultModels: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    needsApiKey: true,
    envKey: ["GROQ_API_KEY"],
    envModel: ["GROQ_MODEL"],
    docs: "https://console.groq.com"
  },
  {
    id: "mistral",
    label: "Mistral AI",
    kind: "openai",
    defaultBaseUrl: "https://api.mistral.ai/v1",
    defaultModels: ["mistral-large-latest", "mistral-small-latest"],
    needsApiKey: true,
    envKey: ["MISTRAL_API_KEY"],
    envModel: ["MISTRAL_MODEL"],
    docs: "https://docs.mistral.ai"
  },
  {
    id: "siliconflow",
    label: "\u7845\u57FA\u6D41\u52A8 (SiliconFlow)",
    kind: "openai",
    defaultBaseUrl: "https://api.siliconflow.cn/v1",
    defaultModels: ["deepseek-ai/DeepSeek-V3", "Qwen/Qwen2.5-72B-Instruct", "THUDM/glm-4-9b-chat"],
    needsApiKey: true,
    envKey: ["SILICONFLOW_API_KEY"],
    envModel: ["SILICONFLOW_MODEL"],
    docs: "https://siliconflow.cn"
  },
  {
    id: "ollama",
    label: "Ollama (\u672C\u5730)",
    kind: "openai",
    defaultBaseUrl: "http://localhost:11434/v1",
    defaultModels: ["llama3.1:8b", "qwen2.5:7b", "deepseek-r1:7b"],
    needsApiKey: false,
    envKey: [],
    envBase: ["OLLAMA_BASE_URL"],
    envModel: ["OLLAMA_MODEL"],
    docs: "https://ollama.com",
    note: "\u672C\u5730\u670D\u52A1,\u65E0\u9700 API key;\u8BF7\u5148 ollama serve"
  },
  {
    id: "custom",
    label: "\u81EA\u5B9A\u4E49 (OpenAI \u517C\u5BB9)",
    kind: "openai",
    defaultBaseUrl: "http://localhost:8000/v1",
    defaultModels: [],
    needsApiKey: false,
    envKey: ["CUSTOM_API_KEY", "OPENAI_COMPATIBLE_API_KEY", "OPENAI_API_KEY"],
    envBase: ["CUSTOM_BASE_URL", "OPENAI_COMPATIBLE_BASE_URL", "OPENAI_API_BASE"],
    envModel: ["CUSTOM_MODEL", "OPENAI_COMPATIBLE_MODEL", "OPENAI_MODEL_NAME"],
    note: "\u4EFB\u610F OpenAI \u517C\u5BB9\u7AEF\u70B9,\u5982 vLLM / LM Studio / OneAPI / NewAPI"
  }
];
var byId = new Map(PROVIDERS.map((p) => [p.id, p]));
function getProvider(id) {
  const meta = byId.get(id);
  if (!meta) throw new Error(`\u4E0D\u652F\u6301\u7684\u6A21\u578B\u5382\u5546: ${id}`);
  return meta;
}
function providerExists(id) {
  return byId.has(id);
}
var ALIASES = {
  google: "gemini",
  "gemini-pro": "gemini",
  "gemini-ultra": "gemini",
  ark: "volcengine",
  volc: "volcengine",
  doubao: "volcengine",
  "openai-compatible": "custom",
  openai_compatible: "custom",
  compatible: "custom",
  claude: "anthropic",
  kimi: "moonshot",
  dashscope: "qwen",
  tongyi: "qwen",
  bigmodel: "zhipu",
  grok: "xai",
  local: "ollama"
};
function normalizeProviderId(id) {
  if (!id) return void 0;
  const clean = id.trim().toLowerCase().replace(/\s+/g, "-");
  if (providerExists(clean)) return clean;
  return ALIASES[clean];
}
var AUTO_DETECT_ORDER = [
  "openai",
  "anthropic",
  "gemini",
  "deepseek",
  "volcengine",
  "moonshot",
  "qwen",
  "zhipu",
  "xai",
  "groq",
  "mistral",
  "siliconflow",
  "ollama"
];

// src/config.ts
var import_node_fs = require("fs");
var import_node_path = require("path");
function firstEnv(names) {
  for (const name of names) {
    const v = process.env[name];
    if (v && v.trim()) return v.trim();
  }
  return "";
}
function interpolateEnv(value) {
  return value.replace(/\$\{([A-Z0-9_]+)\}/g, (match, name) => {
    const v = process.env[name];
    if (v === void 0) throw new Error(`\u73AF\u5883\u53D8\u91CF ${name} \u672A\u8BBE\u7F6E(\u88AB ${match} \u5F15\u7528)`);
    return v;
  });
}
function numEnv(name, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const raw = process.env[name]?.trim();
  const value = raw ? Number(raw) : fallback;
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}
function numEnvOrUndefined(name, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const raw = process.env[name]?.trim();
  if (!raw) return void 0;
  const value = Number(raw);
  if (!Number.isFinite(value)) return void 0;
  return Math.min(Math.max(value, min), max);
}
function loadConfigFile(path) {
  const configPath = path || process.env.UNILLM_CONFIG || (0, import_node_path.resolve)(process.cwd(), "unillm.config.json");
  if (!(0, import_node_fs.existsSync)(configPath)) return {};
  try {
    const raw = (0, import_node_fs.readFileSync)(configPath, "utf8");
    return JSON.parse(stripJsonCommentsAndTrailingCommas(raw));
  } catch (err) {
    throw new Error(`\u65E0\u6CD5\u89E3\u6790\u914D\u7F6E\u6587\u4EF6 ${configPath}: ${err.message}`);
  }
}
function stripJsonCommentsAndTrailingCommas(input) {
  let out = "";
  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    const next = input[i + 1];
    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
        out += " ";
      }
      i++;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 2;
      } else i++;
      continue;
    }
    if (inString) {
      out += ch;
      if (ch === "\\") {
        if (next !== void 0) {
          out += next;
          i++;
        }
        i++;
        continue;
      }
      if (ch === '"') inString = false;
      i++;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 2;
      continue;
    }
    if (ch === "}" || ch === "]") {
      out = out.replace(/,\s*$/, "");
    }
    out += ch;
    i++;
  }
  out = out.replace(/,\s*$/, "");
  return out;
}
function resolveConfig(input = {}) {
  const file = loadConfigFile();
  const fileProvider = normalizeProviderId(file.provider);
  const filePerProvider = file.providers?.[input.provider || fileProvider || ""] || {};
  const prefix = input.envPrefix ? input.envPrefix.replace(/[_-]+$/, "") + "_" : "";
  const pEnv = (name) => prefix ? firstEnv([`${prefix}${name}`]) : "";
  const pEnvNum = (name, min = 1, max = Number.MAX_SAFE_INTEGER) => prefix ? numEnvOrUndefined(`${prefix}${name}`, min, max) : void 0;
  let provider = normalizeProviderId(input.provider);
  let providerSource = "code";
  if (!provider) {
    provider = normalizeProviderId(pEnv("PROVIDER"));
    providerSource = provider ? `env(${prefix}PROVIDER)` : "";
  }
  if (!provider) {
    provider = normalizeProviderId(firstEnv(["UNILLM_PROVIDER"]));
    providerSource = provider ? "env(UNILLM_PROVIDER)" : "";
  }
  if (!provider) {
    provider = normalizeProviderId(firstEnv(["AI_PROVIDER"]));
    providerSource = provider ? "env(AI_PROVIDER)" : "";
  }
  if (!provider && fileProvider) {
    provider = fileProvider;
    providerSource = "unillm.config.json";
  }
  if (!provider) {
    provider = autoDetectProvider() ?? void 0;
    providerSource = provider ? `auto-detect(${provider})` : "default(openai)";
    provider = provider || "openai";
  }
  const meta = getProvider(provider);
  const fromFile = { ...file, ...filePerProvider };
  const baseUrl = input.baseUrl || pEnv("API_BASE") || pEnv("BASE_URL") || firstEnv(["UNILLM_BASE_URL"]) || firstEnv([...meta.envBase || []]) || fromFile.baseUrl || meta.defaultBaseUrl;
  const apiKey = input.apiKey || pEnv("API_KEY") || firstEnv(["UNILLM_API_KEY"]) || firstEnv([...meta.envKey]) || fromFile.apiKey || "";
  const model = input.model || pEnv("MODEL") || firstEnv(["UNILLM_MODEL"]) || firstEnv([...meta.envModel || []]) || fromFile.model || firstEnv(["AI_MODEL"]) || "";
  const temperature = input.temperature ?? pEnvNum("TEMPERATURE", 0, 2) ?? numEnvOrUndefined("UNILLM_TEMPERATURE", 0, 2) ?? fromFile.temperature ?? numEnv("AI_TEMPERATURE", 0.7, 0, 2);
  const maxTokens = input.maxTokens ?? pEnvNum("MAX_TOKENS", 1, 1e6) ?? numEnvOrUndefined("UNILLM_MAX_TOKENS", 1, 1e6) ?? fromFile.maxTokens ?? numEnv("AI_MAX_TOKENS", 4096, 1, 1e6);
  const timeoutMs = input.timeoutMs ?? pEnvNum("TIMEOUT_MS", 1e3, 36e5) ?? numEnvOrUndefined("UNILLM_TIMEOUT_MS", 1e3, 36e5) ?? fromFile.timeoutMs ?? numEnv("AI_TIMEOUT_MS", 12e4, 1e3, 36e5);
  const retries = input.retries ?? pEnvNum("RETRIES", 0, 5) ?? numEnvOrUndefined("UNILLM_RETRIES", 0, 5) ?? fromFile.retries ?? numEnv("AI_REQUEST_RETRIES", 2, 0, 5);
  const headers = { ...fromFile.headers || {}, ...input.headers || {} };
  return {
    provider,
    apiKey: apiKey ? interpolateEnv(apiKey) : void 0,
    baseUrl: baseUrl ? interpolateEnv(baseUrl) : void 0,
    model: model || void 0,
    temperature,
    maxTokens,
    timeoutMs,
    retries,
    headers: Object.keys(headers).length ? headers : void 0,
    custom: input.custom || fromFile.custom,
    envPrefix: prefix || void 0,
    providerSource
  };
}
function autoDetectProvider() {
  for (const id of AUTO_DETECT_ORDER) {
    const meta = getProvider(id);
    if (meta.needsApiKey) {
      if (firstEnv(meta.envKey)) return id;
    } else if (id === "ollama") {
      if (firstEnv(["OLLAMA_BASE_URL"])) return id;
    }
  }
  return null;
}
function envKeyPresent(id) {
  const meta = getProvider(id);
  if (!meta.needsApiKey) return true;
  return Boolean(firstEnv(meta.envKey));
}

// src/utils.ts
var LLMError = class extends Error {
  status;
  provider;
  code;
  constructor(message, opts = {}) {
    super(message);
    this.name = "LLMError";
    this.status = opts.status;
    this.provider = opts.provider;
    this.code = opts.code;
  }
};
function isLLMError(err) {
  return err instanceof LLMError;
}
function isRetryableStatus(status) {
  if (!status) return true;
  return [408, 409, 425, 429, 500, 502, 503, 504].includes(status);
}
async function readJsonBody(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}
async function* readSseData(body) {
  if (!body) return;
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";
      for (const event of events) {
        for (const line of event.split(/\r?\n/)) {
          if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            if (data && data !== "[DONE]") yield data;
          }
        }
      }
    }
    if (buffer.trim()) {
      const line = buffer.trim();
      if (line.startsWith("data:")) {
        const data = line.slice(5).trim();
        if (data && data !== "[DONE]") yield data;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
function contentToText(content) {
  if (typeof content === "string") return content;
  return content.map((part) => part.type === "text" ? part.text : "").join("").trim();
}
function parseJsonText(rawText) {
  const trimmed = rawText.trim();
  const withoutFence = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(withoutFence);
  } catch {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    }
    const firstBracket = withoutFence.indexOf("[");
    const lastBracket = withoutFence.lastIndexOf("]");
    if (firstBracket >= 0 && lastBracket > firstBracket) {
      return JSON.parse(withoutFence.slice(firstBracket, lastBracket + 1));
    }
    throw new LLMError(`\u6A21\u578B\u6CA1\u6709\u8FD4\u56DE\u5408\u6CD5\u7684 JSON: ${rawText.slice(0, 200)}`, { code: "INVALID_JSON" });
  }
}
function sleep(ms) {
  return new Promise((resolve2) => setTimeout(resolve2, ms));
}
function splitSystemMessages(messages) {
  const system = messages.filter((m) => m.role === "system").map((m) => contentToText(m.content)).join("\n").trim();
  const rest = messages.filter((m) => m.role !== "system");
  return { system, rest };
}
function assertApiKey(provider, apiKey) {
  if (!apiKey) {
    throw new LLMError(
      `\u5382\u5546 ${provider} \u9700\u8981 API key\u3002\u8BF7\u901A\u8FC7\u4EE3\u7801\u4F20\u53C2 / \u73AF\u5883\u53D8\u91CF / unillm.config.json \u914D\u7F6E\u3002`,
      { provider, code: "MISSING_API_KEY" }
    );
  }
}

// src/adapters/openai-compatible.ts
function endpoint(baseUrl) {
  return `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
}
function normalizeMessages(messages) {
  return messages.map((m) => {
    if (typeof m.content === "string") {
      return { role: m.role, content: m.content };
    }
    const parts = m.content.map((part) => {
      if (part.type === "text") return { type: "text", text: part.text };
      const mime = part.mimeType || "image/png";
      if (part.base64) {
        return {
          type: "image_url",
          image_url: { url: `data:${mime};base64,${part.base64}` }
        };
      }
      if (part.imageUrl) {
        return { type: "image_url", image_url: { url: part.imageUrl } };
      }
      return { type: "text", text: "" };
    });
    return { role: m.role, content: parts };
  });
}
function buildBody(params, withStreamOptions) {
  const body = {
    model: params.model,
    messages: normalizeMessages(params.messages)
  };
  if (params.temperature !== void 0) body.temperature = params.temperature;
  if (params.maxTokens !== void 0) body.max_tokens = params.maxTokens;
  if (params.stream) {
    body.stream = true;
    if (withStreamOptions) body.stream_options = { include_usage: true };
  }
  if (params.json) body.response_format = { type: "json_object" };
  return body;
}
function parseResult(payload) {
  const choice = payload?.choices?.[0];
  const content = choice?.message?.content;
  let text = "";
  if (typeof content === "string") text = content;
  else if (Array.isArray(content)) text = content.map((c) => c?.text || "").join("");
  else if (content && typeof content === "object" && "text" in content) text = String(content.text);
  return {
    text,
    usage: {
      inputTokens: payload?.usage?.prompt_tokens,
      outputTokens: payload?.usage?.completion_tokens,
      totalTokens: payload?.usage?.total_tokens
    },
    finishReason: choice?.finish_reason
  };
}
async function listModelsOpenAiCompatible(params) {
  const url = `${params.baseUrl.replace(/\/+$/, "")}/models`;
  const headers = {
    ...params.apiKey ? { Authorization: `Bearer ${params.apiKey}` } : {},
    ...params.headers || {}
  };
  const response = await fetch(url, { method: "GET", headers, signal: params.signal });
  if (response.ok) {
    const payload2 = await readJsonBody(response);
    const raw = Array.isArray(payload2?.data) ? payload2.data : [];
    const models = raw.map((item) => typeof item?.id === "string" ? item.id : "").filter(Boolean);
    return { models, raw };
  }
  if (response.status === 401 || response.status === 403) {
    const payload2 = await readJsonBody(response);
    throw new LLMError(payload2?.error?.message || `\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u88AB\u62D2\u7EDD: HTTP ${response.status}`, {
      status: response.status,
      provider: params.provider,
      code: "UPSTREAM_ERROR"
    });
  }
  if ([404, 405, 406, 501].includes(response.status)) return null;
  const payload = await readJsonBody(response);
  throw new LLMError(payload?.error?.message || `\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, {
    status: response.status,
    provider: params.provider,
    code: "UPSTREAM_ERROR"
  });
}
async function callOpenAiCompatible(params) {
  const url = endpoint(params.baseUrl);
  const headers = {
    "Content-Type": "application/json",
    ...params.apiKey ? { Authorization: `Bearer ${params.apiKey}` } : {},
    ...params.headers || {}
  };
  let body = buildBody(params, !params.disableStreamOptions);
  let response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: params.signal });
  let payload = await readJsonBody(response);
  if (!response.ok && JSON.stringify(payload).toLowerCase().includes("response_format")) {
    body = buildBody({ ...params, json: false }, !params.disableStreamOptions);
    response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: params.signal });
    payload = await readJsonBody(response);
  }
  if (!response.ok && JSON.stringify(payload).toLowerCase().includes("stream_options")) {
    body = buildBody({ ...params, stream: false, json: params.json }, false);
    response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: params.signal });
    payload = await readJsonBody(response);
  }
  if (!response.ok) {
    const message = typeof payload?.error?.message === "string" ? payload.error.message : `\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status} ${payload?._raw ? String(payload._raw).slice(0, 300) : ""}`;
    throw new LLMError(message, { status: response.status, provider: params.provider, code: "UPSTREAM_ERROR" });
  }
  return { ...parseResult(payload), provider: params.provider || "openai", model: params.model };
}
async function* streamOpenAiCompatible(params) {
  const url = endpoint(params.baseUrl);
  const headers = {
    "Content-Type": "application/json",
    ...params.apiKey ? { Authorization: `Bearer ${params.apiKey}` } : {},
    ...params.headers || {}
  };
  const body = buildBody({ ...params, stream: true }, !params.disableStreamOptions);
  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: params.signal });
  if (!response.ok) {
    const payload = await readJsonBody(response);
    if (JSON.stringify(payload).toLowerCase().includes("stream_options")) {
      const retryBody = buildBody({ ...params, stream: true }, false);
      const retryResponse = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(retryBody),
        signal: params.signal
      });
      if (retryResponse.ok) {
        yield* streamFromResponse(retryResponse, params);
        return;
      }
      const retryPayload = await readJsonBody(retryResponse);
      throw new LLMError(retryPayload?.error?.message || `\u6D41\u5F0F\u8BF7\u6C42\u5931\u8D25: HTTP ${retryResponse.status}`, {
        status: retryResponse.status,
        provider: params.provider,
        code: "UPSTREAM_ERROR"
      });
    }
    throw new LLMError(payload?.error?.message || `\u6D41\u5F0F\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, {
      status: response.status,
      provider: params.provider,
      code: "UPSTREAM_ERROR"
    });
  }
  yield* streamFromResponse(response, params);
}
async function* streamFromResponse(response, params) {
  for await (const data of readSseData(response.body)) {
    let chunk;
    try {
      chunk = JSON.parse(data);
    } catch {
      continue;
    }
    const delta = chunk?.choices?.[0]?.delta;
    if (!delta) continue;
    if (typeof delta.content === "string") yield delta.content;
    else if (Array.isArray(delta.content)) {
      for (const part of delta.content) if (part?.text) yield part.text;
    }
    if (typeof delta.reasoning_content === "string") yield delta.reasoning_content;
  }
}

// src/adapters/anthropic.ts
var ANTHROPIC_VERSION = "2023-06-01";
function endpoint2(baseUrl) {
  return `${baseUrl.replace(/\/+$/, "")}/messages`;
}
function normalizeContent(content) {
  if (typeof content === "string") return [{ type: "text", text: content }];
  return content.map((part) => {
    if (part.type === "text") return { type: "text", text: part.text };
    const mime = part.mimeType || "image/png";
    if (part.base64) {
      return {
        type: "image",
        source: { type: "base64", media_type: mime, data: part.base64 }
      };
    }
    if (part.imageUrl) {
      return { type: "image", source: { type: "url", url: part.imageUrl } };
    }
    return { type: "text", text: "" };
  });
}
function buildBody2(params, systemHint) {
  const { system, rest } = splitSystemMessages(params.messages);
  const systemText = [system, systemHint].filter(Boolean).join("\n\n");
  const body = {
    model: params.model,
    max_tokens: params.maxTokens ?? 4096,
    messages: rest.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: normalizeContent(m.content)
    }))
  };
  if (systemText) body.system = systemText;
  if (params.temperature !== void 0) body.temperature = params.temperature;
  if (params.stream) body.stream = true;
  return body;
}
function parseResult2(payload) {
  const text = Array.isArray(payload?.content) ? payload.content.filter((c) => c?.type === "text").map((c) => c.text).join("") : "";
  return {
    text,
    usage: {
      inputTokens: payload?.usage?.input_tokens,
      outputTokens: payload?.usage?.output_tokens,
      totalTokens: (payload?.usage?.input_tokens || 0) + (payload?.usage?.output_tokens || 0)
    },
    finishReason: payload?.stop_reason
  };
}
async function listModelsAnthropic(params) {
  const url = `${params.baseUrl.replace(/\/+$/, "")}/models`;
  const headers = {
    "x-api-key": params.apiKey || "",
    "anthropic-version": ANTHROPIC_VERSION,
    ...params.headers || {}
  };
  const response = await fetch(url, { method: "GET", headers, signal: params.signal });
  if (response.ok) {
    const payload2 = await readJsonBody(response);
    const raw = Array.isArray(payload2?.data) ? payload2.data : [];
    const models = raw.map((item) => typeof item?.id === "string" ? item.id : "").filter(Boolean);
    return { models, raw };
  }
  if (response.status === 401 || response.status === 403) {
    const payload2 = await readJsonBody(response);
    throw new LLMError(payload2?.error?.message || `\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u88AB\u62D2\u7EDD: HTTP ${response.status}`, {
      status: response.status,
      provider: params.provider,
      code: "UPSTREAM_ERROR"
    });
  }
  if ([404, 405, 406, 501].includes(response.status)) return null;
  const payload = await readJsonBody(response);
  throw new LLMError(payload?.error?.message || `\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, {
    status: response.status,
    provider: params.provider,
    code: "UPSTREAM_ERROR"
  });
}
async function callAnthropic(params) {
  assertApiKey("anthropic", params.apiKey);
  const url = endpoint2(params.baseUrl);
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": params.apiKey,
    "anthropic-version": ANTHROPIC_VERSION,
    ...params.headers || {}
  };
  const body = buildBody2(params, params.json ? "Respond with valid JSON only. Do not wrap it in markdown code fences." : "");
  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: params.signal });
  const payload = await readJsonBody(response);
  if (!response.ok) {
    const message = payload?.error?.message || `\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`;
    throw new LLMError(message, { status: response.status, provider: params.provider, code: "UPSTREAM_ERROR" });
  }
  return { ...parseResult2(payload), provider: params.provider || "anthropic", model: params.model };
}
async function* streamAnthropic(params) {
  assertApiKey("anthropic", params.apiKey);
  const url = endpoint2(params.baseUrl);
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": params.apiKey,
    "anthropic-version": ANTHROPIC_VERSION,
    ...params.headers || {}
  };
  const body = buildBody2({ ...params, stream: true }, "");
  const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: params.signal });
  if (!response.ok) {
    const payload = await readJsonBody(response);
    throw new LLMError(payload?.error?.message || `\u6D41\u5F0F\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, {
      status: response.status,
      provider: params.provider,
      code: "UPSTREAM_ERROR"
    });
  }
  for await (const data of readSseData(response.body)) {
    let event;
    try {
      event = JSON.parse(data);
    } catch {
      continue;
    }
    if (event?.type === "content_block_delta" && event.delta?.type === "text_delta") {
      yield event.delta.text;
    }
  }
}

// src/adapters/gemini.ts
function normalizeParts(content) {
  if (typeof content === "string") return [{ text: content }];
  return content.map((part) => {
    if (part.type === "text") return { text: part.text };
    const mime = part.mimeType || "image/png";
    if (part.base64) {
      return { inlineData: { mimeType: mime, data: part.base64 } };
    }
    if (part.imageUrl) {
      throw new LLMError("Gemini \u4E0D\u652F\u6301\u56FE\u7247 URL \u8F93\u5165,\u8BF7\u5148\u8F6C\u6210 base64 \u518D\u4F20\u5165\u3002", {
        code: "UNSUPPORTED_IMAGE"
      });
    }
    return { text: "" };
  });
}
function buildBody3(params) {
  const { system, rest } = splitSystemMessages(params.messages);
  const generationConfig = {};
  if (params.temperature !== void 0) generationConfig.temperature = params.temperature;
  if (params.maxTokens !== void 0) generationConfig.maxOutputTokens = params.maxTokens;
  if (params.json) generationConfig.responseMimeType = "application/json";
  const body = {
    contents: rest.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: normalizeParts(m.content)
    })),
    generationConfig
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  return body;
}
function parseResult3(payload) {
  const text = payload?.candidates?.[0]?.content?.parts?.filter((p) => typeof p?.text === "string").map((p) => p.text).join("") || "";
  const usage = payload?.usageMetadata;
  return {
    text,
    usage: {
      inputTokens: usage?.promptTokenCount,
      outputTokens: usage?.candidatesTokenCount,
      totalTokens: usage?.totalTokenCount
    },
    finishReason: payload?.candidates?.[0]?.finishReason
  };
}
async function listModelsGemini(params) {
  const url = `${params.baseUrl.replace(/\/+$/, "")}/models?pageSize=100`;
  const headers = {
    "x-goog-api-key": params.apiKey || "",
    ...params.headers || {}
  };
  const response = await fetch(url, { method: "GET", headers, signal: params.signal });
  if (response.ok) {
    const payload2 = await readJsonBody(response);
    const raw = Array.isArray(payload2?.models) ? payload2.models : [];
    const models = raw.filter((item) => Array.isArray(item?.supportedGenerationMethods) ? item.supportedGenerationMethods.includes("generateContent") : true).map((item) => typeof item?.name === "string" ? item.name.replace(/^models\//, "") : "").filter(Boolean);
    return { models, raw };
  }
  if (response.status === 401 || response.status === 403) {
    const payload2 = await readJsonBody(response);
    throw new LLMError(payload2?.error?.message || `\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u88AB\u62D2\u7EDD: HTTP ${response.status}`, {
      status: response.status,
      provider: params.provider,
      code: "UPSTREAM_ERROR"
    });
  }
  if ([404, 405, 406, 501].includes(response.status)) return null;
  const payload = await readJsonBody(response);
  throw new LLMError(payload?.error?.message || `\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, {
    status: response.status,
    provider: params.provider,
    code: "UPSTREAM_ERROR"
  });
}
async function callGemini(params) {
  assertApiKey("gemini", params.apiKey);
  const base = params.baseUrl.replace(/\/+$/, "");
  const url = `${base}/models/${encodeURIComponent(params.model)}:generateContent`;
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": params.apiKey,
    ...params.headers || {}
  };
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(buildBody3(params)),
    signal: params.signal
  });
  const payload = await readJsonBody(response);
  if (!response.ok) {
    const message = payload?.error?.message || `\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`;
    throw new LLMError(message, { status: response.status, provider: params.provider, code: "UPSTREAM_ERROR" });
  }
  return { ...parseResult3(payload), provider: params.provider || "gemini", model: params.model };
}
async function* streamGemini(params) {
  assertApiKey("gemini", params.apiKey);
  const base = params.baseUrl.replace(/\/+$/, "");
  const url = `${base}/models/${encodeURIComponent(params.model)}:streamGenerateContent?alt=sse`;
  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": params.apiKey,
    ...params.headers || {}
  };
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(buildBody3({ ...params, stream: true })),
    signal: params.signal
  });
  if (!response.ok) {
    const payload = await readJsonBody(response);
    throw new LLMError(payload?.error?.message || `\u6D41\u5F0F\u8BF7\u6C42\u5931\u8D25: HTTP ${response.status}`, {
      status: response.status,
      provider: params.provider,
      code: "UPSTREAM_ERROR"
    });
  }
  for await (const data of readSseData(response.body)) {
    let chunk;
    try {
      chunk = JSON.parse(data);
    } catch {
      continue;
    }
    const parts = chunk?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      for (const part of parts) if (typeof part?.text === "string") yield part.text;
    }
  }
}

// src/client.ts
var UnifiedLLM = class {
  config;
  constructor(config = {}) {
    this.config = resolveConfig(config);
  }
  get provider() {
    return this.config.provider;
  }
  /** 解析出本次调用的生效配置(支持按请求覆盖) */
  effective(opts = {}) {
    const model = opts.model || this.config.model || getProvider(this.config.provider).defaultModels[0];
    return {
      provider: this.config.provider,
      model,
      baseUrl: this.config.baseUrl || getProvider(this.config.provider).defaultBaseUrl,
      apiKey: this.config.apiKey,
      temperature: opts.temperature ?? this.config.temperature ?? 0.7,
      maxTokens: opts.maxTokens ?? this.config.maxTokens ?? 4096,
      headers: { ...this.config.headers || {}, ...opts.headers || {} }
    };
  }
  /** 消息归一化:字符串 prompt → [{ role: "user", content }] */
  toMessages(input) {
    return typeof input === "string" ? [{ role: "user", content: input }] : input;
  }
  /** 非流式对话,返回完整结果 */
  async chat(messages, opts = {}) {
    const msgs = this.toMessages(messages);
    const cfg = this.effective(opts);
    const retries = this.config.retries;
    let lastError;
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      const controller = new AbortController();
      const timeoutTimer = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const onUserAbort = () => controller.abort();
      opts.signal?.addEventListener("abort", onUserAbort);
      try {
        const result = await this.callOnce(msgs, cfg, opts, controller.signal);
        if (opts.json && result.text) {
          return { ...result, text: JSON.stringify(parseJsonText(result.text)) };
        }
        return result;
      } catch (err) {
        lastError = err;
        const status = err instanceof LLMError ? err.status : void 0;
        const isTimeout = controller.signal.aborted && !opts.signal?.aborted;
        if (isTimeout) {
          throw new LLMError(`\u8BF7\u6C42\u8D85\u65F6(${this.config.timeoutMs}ms)`, {
            provider: cfg.provider,
            code: "TIMEOUT"
          });
        }
        if (attempt <= retries && isRetryableStatus(status) && !opts.signal?.aborted) {
          const baseDelay = 900;
          const jitter = Math.floor(Math.random() * 250);
          await sleep(baseDelay * attempt + jitter);
          continue;
        }
        throw err;
      } finally {
        clearTimeout(timeoutTimer);
        opts.signal?.removeEventListener("abort", onUserAbort);
      }
    }
    throw lastError instanceof Error ? lastError : new LLMError(String(lastError));
  }
  async callOnce(msgs, cfg, opts, signal) {
    const meta = getProvider(cfg.provider);
    const common = {
      baseUrl: cfg.baseUrl,
      apiKey: cfg.apiKey,
      model: cfg.model,
      messages: msgs,
      temperature: cfg.temperature,
      maxTokens: cfg.maxTokens,
      json: opts.json,
      signal,
      headers: cfg.headers,
      provider: cfg.provider
    };
    if (meta.kind === "anthropic") return callAnthropic(common);
    if (meta.kind === "gemini") return callGemini(common);
    return callOpenAiCompatible(common);
  }
  /** 流式对话,逐段产出文本增量 */
  async *chatStream(messages, opts = {}) {
    const msgs = this.toMessages(messages);
    const cfg = this.effective(opts);
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    const onUserAbort = () => controller.abort();
    opts.signal?.addEventListener("abort", onUserAbort);
    try {
      const meta = getProvider(cfg.provider);
      const common = {
        baseUrl: cfg.baseUrl,
        apiKey: cfg.apiKey,
        model: cfg.model,
        messages: msgs,
        temperature: cfg.temperature,
        maxTokens: cfg.maxTokens,
        json: opts.json,
        stream: true,
        signal: controller.signal,
        headers: cfg.headers,
        provider: cfg.provider
      };
      if (meta.kind === "anthropic") yield* streamAnthropic(common);
      else if (meta.kind === "gemini") yield* streamGemini(common);
      else yield* streamOpenAiCompatible(common);
    } finally {
      clearTimeout(timeoutTimer);
      opts.signal?.removeEventListener("abort", onUserAbort);
    }
  }
  /** 流式对话,一次性收集完整文本 */
  async chatStreamText(messages, opts = {}) {
    let text = "";
    for await (const delta of this.chatStream(messages, opts)) text += delta;
    return text;
  }
  /** 生成 JSON(自动兜底解析,不怕厂商不支持 response_format) */
  async generateJson(input, opts = {}) {
    const result = await this.chat(input, { ...opts, json: true });
    return parseJsonText(result.text);
  }
  /** 生成纯文本 */
  async generateText(input, opts = {}) {
    const result = await this.chat(input, opts);
    return result.text;
  }
  /**
   * 拉取当前厂商支持的模型列表(OpenAI 系 GET /models,Gemini / Anthropic 同理)。
   * 端点不支持列表时自动回退注册表内置模型,source 标明数据来源。
   */
  async listModels(overrides = {}) {
    const merged = resolveConfig({ ...this.config, ...overrides });
    const meta = getProvider(merged.provider);
    const baseUrl = merged.baseUrl || meta.defaultBaseUrl;
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), merged.timeoutMs);
    try {
      const common = {
        baseUrl,
        apiKey: merged.apiKey,
        signal: controller.signal,
        headers: merged.headers,
        provider: merged.provider
      };
      const list = meta.kind === "anthropic" ? await listModelsAnthropic(common) : meta.kind === "gemini" ? await listModelsGemini(common) : await listModelsOpenAiCompatible(common);
      if (list && list.models.length) {
        return { provider: merged.provider, models: list.models, source: "api", raw: list.raw };
      }
      return { provider: merged.provider, models: meta.defaultModels, source: "registry" };
    } catch (err) {
      if (controller.signal.aborted) {
        throw new LLMError(`\u6A21\u578B\u5217\u8868\u8BF7\u6C42\u8D85\u65F6(${merged.timeoutMs}ms)`, {
          provider: merged.provider,
          code: "TIMEOUT"
        });
      }
      throw err;
    } finally {
      clearTimeout(timeoutTimer);
    }
  }
};
function createLLM(config = {}) {
  return new UnifiedLLM(config);
}

// src/dashboard.ts
var import_node_http = require("http");
var import_node_child_process = require("child_process");

// src/html.generated.ts
var DASHBOARD_HTML = '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>UniLLM Dashboard</title>\n<style>\n  :root {\n    --bg: #0f1115; --panel: #171a21; --panel2: #1e2230; --border: #2a2f3d;\n    --text: #e6e9ef; --muted: #8b93a7; --accent: #4f8cff; --accent2: #6ee7b7;\n    --danger: #f87171; --radius: 10px;\n  }\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body {\n    background: var(--bg); color: var(--text);\n    font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;\n    min-height: 100vh;\n  }\n  header {\n    display: flex; align-items: center; justify-content: space-between;\n    padding: 18px 28px; border-bottom: 1px solid var(--border);\n    background: linear-gradient(135deg, #141824 0%, #10141d 100%);\n  }\n  header h1 { font-size: 20px; font-weight: 700; letter-spacing: .3px; }\n  header h1 span { color: var(--accent); }\n  header .sub { color: var(--muted); font-size: 13px; margin-top: 4px; }\n  header .env-badge { color: var(--muted); font-size: 12px; text-align: right; }\n  main {\n    display: grid; grid-template-columns: 360px 1fr; gap: 20px;\n    padding: 24px 28px; max-width: 1280px; margin: 0 auto;\n  }\n  @media (max-width: 960px) { main { grid-template-columns: 1fr; } }\n  .panel {\n    background: var(--panel); border: 1px solid var(--border);\n    border-radius: var(--radius); padding: 18px;\n  }\n  .panel h2 { font-size: 14px; color: var(--muted); font-weight: 600; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 1px; }\n  .field { margin-bottom: 14px; }\n  .field label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }\n  select, input[type=text], input[type=password], textarea {\n    width: 100%; background: var(--panel2); color: var(--text);\n    border: 1px solid var(--border); border-radius: 8px;\n    padding: 9px 12px; font-size: 13px; outline: none;\n    font-family: inherit;\n  }\n  select:focus, input:focus, textarea:focus { border-color: var(--accent); }\n  .row { display: flex; gap: 10px; }\n  .row > * { flex: 1; }\n  .key-wrap { position: relative; }\n  .key-wrap input { padding-right: 36px; }\n  .key-wrap button {\n    position: absolute; right: 6px; top: 50%; transform: translateY(-50%);\n    background: none; border: none; color: var(--muted); cursor: pointer; font-size: 15px;\n  }\n  .switch { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; user-select: none; }\n  .switch input { accent-color: var(--accent); width: 15px; height: 15px; }\n  .range-val { color: var(--accent2); font-weight: 600; }\n  input[type=range] { width: 100%; accent-color: var(--accent); margin-top: 4px; }\n  .btn {\n    display: inline-flex; align-items: center; justify-content: center; gap: 6px;\n    background: var(--accent); color: #fff; border: none; border-radius: 8px;\n    padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer;\n    transition: opacity .15s, transform .05s;\n  }\n  .btn:hover { opacity: .9; }\n  .btn:active { transform: scale(.98); }\n  .btn:disabled { opacity: .45; cursor: not-allowed; }\n  .btn.ghost { background: var(--panel2); color: var(--text); border: 1px solid var(--border); }\n  .btn.danger { background: var(--danger); }\n  .btn.mini { padding: 3px 10px; font-size: 11.5px; font-weight: 500; border-radius: 6px; background: var(--panel2); border: 1px solid var(--border); color: var(--muted); }\n  .btn.mini:hover { color: var(--text); border-color: var(--accent); }\n  .toolbar { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }\n  textarea#prompt { min-height: 110px; resize: vertical; line-height: 1.6; }\n  .output-wrap { position: relative; margin-top: 12px; }\n  #output {\n    background: #0c0e13; border: 1px solid var(--border); border-radius: 8px;\n    min-height: 240px; max-height: 480px; overflow: auto;\n    padding: 14px 16px; font-size: 13.5px; line-height: 1.75;\n    white-space: pre-wrap; word-break: break-word; font-family: "SF Mono", Menlo, Consolas, monospace;\n  }\n  #output .cursor { display: inline-block; width: 7px; height: 15px; background: var(--accent2); vertical-align: -2px; animation: blink 1s steps(1) infinite; }\n  @keyframes blink { 50% { opacity: 0; } }\n  #status { margin-top: 10px; font-size: 12px; color: var(--muted); min-height: 16px; }\n  #status.error { color: var(--danger); }\n  #status.ok { color: var(--accent2); }\n  .hint { font-size: 11.5px; color: var(--muted); margin-top: 4px; line-height: 1.5; }\n  .env-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }\n  .env-chip { font-size: 11px; padding: 3px 8px; border-radius: 20px; border: 1px solid var(--border); color: var(--muted); }\n  .env-chip.on { color: var(--accent2); border-color: var(--accent2); }\n  .badge { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: var(--panel2); color: var(--muted); border: 1px solid var(--border); margin-left: 6px; }\n  footer { text-align: center; color: var(--muted); font-size: 12px; padding: 20px; }\n  a { color: var(--accent); text-decoration: none; }\n</style>\n</head>\n<body>\n<header>\n  <div>\n    <h1>Uni<span>LLM</span> Dashboard</h1>\n    <div class="sub">\u7EDF\u4E00\u5927\u6A21\u578B\u63A5\u5165\u9762\u677F \xB7 \u652F\u6301 OpenAI / Claude / Gemini / \u8C46\u5305 / DeepSeek / Kimi / \u901A\u4E49 / GLM / Grok / Ollama</div>\n  </div>\n  <div class="env-badge" id="envBadge">\u68C0\u6D4B\u73AF\u5883\u53D8\u91CF\u4E2D\u2026</div>\n</header>\n\n<main>\n  <aside class="panel">\n    <h2>\u2699\uFE0F \u6A21\u578B\u914D\u7F6E</h2>\n    <div class="field">\n      <label for="provider">\u5382\u5546</label>\n      <select id="provider"></select>\n      <div class="hint" id="providerNote"></div>\n    </div>\n    <div class="field">\n      <label for="apiKey">API Key <span style="opacity:.6">(\u4EC5\u5B58\u4E8E\u672C\u673A\u6D4F\u89C8\u5668)</span></label>\n      <div class="key-wrap">\n        <input type="password" id="apiKey" placeholder="sk-..." autocomplete="off">\n        <button id="toggleKey" title="\u663E\u793A/\u9690\u85CF">\u{1F441}</button>\n      </div>\n      <div class="hint" id="envKeyHint"></div>\n    </div>\n    <div class="field">\n      <label for="baseUrl">Base URL</label>\n      <input type="text" id="baseUrl" placeholder="https://api.xxx.com/v1">\n    </div>\n    <div class="field">\n      <label for="model" style="display:flex;align-items:center;justify-content:space-between">\n        <span>\u6A21\u578B</span>\n        <button class="btn mini" id="refreshModels" title="\u4ECE\u8BE5\u5382\u5546 API \u62C9\u53D6\u6700\u65B0\u6A21\u578B\u5217\u8868">\u21BB \u83B7\u53D6\u6A21\u578B\u5217\u8868</button>\n      </label>\n      <select id="model"></select>\n      <input type="text" id="modelCustom" placeholder="\u81EA\u5B9A\u4E49\u6A21\u578B\u540D(\u76F4\u63A5\u8F93\u5165)" style="margin-top:8px; display:none">\n    </div>\n    <div class="field">\n      <label>Temperature <span class="range-val" id="tempVal">0.7</span></label>\n      <input type="range" id="temperature" min="0" max="2" step="0.1" value="0.7">\n    </div>\n    <div class="row">\n      <div class="field" style="margin-bottom:0">\n        <label for="maxTokens">Max Tokens</label>\n        <input type="text" id="maxTokens" value="4096" inputmode="numeric">\n      </div>\n      <div class="field" style="margin-bottom:0; display:flex; align-items:flex-end; padding-bottom:8px">\n        <label class="switch">\n          <input type="checkbox" id="jsonMode">\n          JSON \u6A21\u5F0F\n        </label>\n      </div>\n    </div>\n    <div style="margin-top:16px">\n      <button class="btn" id="copyConfig" style="width:100%">\u{1F4CB} \u590D\u5236 unillm.config.json \u914D\u7F6E</button>\n      <div class="hint" id="copyHint"></div>\n    </div>\n    <div style="margin-top:14px">\n      <div style="font-size:12px;color:var(--muted);margin-bottom:6px">\u73AF\u5883\u53D8\u91CF\u63A2\u6D4B</div>\n      <div class="env-list" id="envList"></div>\n    </div>\n  </aside>\n\n  <section class="panel">\n    <h2>\u{1F4AC} \u6D4B\u8BD5\u5BF9\u8BDD</h2>\n    <div class="field">\n      <label for="prompt">\u63D0\u793A\u8BCD</label>\n      <textarea id="prompt" placeholder="\u4F8B\u5982:\u8BF7\u7528\u4E00\u53E5\u8BDD\u4ECB\u7ECD\u4F60\u81EA\u5DF1">\u8BF7\u7528\u4E00\u53E5\u8BDD\u4ECB\u7ECD\u4F60\u81EA\u5DF1,\u5E76\u8BF4\u660E\u4F60\u80FD\u5E2E\u6211\u505A\u4EC0\u4E48\u3002</textarea>\n    </div>\n    <div class="toolbar">\n      <button class="btn" id="send">\u25B6 \u53D1\u9001</button>\n      <button class="btn danger" id="stop" disabled>\u25A0 \u505C\u6B62</button>\n      <button class="btn ghost" id="clear">\u6E05\u7A7A\u8F93\u51FA</button>\n    </div>\n    <div class="output-wrap">\n      <div id="output"></div>\n    </div>\n    <div id="status"></div>\n  </section>\n</main>\n\n<footer>\n  UniLLM SDK \xB7 \u672C\u5730\u8C03\u8BD5\u5DE5\u5177 \xB7 key \u901A\u8FC7\u672C\u673A\u670D\u52A1\u4EE3\u7406\u8BF7\u6C42,\u4E0D\u4F1A\u7ECF\u8FC7\u7B2C\u4E09\u65B9\n</footer>\n\n<script>\n(function () {\n  "use strict";\n  var $ = function (id) { return document.getElementById(id); };\n  var state = {\n    providers: [],\n    provider: "openai",\n    apiKey: "",\n    baseUrl: "",\n    model: "",\n    models: null,\n    temperature: 0.7,\n    maxTokens: 4096,\n    jsonMode: false,\n    controller: null\n  };\n\n  var LS_KEY = "unillm-dashboard-v1";\n\n  function saveState() {\n    try {\n      localStorage.setItem(LS_KEY, JSON.stringify({\n        provider: state.provider, apiKey: state.apiKey, baseUrl: state.baseUrl,\n        model: state.model, temperature: state.temperature, maxTokens: state.maxTokens,\n        jsonMode: state.jsonMode\n      }));\n    } catch (e) { /* ignore */ }\n  }\n\n  function loadState() {\n    try {\n      var raw = localStorage.getItem(LS_KEY);\n      if (raw) {\n        var saved = JSON.parse(raw);\n        for (var k in saved) if (saved.hasOwnProperty(k)) state[k] = saved[k];\n      }\n    } catch (e) { /* ignore */ }\n  }\n\n  function apiBase() {\n    // \u9875\u9762\u53EF\u80FD\u6302\u5728 /llm \u4E0B,\u4E5F\u53EF\u80FD\u76F4\u63A5\u6302\u5728 /;\u7EDF\u4E00\u4ECE\u5F53\u524D URL \u63A8\u5BFC\n    var path = location.pathname;\n    if (path.endsWith("/")) path = path.slice(0, -1);\n    var base = path.replace(/\\/[^/]*$/, "");\n    return base + "/api";\n  }\n\n  function setStatus(text, cls) {\n    var el = $("status");\n    el.textContent = text;\n    el.className = cls || "";\n  }\n\n  function providerMeta(id) {\n    for (var i = 0; i < state.providers.length; i++) {\n      if (state.providers[i].id === id) return state.providers[i];\n    }\n    return null;\n  }\n\n  function envName(id) {\n    var meta = providerMeta(id);\n    return meta ? meta.envKey : "";\n  }\n\n  function renderModels() {\n    var meta = providerMeta(state.provider);\n    var sel = $("model");\n    var custom = $("modelCustom");\n    sel.innerHTML = "";\n    if (!meta) return;\n    var models = state.models || meta.models || [];\n\n    // \u6CA1\u6709\u5185\u7F6E\u6A21\u578B\u5217\u8868\u7684\u5382\u5546(custom):\u76F4\u63A5\u5C55\u793A\u81EA\u5B9A\u4E49\u8F93\u5165\u6846\n    if (!models.length) {\n      sel.style.display = "none";\n      custom.style.display = "block";\n      custom.value = state.model || "";\n      var note = $("providerNote");\n      note.textContent = meta.note || "\u4EFB\u610F OpenAI \u517C\u5BB9\u7AEF\u70B9";\n      return;\n    }\n\n    var known = false;\n    for (var i = 0; i < models.length; i++) {\n      var opt = document.createElement("option");\n      opt.value = models[i];\n      opt.textContent = models[i];\n      sel.appendChild(opt);\n      if (state.model === models[i]) { known = true; sel.selectedIndex = i; }\n    }\n    if (state.model && !known) {\n      custom.style.display = "block";\n      custom.value = state.model;\n      sel.style.display = "none";\n    } else {\n      custom.style.display = "none";\n      sel.style.display = "block";\n      if (!state.model && models.length) state.model = models[0];\n      sel.value = state.model || "";\n    }\n    var note = $("providerNote");\n    note.textContent = meta.note || "";\n  }\n\n  function renderEnv() {\n    fetch(apiBase() + "/env").then(function (r) { return r.json(); }).then(function (data) {\n      var list = $("envList");\n      list.innerHTML = "";\n      var present = 0;\n      for (var id in data.env) {\n        if (!data.env.hasOwnProperty(id)) continue;\n        var chip = document.createElement("span");\n        chip.className = "env-chip" + (data.env[id] ? " on" : "");\n        chip.textContent = id + (data.env[id] ? " \u2713" : "");\n        chip.title = data.env[id] ? "\u73AF\u5883\u4E2D\u5DF2\u914D\u7F6E" : "\u672A\u5728\u73AF\u5883\u4E2D\u914D\u7F6E";\n        list.appendChild(chip);\n        if (data.env[id]) present++;\n      }\n      $("envBadge").textContent = present ? ("\u73AF\u5883\u4E2D\u5DF2\u68C0\u6D4B\u5230 " + present + " \u4E2A\u5382\u5546\u7684 Key") : "\u672A\u68C0\u6D4B\u5230\u73AF\u5883\u53D8\u91CF Key,\u8BF7\u5728\u4E0B\u65B9\u624B\u52A8\u586B\u5199";\n    }).catch(function () {\n      $("envBadge").textContent = "\u73AF\u5883\u53D8\u91CF\u68C0\u6D4B\u5931\u8D25";\n    });\n  }\n\n  function renderApiKeyHint() {\n    var meta = providerMeta(state.provider);\n    var hint = $("envKeyHint");\n    if (!meta) return;\n    hint.textContent = meta.needsApiKey\n      ? ("\u4E5F\u53EF\u5728\u73AF\u5883\u4E2D\u8BBE\u7F6E " + meta.envKey + " \u514D\u586B\u5199")\n      : "\u8BE5\u5382\u5546\u65E0\u9700 API Key";\n  }\n\n  function bindEvents() {\n    $("provider").addEventListener("change", function () {\n      state.provider = this.value;\n      state.model = "";\n      state.models = null;\n      renderModels();\n      renderApiKeyHint();\n      var meta = providerMeta(state.provider);\n      if (meta && !state.baseUrl) $("baseUrl").value = "";\n      saveState();\n      autoRefreshModels();\n    });\n\n    $("apiKey").addEventListener("input", function () { state.apiKey = this.value; saveState(); });\n    $("toggleKey").addEventListener("click", function () {\n      var el = $("apiKey");\n      el.type = el.type === "password" ? "text" : "password";\n    });\n    $("baseUrl").addEventListener("input", function () { state.baseUrl = this.value; saveState(); });\n\n    $("model").addEventListener("change", function () {\n      state.model = this.value;\n      $("modelCustom").value = "";\n      $("modelCustom").style.display = "none";\n      $("model").style.display = "block";\n      saveState();\n    });\n    $("modelCustom").addEventListener("input", function () {\n      state.model = this.value;\n      saveState();\n    });\n\n    $("temperature").addEventListener("input", function () {\n      state.temperature = parseFloat(this.value);\n      $("tempVal").textContent = state.temperature.toFixed(1);\n      saveState();\n    });\n    $("maxTokens").addEventListener("input", function () {\n      state.maxTokens = parseInt(this.value, 10) || 4096;\n      saveState();\n    });\n    $("jsonMode").addEventListener("change", function () {\n      state.jsonMode = this.checked;\n      saveState();\n    });\n\n    $("send").addEventListener("click", send);\n    $("stop").addEventListener("click", stop);\n    $("clear").addEventListener("click", function () { $("output").textContent = ""; setStatus(""); });\n    $("copyConfig").addEventListener("click", copyConfig);\n    $("refreshModels").addEventListener("click", function () { refreshModels(true); });\n  }\n\n  // \u4ECE\u5382\u5546 API \u62C9\u53D6\u6A21\u578B\u5217\u8868\n  async function refreshModels(showStatus) {\n    var meta = providerMeta(state.provider);\n    if (!meta) return;\n    var btn = $("refreshModels");\n    var oldText = btn.textContent;\n    btn.disabled = true;\n    btn.textContent = "\u83B7\u53D6\u4E2D\u2026";\n    try {\n      var resp = await fetch(apiBase() + "/models", {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify({\n          provider: state.provider,\n          apiKey: state.apiKey || null,\n          baseUrl: state.baseUrl || null,\n          model: state.model || null\n        })\n      });\n      var data = await resp.json();\n      if (!resp.ok) throw new Error(data.error || ("HTTP " + resp.status));\n      state.models = data.models;\n      if (state.models.length && state.models.indexOf(state.model) < 0) state.model = state.models[0];\n      renderModels();\n      saveState();\n      if (showStatus !== false) {\n        setStatus("\u5DF2\u83B7\u53D6 " + state.models.length + " \u4E2A\u6A21\u578B(" + (data.source === "api" ? "\u6765\u81EA\u5382\u5546 API" : "\u7AEF\u70B9\u4E0D\u652F\u6301\u5217\u8868,\u56DE\u9000\u5185\u7F6E\u6CE8\u518C\u8868") + ")", "ok");\n      }\n    } catch (err) {\n      if (showStatus !== false) setStatus("\u2717 \u83B7\u53D6\u6A21\u578B\u5931\u8D25: " + err.message, "error");\n    } finally {\n      btn.disabled = false;\n      btn.textContent = oldText;\n    }\n  }\n\n  // Key \u5DF2\u586B\u6216\u5382\u5546\u65E0\u9700 Key \u65F6,\u5207\u5382\u5546\u540E\u81EA\u52A8\u62C9\u53D6\u6A21\u578B\u5217\u8868\n  function autoRefreshModels() {\n    var meta = providerMeta(state.provider);\n    if (!meta) return;\n    if (!meta.needsApiKey || state.apiKey) refreshModels(false);\n  }\n\n  function buildMessages() {\n    var prompt = $("prompt").value.trim();\n    if (!prompt) {\n      setStatus("\u8BF7\u5148\u8F93\u5165\u63D0\u793A\u8BCD", "error");\n      return null;\n    }\n    return [{ role: "user", content: prompt }];\n  }\n\n  function payload() {\n    return {\n      provider: state.provider,\n      apiKey: state.apiKey || null,\n      baseUrl: state.baseUrl || null,\n      model: state.model || null,\n      temperature: state.temperature,\n      maxTokens: state.maxTokens,\n      json: state.jsonMode,\n      messages: buildMessages()\n    };\n  }\n\n  function appendOutput(text) {\n    var out = $("output");\n    var cursor = out.querySelector(".cursor");\n    if (cursor) cursor.remove();\n    out.textContent += text;\n    out.scrollTop = out.scrollHeight;\n  }\n\n  function endOutput() {\n    var out = $("output");\n    var cursor = out.querySelector(".cursor");\n    if (cursor) cursor.remove();\n    out.scrollTop = out.scrollHeight;\n  }\n\n  async function send() {\n    var body = payload();\n    if (!body) return;\n    stop(); // \u53D6\u6D88\u4E0A\u4E00\u6B21\n    $("output").textContent = "";\n    $("send").disabled = true;\n    $("stop").disabled = false;\n    setStatus("\u8BF7\u6C42\u4E2D\u2026(\u6D41\u5F0F\u8F93\u51FA)");\n    var ctrl = new AbortController();\n    state.controller = ctrl;\n\n    try {\n      if (state.jsonMode) {\n        var resp = await fetch(apiBase() + "/chat", {\n          method: "POST",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify(body),\n          signal: ctrl.signal\n        });\n        var data = await resp.json();\n        if (!resp.ok) throw new Error(data.error || ("HTTP " + resp.status));\n        appendOutput(JSON.stringify(data.json !== undefined ? data.json : data.text, null, 2));\n        setStatus("\u2713 \u5B8C\u6210 \xB7 \u6A21\u578B " + data.model + " \xB7 " + (data.usage && data.usage.totalTokens ? data.usage.totalTokens + " tokens" : ""), "ok");\n      } else {\n        var streamResp = await fetch(apiBase() + "/stream", {\n          method: "POST",\n          headers: { "Content-Type": "application/json" },\n          body: JSON.stringify(body),\n          signal: ctrl.signal\n        });\n        if (!streamResp.ok || !streamResp.body) {\n          var errData = await streamResp.json().catch(function () { return {}; });\n          throw new Error(errData.error || ("HTTP " + streamResp.status));\n        }\n        var reader = streamResp.body.getReader();\n        var decoder = new TextDecoder();\n        var buffer = "";\n        var doneInfo = null;\n        var firstToken = true;\n        while (true) {\n          var chunk = await reader.read();\n          if (chunk.done) break;\n          buffer += decoder.decode(chunk.value, { stream: true });\n          var events = buffer.split(/\\r?\\n\\r?\\n/);\n          buffer = events.pop() || "";\n          for (var i = 0; i < events.length; i++) {\n            var evt = events[i];\n            var line = evt.split("\\n").filter(function (l) { return l.indexOf("data:") === 0; })[0];\n            if (!line) continue;\n            var data = JSON.parse(line.slice(5).trim());\n            if (data.type === "delta") {\n              if (firstToken) { setStatus("\u6D41\u5F0F\u8F93\u51FA\u4E2D\u2026"); firstToken = false; }\n              appendOutput(data.text);\n            } else if (data.type === "done") {\n              doneInfo = data;\n            } else if (data.type === "error") {\n              throw new Error(data.message);\n            }\n          }\n        }\n        endOutput();\n        if (doneInfo && doneInfo.json !== undefined) {\n          // \u6D41\u5F0F JSON \u6A21\u5F0F\u4E0B,\u5237\u65B0\u4E3A\u683C\u5F0F\u5316 JSON\n          $("output").textContent = JSON.stringify(doneInfo.json, null, 2);\n        }\n        setStatus("\u2713 \u5B8C\u6210 \xB7 \u6A21\u578B " + (doneInfo ? doneInfo.model : body.model), "ok");\n      }\n    } catch (err) {\n      if (err.name === "AbortError") {\n        endOutput();\n        setStatus("\u5DF2\u505C\u6B62", "");\n      } else {\n        endOutput();\n        setStatus("\u2717 " + err.message, "error");\n      }\n    } finally {\n      state.controller = null;\n      $("send").disabled = false;\n      $("stop").disabled = true;\n    }\n  }\n\n  function stop() {\n    if (state.controller) {\n      state.controller.abort();\n      state.controller = null;\n    }\n  }\n\n  function copyConfig() {\n    var meta = providerMeta(state.provider);\n    if (!meta) return;\n    var env = envName(state.provider);\n    var cfg = {\n      provider: state.provider,\n      apiKey: env ? "${" + env + "}" : "",\n      baseUrl: state.baseUrl || undefined,\n      model: state.model || undefined,\n      temperature: state.temperature,\n      maxTokens: state.maxTokens\n    };\n    var text = JSON.stringify(cfg, null, 2);\n    function fallback() {\n      var ta = document.createElement("textarea");\n      ta.value = text;\n      document.body.appendChild(ta);\n      ta.select();\n      try { document.execCommand("copy"); } catch (e) { /* ignore */ }\n      document.body.removeChild(ta);\n    }\n    if (navigator.clipboard && navigator.clipboard.writeText) {\n      navigator.clipboard.writeText(text).then(function () {\n        $("copyHint").textContent = "\u5DF2\u590D\u5236 \u2192 \u4FDD\u5B58\u4E3A unillm.config.json \u5373\u53EF";\n      }).catch(fallback);\n    } else {\n      fallback();\n      $("copyHint").textContent = "\u5DF2\u590D\u5236 \u2192 \u4FDD\u5B58\u4E3A unillm.config.json \u5373\u53EF";\n    }\n    setTimeout(function () { $("copyHint").textContent = ""; }, 4000);\n  }\n\n  function init() {\n    loadState();\n    fetch(apiBase() + "/providers").then(function (r) { return r.json(); }).then(function (data) {\n      state.providers = data.providers;\n      var sel = $("provider");\n      for (var i = 0; i < state.providers.length; i++) {\n        var opt = document.createElement("option");\n        opt.value = state.providers[i].id;\n        opt.textContent = state.providers[i].label;\n        sel.appendChild(opt);\n      }\n      if (!state.provider || !providerMeta(state.provider)) state.provider = data.defaults.provider;\n      sel.value = state.provider;\n      renderModels();\n      renderApiKeyHint();\n      bindEvents();\n      renderEnv();\n      $("apiKey").value = state.apiKey || "";\n      $("baseUrl").value = state.baseUrl || "";\n      $("temperature").value = state.temperature;\n      $("tempVal").textContent = Number(state.temperature).toFixed(1);\n      $("maxTokens").value = state.maxTokens;\n      $("jsonMode").checked = state.jsonMode;\n      // \u5DF2\u4FDD\u5B58 Key \u65F6\u81EA\u52A8\u62C9\u53D6\u4E00\u6B21\u6A21\u578B\u5217\u8868\n      if (state.apiKey) autoRefreshModels();\n    }).catch(function (err) {\n      setStatus("\u521D\u59CB\u5316\u5931\u8D25: " + err.message, "error");\n    });\n  }\n\n  init();\n})();\n</script>\n</body>\n</html>\n';

// src/dashboard.ts
var MAX_BODY = 10 * 1024 * 1024;
function readJsonBody2(req) {
  return new Promise((resolve2, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > MAX_BODY) {
        reject(new Error("\u8BF7\u6C42\u4F53\u8FC7\u5927"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) return resolve2({});
      try {
        resolve2(JSON.parse(data));
      } catch {
        reject(new Error("\u8BF7\u6C42\u4F53\u4E0D\u662F\u5408\u6CD5 JSON"));
      }
    });
    req.on("error", reject);
  });
}
function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store"
  });
  res.end(body);
}
function serveDashboard(options = {}) {
  const path = (options.path || "/llm").replace(/\/+$/, "") || "/";
  return async function dashboardHandler(req, res, next) {
    const url = req.url || "/";
    const isMine = path === "/" ? url === "/" || url.startsWith("/api/") : url === path || url.startsWith(`${path}/`) || url === "/" || url.startsWith("/api/");
    if (!isMine) {
      if (next) return next();
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not Found");
    }
    const sub = url === path || url === "/" ? "/" : url.startsWith(path) ? url.slice(path.length) : url;
    try {
      if (req.method === "GET" && (sub === "/" || sub === "")) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(DASHBOARD_HTML);
      }
      if (req.method === "GET" && sub === "/api/providers") {
        return sendJson(res, 200, {
          providers: PROVIDERS.map((p) => ({
            id: p.id,
            label: p.label,
            kind: p.kind,
            models: p.defaultModels,
            needsApiKey: p.needsApiKey,
            envKey: p.envKey[0] || "",
            note: p.note || ""
          })),
          defaults: {
            provider: "openai",
            temperature: 0.7,
            maxTokens: 4096
          }
        });
      }
      if (req.method === "GET" && sub === "/api/env") {
        const env = {};
        for (const p of PROVIDERS) env[p.id] = envKeyPresent(p.id);
        return sendJson(res, 200, { env });
      }
      if (req.method === "POST" && sub === "/api/chat") {
        const body = await readJsonBody2(req);
        const provider = body.provider;
        if (!provider || !providerExists(provider)) {
          return sendJson(res, 400, { error: `\u4E0D\u652F\u6301\u7684\u5382\u5546: ${provider}` });
        }
        const meta = getProvider(provider);
        const llm = new UnifiedLLM({
          provider,
          apiKey: body.apiKey || void 0,
          baseUrl: body.baseUrl || void 0,
          model: body.model || void 0,
          temperature: body.temperature,
          maxTokens: body.maxTokens
        });
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const result = await llm.chat(messages, { json: Boolean(body.json) });
        return sendJson(res, 200, { ...result, kind: meta.kind });
      }
      if (req.method === "POST" && sub === "/api/models") {
        const body = await readJsonBody2(req);
        const provider = body.provider;
        if (!provider || !providerExists(provider)) {
          return sendJson(res, 400, { error: `\u4E0D\u652F\u6301\u7684\u5382\u5546: ${provider}` });
        }
        const llm = new UnifiedLLM({
          provider,
          apiKey: body.apiKey || void 0,
          baseUrl: body.baseUrl || void 0,
          model: body.model || void 0
        });
        const result = await llm.listModels();
        return sendJson(res, 200, result);
      }
      if (req.method === "POST" && sub === "/api/stream") {
        const body = await readJsonBody2(req);
        const provider = body.provider;
        if (!provider || !providerExists(provider)) {
          return sendJson(res, 400, { error: `\u4E0D\u652F\u6301\u7684\u5382\u5546: ${provider}` });
        }
        const llm = new UnifiedLLM({
          provider,
          apiKey: body.apiKey || void 0,
          baseUrl: body.baseUrl || void 0,
          model: body.model || void 0,
          temperature: body.temperature,
          maxTokens: body.maxTokens
        });
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const jsonMode = Boolean(body.json);
        res.writeHead(200, {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*"
        });
        res.write(`data: ${JSON.stringify({ type: "meta", model: llm.config.model, provider })}

`);
        let full = "";
        try {
          for await (const delta of llm.chatStream(messages, { json: jsonMode })) {
            full += delta;
            res.write(`data: ${JSON.stringify({ type: "delta", text: delta })}

`);
          }
          if (jsonMode) {
            try {
              const parsed = JSON.parse(full);
              res.write(`data: ${JSON.stringify({ type: "done", json: parsed, text: full, model: llm.config.model, provider })}

`);
            } catch {
              res.write(`data: ${JSON.stringify({ type: "done", text: full, model: llm.config.model, provider })}

`);
            }
          } else {
            res.write(`data: ${JSON.stringify({ type: "done", text: full, model: llm.config.model, provider })}

`);
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          res.write(`data: ${JSON.stringify({ type: "error", message })}

`);
        }
        return res.end();
      }
      if (sub.startsWith("/api/")) {
        return sendJson(res, 404, { error: `\u672A\u77E5\u63A5\u53E3: ${sub}` });
      }
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
    } catch (err) {
      const message = err instanceof LLMError ? `${err.message}${err.status ? ` (HTTP ${err.status})` : ""}` : err instanceof Error ? err.message : String(err);
      if (!res.headersSent) {
        sendJson(res, 500, { error: message });
      } else {
        res.end();
      }
    }
  };
}
function openBrowser(url) {
  const platform = process.platform;
  const command = platform === "darwin" ? "open" : platform === "win32" ? "start" : "xdg-open";
  try {
    if (platform === "win32") {
      (0, import_node_child_process.spawn)("cmd", ["/c", "start", "", url], { stdio: "ignore", detached: true }).unref();
    } else {
      (0, import_node_child_process.spawn)(command, [url], { stdio: "ignore", detached: true }).unref();
    }
  } catch {
  }
}
function startDashboard(options = {}) {
  const port = options.port ?? 3788;
  const host = options.host ?? "127.0.0.1";
  const path = options.path ?? "/llm";
  const open = options.open ?? true;
  const server = (0, import_node_http.createServer)(serveDashboard({ path }));
  server.listen(port, host, () => {
    const url = `http://${host}:${port}${path}`;
    console.log("");
    console.log("  \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
    console.log("  \u2502         UniLLM Dashboard \u5DF2\u542F\u52A8               \u2502");
    console.log("  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
    console.log(`  \u5730\u5740: ${url}`);
    console.log("  \u63D0\u793A: \u5173\u95ED\u8BF7\u6309 Ctrl+C;API key \u4EC5\u4FDD\u5B58\u5728\u6D4F\u89C8\u5668\u672C\u5730,\u4E0D\u4F1A\u4E0A\u4F20\u3002");
    console.log("");
    if (open) openBrowser(url);
  });
  server.on("error", (err) => {
    console.error(`Dashboard \u542F\u52A8\u5931\u8D25: ${err.message}`);
  });
  return server;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LLMError,
  PROVIDERS,
  UnifiedLLM,
  autoDetectProvider,
  createLLM,
  envKeyPresent,
  getProvider,
  interpolateEnv,
  isLLMError,
  loadConfigFile,
  normalizeProviderId,
  parseJsonText,
  providerExists,
  resolveConfig,
  serveDashboard,
  startDashboard
});
