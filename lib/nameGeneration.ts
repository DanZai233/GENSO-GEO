import { generateJsonWithModel } from "./aiProvider.js";
import {
  buildDescriptionPrompt,
  buildPlacePrompt,
  type DescriptionGenerationInput,
  type PlaceGenerationInput,
} from "./prompts.js";

export async function generatePlaceName(input: PlaceGenerationInput) {
  const result = await generateJsonWithModel(buildPlacePrompt(input));
  return enrichGeneratedName(result.data, {
    placeName: input.placeName || "Kyoto",
    country: input.country || "Japan",
    provider: result.provider,
    model: result.model,
  });
}

export async function generateDescriptionName(input: DescriptionGenerationInput) {
  const result = await generateJsonWithModel(buildDescriptionPrompt(input));
  return enrichGeneratedName(result.data, {
    placeName: input.placeName || "Kyoto",
    country: input.country || "Japan",
    provider: result.provider,
    model: result.model,
  });
}

function enrichGeneratedName(
  rawData: Record<string, unknown>,
  fallback: {
    placeName: string;
    country: string;
    provider: string;
    model: string;
  },
) {
  const data = { ...rawData } as Record<string, string | number | boolean | undefined>;

  data.placeName = text(data.placeName_zh) || text(data.placeName) || fallback.placeName;
  data.country = text(data.country_zh) || text(data.country) || fallback.country;
  data.firstName = text(data.firstName_zh);
  data.lastName = text(data.lastName_zh);
  data.fullName = text(data.fullName_zh);
  data.inspiration = text(data.inspiration_zh);
  data.characterArchetype = text(data.characterArchetype_zh);

  data.placeName_zh = text(data.placeName_zh) || fallback.placeName;
  data.placeName_en = text(data.placeName_en) || fallback.placeName;
  data.placeName_ja = text(data.placeName_ja) || text(data.placeName_zh) || fallback.placeName;

  data.country_zh = text(data.country_zh) || fallback.country;
  data.country_en = text(data.country_en) || fallback.country;
  data.country_ja = text(data.country_ja) || text(data.country_zh) || fallback.country;

  data.firstName_zh = text(data.firstName_zh);
  data.lastName_zh = text(data.lastName_zh);
  data.fullName_zh = text(data.fullName_zh) || `${text(data.lastName_zh)}${text(data.firstName_zh)}`;
  data.inspiration_zh = text(data.inspiration_zh);
  data.characterArchetype_zh = text(data.characterArchetype_zh);

  data.firstName_en = text(data.firstName_en);
  data.lastName_en = text(data.lastName_en);
  data.fullName_en = text(data.fullName_en) || [text(data.firstName_en), text(data.lastName_en)].filter(Boolean).join(" ");
  data.inspiration_en = text(data.inspiration_en) || text(data.inspiration_zh);
  data.characterArchetype_en = text(data.characterArchetype_en) || text(data.characterArchetype_zh);

  data.firstName_ja = text(data.firstName_ja) || text(data.firstName_zh);
  data.lastName_ja = text(data.lastName_ja) || text(data.lastName_zh);
  data.fullName_ja = text(data.fullName_ja) || text(data.fullName_zh);
  data.inspiration_ja = text(data.inspiration_ja) || text(data.inspiration_zh);
  data.characterArchetype_ja = text(data.characterArchetype_ja) || text(data.characterArchetype_zh);

  data.firstName_romaji = text(data.firstName_romaji) || text(data.firstName_en);
  data.lastName_romaji = text(data.lastName_romaji) || text(data.lastName_en);
  data.fullName_romaji = text(data.fullName_romaji) || [text(data.lastName_romaji), text(data.firstName_romaji)].filter(Boolean).join(" ");

  return data;
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
