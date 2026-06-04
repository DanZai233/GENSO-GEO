import { Db, MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getEmaNotesDb() {
  if (cachedDb) return cachedDb;

  const uri = firstEnv(["MONGODB_URI", "GENSOGEO_MONGODB_URI", "PIXELBEAD_MONGODB_URI"]);
  if (!uri) {
    throw new Error("MongoDB is not configured. Set MONGODB_URI in Vercel.");
  }

  cachedClient ||= new MongoClient(uri);
  await cachedClient.connect();

  cachedDb = cachedClient.db(firstEnv(["GENSOGEO_MONGODB_DB", "MONGODB_DB"]) || "pixelbead");
  return cachedDb;
}

export function getEmaNotesCollectionName() {
  return firstEnv(["GENSOGEO_EMA_COLLECTION", "EMA_NOTES_COLLECTION"]) || "genso_ema_notes";
}

function firstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return "";
}
