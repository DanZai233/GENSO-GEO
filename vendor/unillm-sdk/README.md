# UniLLM SDK

零依赖的统一大模型接入包。**一份代码、一份配置,接入 OpenAI / Anthropic Claude / Google Gemini / 火山豆包 / DeepSeek / Kimi / 通义千问 / 智谱 GLM / Grok / Groq / Mistral / Ollama / 硅基流动 / 任意 OpenAI 兼容端点**。

> 专为解决"每个项目都手写一遍大模型适配器"的问题:以后所有项目共用这一个包,新增厂商只需在注册表加一条记录。

- ✅ 零运行时依赖(Node 18+,原生 fetch,不用各家 SDK)
- ✅ 统一 API:`chat` / `chatStream` / `generateJson` / `generateText`,支持图片输入
- ✅ `listModels()`:拉取厂商真实支持的模型列表(端点不支持时自动回退注册表)
- ✅ 自动重试(429/5xx 退避重试)、超时控制、错误统一为 `LLMError`
- ✅ 配置三合一:代码传参 / 环境变量 / `unillm.config.json`(支持注释和尾逗号)
- ✅ 存量项目零改造:`envPrefix` 自定义前缀 + `AI_*` 旧变量 + 厂商 ID 别名(`openai-compatible`→custom、`google`→gemini、`ark`→volcengine)
- ✅ 内置可视化 Dashboard:选厂商、填 Key、拉模型列表、测对话、一键复制配置
- ✅ CLI:`init` / `dashboard` / `test` / `providers` / `models`
- ✅ ESM + CJS 双格式,TypeScript 类型完整

## 快速开始

```bash
# 1. 在项目里安装
npm install unillm-sdk

# 2. 生成配置模板(可选,生成 unillm.config.json 和 .env.example)
npx unillm init

# 3. 启动可视化 Dashboard,选厂商、填 Key、测对话
npx unillm dashboard
# → http://127.0.0.1:3788/llm
```

然后配置厂商(任选其一):

```bash
# 方式 A:环境变量(推荐,Key 不进代码)
export DEEPSEEK_API_KEY=sk-xxx
# 或 UNILLM_PROVIDER=deepseek 指定厂商;不指定时自动探测已配置 Key 的厂商
```

```jsonc
// 方式 B:unillm.config.json(支持 // 注释与尾逗号)
{
  "provider": "deepseek",
  "apiKey": "${DEEPSEEK_API_KEY}",   // 引用环境变量,不写明文
  "model": "deepseek-chat",
  "temperature": 0.7,
  "maxTokens": 4096,
  "timeoutMs": 120000,
  "retries": 2,
  "providers": {                       // 各厂商独立覆盖(可选)
    "gemini": { "model": "gemini-2.5-flash" },
    "volcengine": { "model": "ep-20240101-xxxxx" }
  }
}
```

## 代码接入

```ts
import { UnifiedLLM, createLLM } from "unillm-sdk";

// 不传配置时自动读取:环境变量 > unillm.config.json > 默认值
const llm = new UnifiedLLM();

// 也可以按项目显式指定(各项目想用不同的厂商/模型,互不影响)
const llm2 = createLLM({ provider: "gemini", apiKey: process.env.GEMINI_API_KEY });

// 纯文本
const text = await llm.generateText("你好");

// 流式
for await (const delta of llm.chatStream("写一首诗")) {
  process.stdout.write(delta);
}

// 结构化 JSON(自动兜底解析,不怕厂商不支持 response_format)
const data = await llm.generateJson("从这句话里提取人名和日期:张三明天下午3点开会");

// 多轮对话 + 系统提示
const reply = await llm.chat([
  { role: "system", content: "你是严谨的面试教练" },
  { role: "user", content: "帮我准备自我介绍" },
]);

// 图片输入(OpenAI 系 / Anthropic / Gemini 均支持)
await llm.chat([{
  role: "user",
  content: [
    { type: "text", text: "这张图里有什么?" },
    { type: "image", base64: imageBase64, mimeType: "image/png" },
  ],
}]);

// 拉取厂商真实支持的模型列表(OpenAI 系 GET /models,Gemini / Anthropic 同理)
const { models, source } = await llm.listModels();
// source: "api" = 厂商真实返回;"registry" = 端点不支持列表,回退内置注册表
```

### 存量项目迁移(复用已有环境变量)

