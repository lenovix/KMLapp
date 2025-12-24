import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const slugRaw = formData.get("slug");
    const chapterNumber = formData.get("number");
    const title = formData.get("title");
    const language = formData.get("language");
    const cencored = formData.get("cencored");
    const pageFiles = formData.getAll("pages") as File[];

    if (!slugRaw || !chapterNumber) {
      return NextResponse.json(
        { message: "slug & number required" },
        { status: 400 }
      );
    }

    const slug = Number(slugRaw);
    if (Number.isNaN(slug)) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
    }

    const comicsPath = path.join(
      process.cwd(),
      "data",
      "komify",
      "comics.json"
    );

    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
    const idx = comics.findIndex((c: any) => Number(c.slug) === slug);

    if (idx === -1) {
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });
    }

    if (!Array.isArray(comics[idx].chapters)) {
      comics[idx].chapters = [];
    }

    const chapterDir = path.join(
      process.cwd(),
      "public",
      "komify",
      String(slug),
      "chapters",
      String(chapterNumber)
    );
    fs.mkdirSync(chapterDir, { recursive: true });

    const pages = [];

    for (let i = 0; i < pageFiles.length; i++) {
      const file = pageFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const filename = `page${i + 1}${ext}`;

      fs.writeFileSync(path.join(chapterDir, filename), buffer);

      pages.push({
        id: crypto.randomUUID(),
        filename,
        order: i + 1,
      });
    }

    comics[idx].chapters.push({
      number: String(chapterNumber),
      title: String(title ?? ""),
      language: String(language ?? ""),
      cencored: String(cencored ?? ""),
      uploadChapter: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
        .replace("T", " "),
      pages,
    });

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Chapter added" });
  } catch (err) {
    console.error("ADD_CHAPTER_ERROR:", err);
    return NextResponse.json(
      { message: "Failed to add chapter" },
      { status: 500 }
    );
  }
}
