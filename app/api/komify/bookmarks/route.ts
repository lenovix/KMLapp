import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const COMICS_PATH = path.join(process.cwd(), "data/komify", "comics.json");

/** Baca comics.json */
function readComics() {
  if (!fs.existsSync(COMICS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(COMICS_PATH, "utf8"));
  } catch {
    return [];
  }
}

/** Tulis comics.json */
function writeComics(data: any[]) {
  fs.writeFileSync(COMICS_PATH, JSON.stringify(data, null, 2), "utf8");
}

/** GET — cek apakah komik bookmarked */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const comics = readComics();
  const comic = comics.find((c: any) => String(c.slug) === String(slug));

  return NextResponse.json({
    bookmarked: comic?.bookmark === true,
  });
}

/** POST — toggle bookmark langsung pada comics.json */
export async function POST(req: Request) {
  const { slug } = await req.json();

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const comics = readComics();

  const index = comics.findIndex((c: any) => String(c.slug) === String(slug));
  if (index === -1)
    return NextResponse.json({ error: "Comic not found" }, { status: 404 });

  // Toggle bookmark
  const current = comics[index].bookmark === true;
  const updated = !current;

  comics[index].bookmark = updated;

  writeComics(comics);

  return NextResponse.json({
    success: true,
    bookmarked: updated,
  });
}
