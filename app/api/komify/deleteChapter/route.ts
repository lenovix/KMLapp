import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COMICS_PATH = path.join(process.cwd(), "data/komify", "comics.json");

export async function POST(req: Request) {
  try {
    const { slug, chapter } = await req.json();

    if (!slug || !chapter) {
      return NextResponse.json(
        { message: "slug & chapter required" },
        { status: 400 }
      );
    }

    let comics: any[] = [];
    if (fs.existsSync(COMICS_PATH)) {
      comics = JSON.parse(fs.readFileSync(COMICS_PATH, "utf-8"));
    }

    const idx = comics.findIndex((c: any) => String(c.slug) === String(slug));
    if (idx === -1) {
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });
    }

    comics[idx].chapters = comics[idx].chapters.filter(
      (ch: any) => Number(ch.number) !== Number(chapter)
    );

    fs.writeFileSync(COMICS_PATH, JSON.stringify(comics, null, 2));

    const chapterDir = path.join(
      process.cwd(),
      "public",
      "komify",
      String(slug),
      "chapters",
      String(chapter)
    );

    if (fs.existsSync(chapterDir)) {
      fs.rmSync(chapterDir, { recursive: true, force: true });
    }

    return NextResponse.json({ message: "Chapter deleted", success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete chapter", error: String(error) },
      { status: 500 }
    );
  }
}
