import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PROVIDERS } from "unillm-sdk";

/** 返回 unillm-sdk 内置厂商注册表,供前端渲染厂商选择器 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    providers: PROVIDERS.map((p) => ({
      id: p.id,
      label: p.label,
      needsApiKey: p.needsApiKey,
      note: p.note || "",
    })),
  });
}
