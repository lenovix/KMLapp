import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

interface Page {
  id: string;
  filename: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const slug = formData.get("slug")?.toString();
    const chapter = formData.get("chapter")?.toString();
    const title = formData.get("title")?.toString();
    const language = formData.get("language")?.toString();
    const orderRaw = formData.get("order")?.toString();

    if (!slug || !chapter) {
      return NextResponse.json(
        { message: "slug & chapter required" },
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

    chapterData.title = title;
    chapterData.language = language;
    chapterData.uploadChapter = new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .replace("T", " ");

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "komify",
      slug,
      "chapters",
      chapter
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    let pages: Page[] = Array.isArray(chapterData.pages)
      ? [...chapterData.pages]
      : [];

    const files = formData.getAll("files") as File[];
    let counter = pages.length;

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name || ".jpg");
      const filename = `page${++counter}${ext}`;

      fs.writeFileSync(path.join(uploadDir, filename), buffer);

      pages.push({
        id: crypto.randomUUID(),
        filename,
      });
    }

    if (orderRaw) {
      const orderIds: string[] = JSON.parse(orderRaw);
      const orderSet = new Set(orderIds);

      const orderedPages = orderIds
        .map((id) => pages.find((p) => p.id === id))
        .filter(Boolean) as Page[];

      const newPages = pages.filter((p) => !orderSet.has(p.id));

      pages = [...orderedPages, ...newPages];
    }

    chapterData.pages = pages;

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Chapter updated successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Edit chapter failed", error: err.message },
      { status: 500 }
    );
  }
}
