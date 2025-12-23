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
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  const comics = readComics();

  if (slug) {
    const comic = comics.find((c: any) => String(c.slug) === String(slug));
    return NextResponse.json({
      bookmarked: comic?.bookmark === true,
    });
  }

  const bookmarkedSlugs = comics
    .filter((c: any) => c.bookmark === true)
    .map((c: any) => String(c.slug));

  return NextResponse.json({
    bookmarks: bookmarkedSlugs,
  });
}

export async function POST(req: Request) {
  const { slug } = await req.json();

  if (!slug)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const comics = readComics();

  const index = comics.findIndex((c: any) => String(c.slug) === String(slug));
  if (index === -1)
    return NextResponse.json({ error: "Comic not found" }, { status: 404 });

  const current = comics[index].bookmark === true;
  const updated = !current;

  comics[index].bookmark = updated;

  writeComics(comics);

  return NextResponse.json({
    success: true,
    bookmarked: updated,
  });
}