老项目(如 GENSO-GEO / mianleme)通常已经配了一套 `AI_PROVIDER` / `VOLCENGINE_API_KEY` / `OPENAI_COMPATIBLE_*` 环境变量,零改名直接迁移:

```ts
// 1. 自定义前缀:额外读取 GENSOGEO_AI_PROVIDER / GENSOGEO_AI_API_KEY / GENSOGEO_AI_MODEL / GENSOGEO_AI_API_BASE
const llm = new UnifiedLLM({ envPrefix: "GENSOGEO_AI_" });

// 2. 旧版 AI_* 通用变量自动兼容:AI_PROVIDER / AI_MODEL / AI_TEMPERATURE / AI_MAX_TOKENS / AI_REQUEST_RETRIES
// 3. 厂商 ID 别名自动归一化:openai-compatible → custom,google → gemini,ark → volcengine
```

不用 `envPrefix` 时,`AI_PROVIDER`、`AI_MODEL`、`AI_TEMPERATURE`、`AI_MAX_TOKENS`、`AI_REQUEST_RETRIES` 等旧变量也被识别,`OPENAI_COMPATIBLE_API_KEY` / `OPENAI_COMPATIBLE_BASE_URL` 归入 custom 厂商。

### 参数一览

| 方法 | 说明 |
| --- | --- |
| `generateText(input, opts)` | 纯文本输出 |
| `generateJson(input, opts)` | 结构化输出,解析失败会尽力提取 JSON |
| `chat(messages, opts)` | 完整对话,返回 `{ text, provider, model, usage, finishReason }` |
| `chatStream(messages, opts)` | 流式对话(AsyncGenerator) |
| `chatStreamText(messages, opts)` | 流式但一次性收集全文 |
| `listModels(overrides?)` | 拉取厂商真实模型列表,失败自动回退注册表 |

`opts`:`model` / `temperature` / `maxTokens` / `json` / `signal`(取消)/ `headers`(附加请求头)

### 错误处理

所有错误统一为 `LLMError`,带 `status`(HTTP 状态码)、`provider`、`code`(`TIMEOUT` / `MISSING_API_KEY` / `UPSTREAM_ERROR` / `INVALID_JSON`):

```ts
import { LLMError, isLLMError } from "unillm-sdk";

try {
  await llm.generateText("hi");
} catch (err) {
  if (isLLMError(err) && err.status === 429) {
    // 限流(包内已自动重试过 retries 次)
  }
}
```

## 支持的厂商

| ID | 厂商 | 协议 | 默认 Base URL | 环境变量 |
| --- | --- | --- | --- | --- |
| `openai` | OpenAI GPT | openai | `https://api.openai.com/v1` | `OPENAI_API_KEY` |
| `anthropic` | Anthropic Claude | anthropic | `https://api.anthropic.com/v1` | `ANTHROPIC_API_KEY` |
| `gemini` | Google Gemini | gemini | `https://generativelanguage.googleapis.com/v1beta` | `GEMINI_API_KEY` / `GOOGLE_API_KEY` |
| `volcengine` | 火山引擎豆包 | openai | `https://ark.cn-beijing.volces.com/api/v3` | `VOLCENGINE_API_KEY` / `ARK_API_KEY` |
| `deepseek` | DeepSeek | openai | `https://api.deepseek.com` | `DEEPSEEK_API_KEY` |
| `moonshot` | Moonshot Kimi | openai | `https://api.moonshot.cn/v1` | `MOONSHOT_API_KEY` |
| `qwen` | 阿里通义千问 | openai | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `DASHSCOPE_API_KEY` |
| `zhipu` | 智谱 GLM | openai | `https://open.bigmodel.cn/api/paas/v4` | `ZHIPU_API_KEY` / `GLM_API_KEY` |
| `xai` | xAI Grok | openai | `https://api.x.ai/v1` | `XAI_API_KEY` |
| `groq` | Groq | openai | `https://api.groq.com/openai/v1` | `GROQ_API_KEY` |
| `mistral` | Mistral AI | openai | `https://api.mistral.ai/v1` | `MISTRAL_API_KEY` |
| `siliconflow` | 硅基流动 | openai | `https://api.siliconflow.cn/v1` | `SILICONFLOW_API_KEY` |
| `ollama` | Ollama(本地) | openai | `http://localhost:11434/v1` | 无需 Key |
| `custom` | 任意 OpenAI 兼容端点 | openai | 自填(vLLM / LM Studio / OneAPI / NewAPI…) | `CUSTOM_BASE_URL` / `CUSTOM_API_KEY` |

