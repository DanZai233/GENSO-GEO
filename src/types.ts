// Global Types

export interface NameEntry {
  id: string;
  placeName_zh: string;
  placeName_en: string;
  placeName_ja: string;
  country_zh: string;
  country_en: string;
  country_ja: string;

  firstName_zh: string;
  lastName_zh: string;
  fullName_zh: string;
  inspiration_zh: string;
  characterArchetype_zh: string;

  firstName_en: string;
  lastName_en: string;
  fullName_en: string;
  inspiration_en: string;
  characterArchetype_en: string;

  firstName_ja: string;
  lastName_ja: string;
  fullName_ja: string;
  inspiration_ja: string;
  characterArchetype_ja: string;

  // Fallbacks for older entries
  placeName: string;
  country: string;
  firstName: string;
  lastName: string;
  fullName: string;
  inspiration: string;
  characterArchetype: string;
  createdAt: number;
}

export type ViewMode = 'map' | 'collection';
export type Language = 'zh' | 'en' | 'ja';

