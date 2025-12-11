import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const BOOKMARKS_PATH = path.join(
  process.cwd(),
  "data/komify",
  "bookmarks.json"
);

/** Baca file JSON */
function readBookmarksFile(): string[] {
  try {
    if (!fs.existsSync(BOOKMARKS_PATH)) return [];
    const raw = fs.readFileSync(BOOKMARKS_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Tulis ke file JSON */
function writeBookmarksFile(data: string[]) {
  try {
    fs.writeFileSync(BOOKMARKS_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write bookmarks file", err);
  }
}

/** GET — cek bookmark per slug */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug"); // tetap string
  const bookmarks = readBookmarksFile();
  const bookmarked = slug ? bookmarks.includes(slug) : false;
  return NextResponse.json({ bookmarked, bookmarks });
}

/** POST — toggle bookmark */
export async function POST(req: Request) {
  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  let bookmarks = readBookmarksFile();

  if (bookmarks.includes(slug)) {
    bookmarks = bookmarks.filter((id) => id !== slug);
  } else {
    bookmarks.push(slug);
  }

  writeBookmarksFile(bookmarks);

  return NextResponse.json({
    success: true,
    bookmarked: bookmarks.includes(slug),
  });
}
