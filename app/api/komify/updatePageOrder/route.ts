import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { slug, chapter, order } = await req.json();

    if (!slug || !chapter || !Array.isArray(order)) {
      return NextResponse.json(
        { message: "slug, chapter & order required" },
        { status: 400 }
      );
    }

    const comicsPath = path.join(process.cwd(), "data/komify/comics.json");
    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));

    const comic = comics.find((c: any) => String(c.slug) === String(slug));
    if (!comic) {
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });
    }

    const chapterData = comic.chapters.find(
      (c: any) => String(c.number) === String(chapter)
    );
    if (!chapterData) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    const pages = Array.isArray(chapterData.pages) ? chapterData.pages : [];

    // Map filename -> page object
    const pageMap = new Map(pages.map((p: any) => [p.filename, p]));

    // Rebuild pages with NEW order
    const reorderedPages = order
      .map((filename: string, index: number) => {
        const page = pageMap.get(filename);
        if (!page) return null;

        return {
          ...page,
          order: index + 1, // ✅ order dimulai dari 1
        };
      })
      .filter(Boolean);

    chapterData.pages = reorderedPages;

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Page order updated" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Update order failed", error: err.message },
      { status: 500 }
    );
  }
}