用 `npx unillm models <厂商>` 查看各厂商默认模型列表。

## Dashboard

两种用法:

```ts
// 1. 独立启动(CLI 同款)
import { startDashboard } from "unillm-sdk/dashboard";
startDashboard({ port: 3788, open: true });

// 2. 挂进现有的 Express 应用(推荐:项目里直接复用)
import express from "express";
import { serveDashboard } from "unillm-sdk/dashboard";

const app = express();
app.use("/llm", serveDashboard({ path: "/llm" }));
app.listen(3000);
// 访问 http://localhost:3000/llm
```

功能:选择厂商(14 家预设 + 自定义)、填 API Key(仅存浏览器 localStorage)、改 Base URL / 模型 / 温度 / maxTokens、普通与 JSON 模式测试对话、流式输出、环境变量探测、一键复制 `unillm.config.json` 配置。

> 安全说明:Dashboard 是本地调试工具。Key 由浏览器发到本机服务端代理请求,不落盘、不上传任何第三方;生产环境请用环境变量注入 Key。

## CLI

```
unillm init                 生成 unillm.config.json 与 .env.example
unillm dashboard [--port N] 启动可视化 Dashboard(默认 3788)
unillm test [厂商] [--model M] [--prompt "…"] [--json] [--stream]
unillm providers            列出全部厂商
unillm models <厂商>        查看默认模型列表
```

## 配置优先级

```
代码传参 > 环境变量(UNILLM_* 与厂商专用变量)> unillm.config.json > 注册表默认值
```

通用环境变量:`UNILLM_PROVIDER` / `UNILLM_API_KEY` / `UNILLM_MODEL` / `UNILLM_BASE_URL` / `UNILLM_TEMPERATURE` / `UNILLM_MAX_TOKENS` / `UNILLM_TIMEOUT_MS` / `UNILLM_RETRIES` / `UNILLM_CONFIG`(配置文件路径)

兼容旧变量(老项目零改名迁移):`AI_PROVIDER` / `AI_MODEL` / `AI_TEMPERATURE` / `AI_MAX_TOKENS` / `AI_REQUEST_RETRIES` / `AI_TIMEOUT_MS`,以及厂商自身的 `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `GOOGLE_API_KEY` / `VOLCENGINE_API_KEY` / `ARK_API_KEY` / `MOONSHOT_API_KEY` / `DASHSCOPE_API_KEY` / `ZHIPU_API_KEY` / `XAI_API_KEY` / `GROQ_API_KEY` / `MISTRAL_API_KEY` / `SILICONFLOW_API_KEY` / `OPENAI_COMPATIBLE_API_KEY` / `OPENAI_COMPATIBLE_BASE_URL` 等。

厂商 ID 别名:`openai-compatible`/`openai_compatible` → `custom`,`google` → `gemini`,`ark`/`volc`/`doubao` → `volcengine`,`claude` → `anthropic`,`kimi` → `moonshot`,`dashscope`/`tongyi` → `qwen`,`bigmodel` → `zhipu`,`grok` → `xai`,`local` → `ollama`。

不指定厂商时按此优先级自动探测:`openai > anthropic > gemini > deepseek > volcengine > moonshot > qwen > zhipu > xai > groq > mistral > siliconflow > ollama`

## 内部设计

```
src/
├── providers.ts           厂商注册表(新增厂商只改这里)
├── config.ts              配置解析:代码 > env > 配置文件(支持注释/尾逗号/${ENV} 插值)
├── adapters/              三个协议适配器,全部原生 fetch,零 SDK 依赖
│   ├── openai-compatible.ts  覆盖全部 OpenAI 系厂商(含流式/JSON 模式/兼容性回退)
│   ├── anthropic.ts          Claude Messages API
│   └── gemini.ts             Gemini generateContent API
├── client.ts              UnifiedLLM:统一入口、重试退避、超时、JSON 兜底解析
├── dashboard.ts           Dashboard 服务(独立启动 or Express 中间件)
└── cli.ts                 CLI 入口
```

## 开发

```bash
npm install
npm run build     # 构建 ESM + CJS + d.ts
npm test          # 端到端验证(本地 mock 服务,无需真实 Key)
```

## License

MIT
