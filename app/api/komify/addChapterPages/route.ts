import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug")?.toString();
    const chapter = formData.get("chapter")?.toString();
    const files = formData.getAll("files") as File[];

    if (!slug || !chapter || files.length === 0) {
      return NextResponse.json(
        { message: "slug, chapter & files required" },
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

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "komify",
      slug,
      "chapters",
      chapter
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    const pages = Array.isArray(chapterData.pages) ? chapterData.pages : [];

    let maxOrder = pages.reduce(
      (max: number, p: any) =>
        typeof p.order === "number" && p.order > max ? p.order : max,
      0
    );

    let counter = pages.length;

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const filename = `page${++counter}${ext}`;

      fs.writeFileSync(path.join(uploadDir, filename), buffer);

      pages.push({
        id: crypto.randomUUID(),
        filename,
        order: ++maxOrder,
      });
    }

    chapterData.pages = pages;
    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Pages added" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Add pages failed", error: err.message },
      { status: 500 }
    );
  }
}
