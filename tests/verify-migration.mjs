// GENSO-GEO 迁移联调验证:对本地构建的服务端跑真实 HTTP 请求
// 前置:mock 服务(18901)+ GENSO 服务(3911)已启动
const BASE = process.env.GENSO_BASE || "http://127.0.0.1:3911";

let fail = 0;
const ok = (name, cond, extra = "") => {
  console.log(`  ${cond ? "✓" : "✗"} ${name}${cond ? "" : " " + extra}`);
  if (!cond) fail++;
};

const post = (path, body) => fetch(BASE + path, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
}).then(async (r) => ({ status: r.status, data: await r.json() }));

// 1. 厂商注册表(供前端设置面板)
const prov = await fetch(BASE + "/api/providers").then((r) => r.json());
ok("GET /api/providers 返回注册表", Array.isArray(prov.providers) && prov.providers.length >= 10, `count=${prov.providers?.length}`);
ok("注册表含 deepseek/gemini/custom", ["deepseek", "gemini", "custom", "volcengine"].every((id) => prov.providers.some((p) => p.id === id)));

// 2. 模型列表(走环境变量:AI_PROVIDER=openai-compatible → custom)
const models = await post("/api/models", { provider: "custom" });
ok("POST /api/models 返回模型列表", models.status === 200 && models.data.source === "api" && models.data.models.includes("mock-model-a"), JSON.stringify(models.data).slice(0, 150));

// 3. 生成名称(纯环境变量配置)
const gen = await post("/api/generate-name", { placeName: "Kyoto", country: "Japan", locationType: "Shrine" });
ok("POST /api/generate-name 成功", gen.status === 200 && gen.data.fullName_zh, `status=${gen.status} err=${gen.data?.error}`);
ok("JSON 生成+字段富化生效", gen.data.fullName_zh === "紫苑" && gen.data.placeName_zh === "京都", JSON.stringify(gen.data).slice(0, 120));

// 4. 生成名称(前端 modelConfig 覆盖)
const gen2 = await post("/api/generate-name", {
  placeName: "Tokyo", country: "Japan", locationType: "Temple",
  modelConfig: { provider: "custom", model: "mock-model", apiKey: "test-key", baseUrl: "http://127.0.0.1:18901/v1" },
});
ok("modelConfig 覆盖生效", gen2.status === 200 && gen2.data.fullName_zh && gen2.data.placeName_zh === "京都", gen2.data?.error || JSON.stringify(gen2.data).slice(0, 120));

// 5. 描述生成
const gen3 = await post("/api/generate-description-name", {
  description: "一位守护神社的巫女", characterStyle: "mystic", placeName: "Kyoto", country: "Japan", locationType: "Shrine",
  modelConfig: { provider: "custom", model: "mock-model", apiKey: "test-key", baseUrl: "http://127.0.0.1:18901/v1" },
});
ok("POST /api/generate-description-name 成功", gen3.status === 200 && gen3.data.fullName_zh, gen3.data?.error || JSON.stringify(gen3.data).slice(0, 120));

// 6. 错误路径:坏 key 透传错误信息
const bad = await post("/api/models", { provider: "custom", apiKey: "wrong" });
ok("坏 key 返回 500 + 错误信息", bad.status === 500 && typeof bad.data.error === "string" && bad.data.error.length > 0, JSON.stringify(bad.data).slice(0, 120));

console.log(fail === 0 ? "\n🎉 GENSO-GEO 迁移联调全部通过" : `\n❌ ${fail} 项失败`);
process.exit(fail === 0 ? 0 : 1);
