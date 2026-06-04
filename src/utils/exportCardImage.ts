import { Language, NameEntry } from "../types";
import { getEntryArchetype, getEntryCountry, getEntryInspiration, getEntryName, getEntryPlace } from "./emaNotes";
import { translations } from "./translations";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 1600;

export async function exportNameEntryCard(entry: NameEntry, lang: Language) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas export is not supported in this browser.");

  drawSpellcard(ctx, entry, lang);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("Failed to create PNG blob."));
    }, "image/png", 0.96);
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeFileName(getEntryName(entry, lang) || "GensoGeo")}_GeoCard.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function drawSpellcard(ctx: CanvasRenderingContext2D, entry: NameEntry, lang: Language) {
  const t = translations[lang];
  const name = getEntryName(entry, lang);
  const place = getEntryPlace(entry, lang);
  const country = getEntryCountry(entry, lang);
  const archetype = getEntryArchetype(entry, lang);
  const inspiration = getEntryInspiration(entry, lang);
  const secondaryName = getSecondaryName(entry, lang);

  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  const parchment = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT);
  parchment.addColorStop(0, "#fffdf7");
  parchment.addColorStop(0.52, "#f7efe0");
  parchment.addColorStop(1, "#fff8ea");
  ctx.fillStyle = parchment;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  drawPattern(ctx);

  fillRoundedRect(ctx, 70, 70, CARD_WIDTH - 140, CARD_HEIGHT - 140, 34, "#fffaf0");
  strokeRoundedRect(ctx, 70, 70, CARD_WIDTH - 140, CARD_HEIGHT - 140, 34, "#7f1d1d", 7);
  strokeRoundedRect(ctx, 96, 96, CARD_WIDTH - 192, CARD_HEIGHT - 192, 26, "#d8b36d", 3);

  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(70, 160, CARD_WIDTH - 140, 18);
  ctx.fillStyle = "#d8b36d";
  ctx.fillRect(70, 178, CARD_WIDTH - 140, 6);

  ctx.save();
  ctx.translate(CARD_WIDTH - 178, 220);
  ctx.rotate(0.18);
  drawSeal(ctx);
  ctx.restore();

  ctx.textAlign = "left";
  ctx.fillStyle = "#7f1d1d";
  ctx.font = '900 30px "Space Grotesk", "Inter", sans-serif';
  ctx.fillText("GENSO-GEO", 130, 145);
  ctx.fillStyle = "#9f1239";
  ctx.font = '800 26px "Inter", sans-serif';
  ctx.fillText(lang === "zh" ? "幻想灵脉纸扎符卡" : lang === "ja" ? "幻想霊脈御札スペル" : "Leyline Spellcard Ledger", 130, 214);

  drawLabel(ctx, t.originLabel, [place, country].filter(Boolean).join(" / "), 130, 305, 940);

  ctx.fillStyle = "#111827";
  ctx.font = '900 76px "Space Grotesk", "Inter", sans-serif';
  const nextY = wrapText(ctx, name, 130, 460, 850, 90, 2);
  let cursorY = Math.min(nextY + 18, 648);

  if (secondaryName) {
    ctx.fillStyle = "#9f1239";
    ctx.font = '700 30px "Inter", sans-serif';
    cursorY = Math.min(wrapText(ctx, secondaryName, 132, cursorY, 820, 40, 1) + 18, 700);
  }

  cursorY = Math.max(cursorY, 650);
  if (entry.fullName_romaji) {
    drawPill(ctx, `romaji: ${entry.fullName_romaji}`, 130, cursorY, "#fff7ed", "#92400e", "#f3d7a6");
    cursorY += 78;
  }

  if (archetype) {
    drawPill(ctx, `${t.typeLabel}: ${archetype}`, 130, cursorY, "#fff1f2", "#9f1239", "#fecdd3");
    cursorY += 78;
  }

  const gridTop = 830;
  fillRoundedRect(ctx, 130, gridTop, 940, 228, 22, "#fff7ed");
  strokeRoundedRect(ctx, 130, gridTop, 940, 228, 22, "#ecd7b5", 2);
  drawMiniField(ctx, "汉", entry.fullName_zh || entry.fullName || name, 170, gridTop + 58, 410);
  drawMiniField(ctx, "日", entry.fullName_ja || entry.fullName || name, 640, gridTop + 58, 390);
  drawMiniField(ctx, "EN", entry.fullName_en || entry.fullName || name, 170, gridTop + 150, 410);
  drawMiniField(ctx, "音", entry.fullName_romaji || entry.fullName_en || name, 640, gridTop + 150, 390);

  ctx.fillStyle = "#7c2d12";
  ctx.font = '900 28px "Inter", sans-serif';
  const inspirationTop = gridTop + 315;
  ctx.fillText(t.inspirationLabel, 130, inspirationTop);

  ctx.fillStyle = "#374151";
  ctx.font = '500 34px "Inter", sans-serif';
  wrapText(ctx, inspiration || "", 130, inspirationTop + 65, 940, 52, 4);

  ctx.fillStyle = "#9ca3af";
  ctx.font = '800 22px "Space Grotesk", "Inter", sans-serif';
  ctx.fillText(`${t.idPrefix}: CN-${(entry.id || "genso").substring(0, 6).toUpperCase()}`, 130, 1462);

  ctx.textAlign = "right";
  ctx.fillStyle = "#7f1d1d";
  ctx.font = '900 24px "Inter", sans-serif';
  ctx.fillText(lang === "zh" ? "少女祈祷中～ 生成纪念" : lang === "ja" ? "少女祈祷中～ 生成記念" : "Girls Are Praying - Generated Record", 1070, 1462);
}

