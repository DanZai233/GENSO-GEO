import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateDescriptionName } from "../lib/nameGeneration.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await generateDescriptionName(req.body || {});
    return res.status(200).json(data);
  } catch (error) {
    console.error("Vercel description generation error:", error);
    return res.status(500).json({
      error: "Failed to generate custom name from description",
    });
  }
}
