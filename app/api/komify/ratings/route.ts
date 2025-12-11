import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const RATINGS_PATH = path.join(process.cwd(), "data/komify", "ratings.json");

// --- FILE HELPERS (Server Only) ---

function readRatingsFile(): Record<string, number> {
  try {
    if (!fs.existsSync(RATINGS_PATH)) return {};
    const raw = fs.readFileSync(RATINGS_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeRatingsFile(data: Record<string, number>) {
  try {
    fs.writeFileSync(RATINGS_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write ratings file", err);
  }
}

// --- API ROUTES ---

/** GET → Ambil rating untuk slug tertentu */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const all = readRatingsFile();
  const rating = all[slug] || 0;

  return NextResponse.json({ slug, rating });
}

/** POST → Set rating */
export async function POST(req: Request) {
  const { slug, rating } = await req.json();

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  if (typeof rating !== "number")
    return NextResponse.json(
      { error: "rating must be number" },
      { status: 400 }
    );

  const all = readRatingsFile();
  all[String(slug)] = rating;

  writeRatingsFile(all);

  return NextResponse.json({
    success: true,
    rating,
  });
}
