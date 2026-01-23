import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const chapter = searchParams.get("chapter");

  if (!slug || !chapter) {
    return NextResponse.json({ pages: [] });
  }

  const chapterDir = path.join(
    process.cwd(),
    "public",
    "komify",
    String(slug),
    "chapters",
    String(chapter)
  );
  const comicsPath = path.join(process.cwd(), "data", "komify", "comics.json");

  try {
    if (!fs.existsSync(chapterDir) || !fs.existsSync(comicsPath)) {
      return NextResponse.json({ pages: [] });
    }

    const physicalFiles = fs
      .readdirSync(chapterDir)
      .filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));

    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
    const comic = comics.find((c: any) => String(c.slug) === String(slug));
    const chapterData = comic?.chapters?.find(
      (c: any) => String(c.number) === String(chapter)
    );

    const pagesFromJson = Array.isArray(chapterData?.pages)
      ? chapterData.pages
      : [];

    const orderMap = new Map(
      pagesFromJson.map((p: any) => [p.filename, p.order ?? 999])
    );

    const sortedFiles = physicalFiles.sort((a, b) => {
      const orderA = orderMap.get(a) ?? 999;
      const orderB = orderMap.get(b) ?? 999;

      if (orderA !== orderB) return Number(orderA) - Number(orderB);
      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

    return NextResponse.json({
      pages: sortedFiles,
      info: {
        title: chapterData?.title,
        language: chapterData?.language,
        cencored: chapterData?.cencored,
      },
    });
  } catch (err) {
    console.error("Failed to read chapter", err);
    return NextResponse.json({ pages: [] });
  }
}
