import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { slug, chapter, filename, all } = await req.json();

    if (!slug || !chapter) {
      return NextResponse.json(
        { message: "slug & chapter required" },
        { status: 400 }
      );
    }

    const comicsPath = path.join(process.cwd(), "data/komify/comics.json");
    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));

    const comic = comics.find((c: any) => String(c.slug) === String(slug));
    if (!comic)
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });

    const chapterData = comic.chapters.find(
      (c: any) => String(c.number) === String(chapter)
    );
    if (!chapterData) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "komify",
      slug,
      "chapters",
      chapter
    );

    if (all) {
      if (fs.existsSync(uploadDir)) {
        fs.rmSync(uploadDir, { recursive: true, force: true });
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      chapterData.pages = [];
    } else if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      chapterData.pages = chapterData.pages.filter(
        (p: any) => p.filename !== filename
      );
    } else {
      return NextResponse.json(
        { message: "filename or all=true required" },
        { status: 400 }
      );
    }

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Page(s) deleted" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Delete pages failed", error: err.message },
      { status: 500 }
    );
  }
}
