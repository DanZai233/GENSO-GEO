import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getEmaNotesCollectionName, getEmaNotesDb } from "../lib/emaNotesDb.js";

type EmaNoteDocument = {
  message: string;
  email: string;
  entry: Record<string, unknown>;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  lat: number;
  lng: number;
  radiusKm: number;
  visitorCountry: string;
  visitorRegion: string;
  visitorCity: string;
  createdAt: number;
};

const MIN_RADIUS_KM = 10;
const MAX_RADIUS_KM = 300;
const DEFAULT_RADIUS_KM = 100;

let indexReady = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const collection = await getCollection();

    if (req.method === "GET") {
      const mode = readQueryString(req.query.mode);
      const limit = clampInt(readQueryString(req.query.limit), 1, 100, 36);

      if (mode === "nearby") {
        const lat = Number(readQueryString(req.query.lat));
        const lng = Number(readQueryString(req.query.lng));
        const radiusKm = clampNumber(readQueryString(req.query.radiusKm), MIN_RADIUS_KM, MAX_RADIUS_KM, DEFAULT_RADIUS_KM);

        if (!isValidCoordinate(lat, lng)) {
          return res.status(400).json({ error: "Invalid coordinates" });
        }

        const notes = await collection
          .find({
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [lng, lat],
                },
                $maxDistance: radiusKm * 1000,
              },
            },
          })
          .limit(limit)
          .toArray();

        return res.status(200).json(notes.map(toPublicNote));
      }

      const notes = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return res.status(200).json(notes.map(toPublicNote));
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const entry = sanitizeEntry(body.entry);
      const lat = Number(body.lat ?? entry.lat);
      const lng = Number(body.lng ?? entry.lng);

      if (!entry.fullName && !entry.fullName_zh && !entry.fullName_en && !entry.fullName_ja) {
        return res.status(400).json({ error: "Missing generated name" });
      }

      if (!isValidCoordinate(lat, lng)) {
        return res.status(400).json({ error: "Invalid coordinates" });
      }

      const message = clampText(body.message, 800);
      if (message.length < 2) {
        return res.status(400).json({ error: "Message is too short" });
      }

      const email = sanitizeEmail(body.email);
      const radiusKm = clampNumber(body.radiusKm, MIN_RADIUS_KM, MAX_RADIUS_KM, DEFAULT_RADIUS_KM);
      const note: EmaNoteDocument = {
        message,
        email,
        entry,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
        lat,
        lng,
        radiusKm,
        visitorCountry: clampText(readHeader(req, "x-vercel-ip-country") || "Unknown", 64),
        visitorRegion: clampText(readHeader(req, "x-vercel-ip-country-region") || "", 64),
        visitorCity: clampText(readHeader(req, "x-vercel-ip-city") || "", 96),
        createdAt: Date.now(),
      };

      const result = await collection.insertOne(note);
      return res.status(201).json({
        id: result.insertedId.toString(),
        ...toPublicNote({ _id: result.insertedId, ...note }),
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Ema notes API error:", error);
    return res.status(500).json({ error: "Failed to reach the shrine message board" });
  }
}

async function getCollection() {
  const db = await getEmaNotesDb();
  const collection = db.collection<EmaNoteDocument>(getEmaNotesCollectionName());

  if (!indexReady) {
    await collection.createIndex({ location: "2dsphere" });
    await collection.createIndex({ createdAt: -1 });
    indexReady = true;
  }

  return collection;
}

function toPublicNote(note: any) {
  return {
    id: note._id?.toString?.() || note.id,
    message: note.message,
    email: note.email || "",
    entry: note.entry,
    lat: note.lat,
    lng: note.lng,
    radiusKm: note.radiusKm || DEFAULT_RADIUS_KM,
    visitorCountry: note.visitorCountry || "Unknown",
    visitorRegion: note.visitorRegion || "",
    visitorCity: note.visitorCity || "",
    createdAt: note.createdAt,
  };
}

function sanitizeEntry(raw: unknown) {
  const source = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const allowedKeys = [
    "id",
    "placeName",
    "placeName_zh",
    "placeName_en",
    "placeName_ja",
    "country",
    "country_zh",
    "country_en",
    "country_ja",
    "firstName",
    "firstName_zh",
    "firstName_en",
    "firstName_ja",
    "firstName_romaji",
    "lastName",
    "lastName_zh",
    "lastName_en",
    "lastName_ja",
    "lastName_romaji",
    "fullName",
    "fullName_zh",
    "fullName_en",
    "fullName_ja",
    "fullName_romaji",
    "inspiration",
    "inspiration_zh",
    "inspiration_en",
    "inspiration_ja",
    "characterArchetype",
    "characterArchetype_zh",
    "characterArchetype_en",
    "characterArchetype_ja",
    "lat",
    "lng",
    "createdAt",
  ];

  return Object.fromEntries(
    allowedKeys
      .filter((key) => source[key] !== undefined)
      .map((key) => {
        const value = source[key];
        if (typeof value === "string") return [key, clampText(value, 1000)];
        if (typeof value === "number" && Number.isFinite(value)) return [key, value];
        return [key, value];
      }),
  );
}

function sanitizeEmail(raw: unknown) {
  const value = clampText(raw, 160);
  if (!value) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

function isValidCoordinate(lat: number, lng: number) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function clampText(raw: unknown, maxLength: number) {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function clampInt(raw: unknown, min: number, max: number, fallback: number) {
  return Math.floor(clampNumber(raw, min, max, fallback));
}

function clampNumber(raw: unknown, min: number, max: number, fallback: number) {
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function readQueryString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function readHeader(req: VercelRequest, name: string) {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}
