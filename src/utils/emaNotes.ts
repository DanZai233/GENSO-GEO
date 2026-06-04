import { EmaNote, Language, NameEntry } from "../types";

export function getEntryName(entry: Partial<NameEntry>, lang: Language) {
  if (lang === "zh") return entry.fullName_zh || entry.fullName || entry.fullName_en || entry.fullName_ja || "未名之灵";
  if (lang === "ja") return entry.fullName_ja || entry.fullName || entry.fullName_zh || entry.fullName_en || "名もなき霊";
  return entry.fullName_en || entry.fullName || entry.fullName_zh || entry.fullName_ja || "Unnamed Spirit";
}

export function getEntryPlace(entry: Partial<NameEntry>, lang: Language) {
  if (lang === "zh") return entry.placeName_zh || entry.placeName || entry.placeName_en || entry.placeName_ja || "未知灵脉";
  if (lang === "ja") return entry.placeName_ja || entry.placeName || entry.placeName_zh || entry.placeName_en || "未知の霊脈";
  return entry.placeName_en || entry.placeName || entry.placeName_zh || entry.placeName_ja || "Unknown Leyline";
}

export function getEntryCountry(entry: Partial<NameEntry>, lang: Language) {
  if (lang === "zh") return entry.country_zh || entry.country || entry.country_en || entry.country_ja || "";
  if (lang === "ja") return entry.country_ja || entry.country || entry.country_zh || entry.country_en || "";
  return entry.country_en || entry.country || entry.country_zh || entry.country_ja || "";
}

export function getEntryArchetype(entry: Partial<NameEntry>, lang: Language) {
  if (lang === "zh") return entry.characterArchetype_zh || entry.characterArchetype || entry.characterArchetype_en || entry.characterArchetype_ja || "";
  if (lang === "ja") return entry.characterArchetype_ja || entry.characterArchetype || entry.characterArchetype_zh || entry.characterArchetype_en || "";
  return entry.characterArchetype_en || entry.characterArchetype || entry.characterArchetype_zh || entry.characterArchetype_ja || "";
}

export function getEntryInspiration(entry: Partial<NameEntry>, lang: Language) {
  if (lang === "zh") return entry.inspiration_zh || entry.inspiration || entry.inspiration_en || entry.inspiration_ja || "";
  if (lang === "ja") return entry.inspiration_ja || entry.inspiration || entry.inspiration_zh || entry.inspiration_en || "";
  return entry.inspiration_en || entry.inspiration || entry.inspiration_zh || entry.inspiration_ja || "";
}

export function formatEmaTime(timestamp: number, lang: Language) {
  const locale = lang === "zh" ? "zh-CN" : lang === "ja" ? "ja-JP" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export async function fetchEmaNotes(limit = 60) {
  const response = await fetch(`/api/ema-notes?limit=${limit}`);
  if (!response.ok) throw new Error("Failed to load ema notes");
  return response.json() as Promise<EmaNote[]>;
}

export async function fetchNearbyEmaNotes(lat: number, lng: number, radiusKm: number) {
  const params = new URLSearchParams({
    mode: "nearby",
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
    limit: "24",
  });
  const response = await fetch(`/api/ema-notes?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to load nearby ema notes");
  return response.json() as Promise<EmaNote[]>;
}

export async function publishEmaNote(payload: {
  entry: NameEntry;
  message: string;
  authorName: string;
  email: string;
  radiusKm: number;
}) {
  const response = await fetch("/api/ema-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      lat: payload.entry.lat,
      lng: payload.entry.lng,
    }),
  });

  if (!response.ok) throw new Error("Failed to publish ema note");
  return response.json() as Promise<EmaNote>;
}
