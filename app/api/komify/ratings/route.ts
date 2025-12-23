import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const COMICS_PATH = path.join(process.cwd(), "data/komify", "comics.json");

function readComics() {
  if (!fs.existsSync(COMICS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(COMICS_PATH, "utf8"));
  } catch {
    return [];
  }
}

function writeComics(data: any[]) {
  fs.writeFileSync(COMICS_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const comics = readComics();
  const comic = comics.find((c: any) => String(c.slug) === String(slug));

  return NextResponse.json({
    slug,
    rating: comic?.rating ?? 0,
  });
}

export async function POST(req: Request) {
  const { slug, rating } = await req.json();

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  if (typeof rating !== "number" || rating < 1 || rating > 5)
    return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });

  const comics = readComics();

  const index = comics.findIndex((c: any) => String(c.slug) === String(slug));
  if (index === -1)
    return NextResponse.json({ error: "comic not found" }, { status: 404 });

  comics[index].rating = rating;

  writeComics(comics);

  return NextResponse.json({
    success: true,
    slug,
    rating,
  });
}
