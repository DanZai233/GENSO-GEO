export interface PlaceGenerationInput {
  placeName?: string;
  country?: string;
  locationType?: string;
}

export interface DescriptionGenerationInput extends PlaceGenerationInput {
  description?: string;
  characterStyle?: string;
}

const requiredKeys = [
  "placeName_zh", "placeName_en", "placeName_ja",
  "country_zh", "country_en", "country_ja",
  "firstName_zh", "lastName_zh", "fullName_zh", "inspiration_zh", "characterArchetype_zh",
  "firstName_en", "lastName_en", "fullName_en", "inspiration_en", "characterArchetype_en",
  "firstName_ja", "lastName_ja", "fullName_ja", "inspiration_ja", "characterArchetype_ja",
  "firstName_romaji", "lastName_romaji", "fullName_romaji",
].join(", ");

const jsonOnlyInstruction = `Only return one raw valid JSON object. Do not include markdown, code fences, comments, prose, or trailing text.`;

export function buildPlacePrompt(input: PlaceGenerationInput) {
  const placeName = input.placeName || "Kyoto";
  const country = input.country || "Japan";
  const locationType = input.locationType || "Location";

  return `Create one Touhou-inspired mystical character name from this place.
Place: ${placeName}
Country: ${country}
Type/style hint: ${locationType}

Return concise Chinese, English, Japanese, and Romaji fields.
Use all keys exactly: ${requiredKeys}
Keep each inspiration under 55 words or 90 CJK characters.

IMPORTANT: ${jsonOnlyInstruction}`;
}

export function buildDescriptionPrompt(input: DescriptionGenerationInput) {
  const description = input.description || "A mysterious visitor";
  const characterStyle = input.characterStyle || "academic";
  const placeName = input.placeName || "Kyoto";
  const country = input.country || "Japan";
  const locationType = input.locationType || "Location";

  return `Create one Touhou-inspired mystical character name from this character and place.
Character: ${description}
Character style: ${characterStyle}
Place: ${placeName}
Country: ${country}
Type: ${locationType}

Return concise Chinese, English, Japanese, and Romaji fields.
Use all keys exactly: ${requiredKeys}
Keep each inspiration under 55 words or 90 CJK characters.

IMPORTANT: ${jsonOnlyInstruction}`;
}