function drawPattern(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.strokeStyle = "rgba(127, 29, 29, 0.08)";
  ctx.lineWidth = 2;
  for (let x = -CARD_HEIGHT; x < CARD_WIDTH; x += 52) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + CARD_HEIGHT, CARD_HEIGHT);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSeal(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(127, 29, 29, 0.12)";
  ctx.beginPath();
  ctx.arc(0, 0, 92, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(127, 29, 29, 0.28)";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = "rgba(127, 29, 29, 0.28)";
  ctx.font = '900 82px "Space Grotesk", serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("文", 0, 6);
  ctx.textBaseline = "alphabetic";
}

function drawLabel(ctx: CanvasRenderingContext2D, label: string, value: string, x: number, y: number, maxWidth: number) {
  ctx.fillStyle = "#9f1239";
  ctx.font = '900 24px "Inter", sans-serif';
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#374151";
  ctx.font = '700 32px "Inter", sans-serif';
  wrapText(ctx, value, x, y + 48, maxWidth, 42, 2);
}

function drawMiniField(ctx: CanvasRenderingContext2D, label: string, value: string, x: number, y: number, maxWidth: number) {
  ctx.fillStyle = "#9f1239";
  ctx.font = '900 24px "Inter", sans-serif';
  ctx.fillText(label, x, y);
  ctx.fillStyle = "#374151";
  ctx.font = '700 28px "Inter", sans-serif';
  wrapText(ctx, value, x + 56, y, maxWidth, 34, 2);
}

function drawPill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, bg: string, fg: string, border: string) {
  ctx.font = '900 26px "Inter", sans-serif';
  const width = Math.min(ctx.measureText(text).width + 42, 940);
  fillRoundedRect(ctx, x, y, width, 50, 14, bg);
  strokeRoundedRect(ctx, x, y, width, 50, 14, border, 2);
  ctx.fillStyle = fg;
  ctx.fillText(trimToWidth(ctx, text, width - 42), x + 21, y + 34);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const source = (text || "").replace(/\s+/g, " ").trim();
  const units = splitWrapUnits(source);
  let line = "";
  let lineCount = 0;

  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index];
    const testLine = shouldJoinWithoutSpace(line, unit) ? `${line}${unit}` : `${line}${line ? " " : ""}${unit}`;

    if (ctx.measureText(testLine).width > maxWidth && line) {
      lineCount += 1;
      const isLastLine = lineCount === maxLines;
      ctx.fillText(isLastLine && index < units.length ? trimToWidth(ctx, `${line}...`, maxWidth) : line, x, y);
      if (isLastLine) return y + lineHeight;
      line = unit;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    ctx.fillText(trimToWidth(ctx, line, maxWidth), x, y);
    y += lineHeight;
  }

  return y;
}

function splitWrapUnits(text: string) {
  if (!text) return [];
  if (/[\u4e00-\u9fff\u3040-\u30ff]/.test(text)) {
    return Array.from(text);
  }
  return text.split(" ");
}

function shouldJoinWithoutSpace(line: string, unit: string) {
  return !line || /[\u4e00-\u9fff\u3040-\u30ff]/.test(unit);
}

function trimToWidth(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let result = text;
  while (result.length > 1 && ctx.measureText(result).width > maxWidth) {
    result = `${result.slice(0, -4)}...`;
  }
  return result;
}

function fillRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
) {
  drawRoundedPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
  lineWidth: number,
) {
  drawRoundedPath(ctx, x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawRoundedPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getSecondaryName(entry: NameEntry, lang: Language) {
  if (lang === "zh") return entry.fullName_en || entry.fullName_ja || "";
  if (lang === "ja") return entry.fullName_zh || entry.fullName_en || "";
  return entry.fullName_zh || entry.fullName_ja || "";
}

function safeFileName(value: string) {
  return value
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80) || "GensoGeo";
}
