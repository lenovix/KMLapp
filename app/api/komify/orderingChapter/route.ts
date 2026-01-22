import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "komify", "comics.json");

export async function POST(req: Request) {
  try {
    const { slug, chapters } = await req.json();

    if (!slug || !Array.isArray(chapters)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const comics = JSON.parse(raw);
    const comicIndex = comics.findIndex((c: any) => c.slug === Number(slug));

    if (comicIndex === -1) {
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });
    }

    const chaptersBaseDir = path.join(
      process.cwd(),
      "public",
      "komify",
      String(slug),
      "chapters"
    );

    for (const ch of chapters) {
      const oldPath = path.join(chaptersBaseDir, ch.number);
      const tempPath = path.join(chaptersBaseDir, `${ch.number}_temp`);

      try {
        await fs.access(oldPath);
        await fs.rename(oldPath, tempPath);
      } catch (e) {
        console.log(
          `Folder ${ch.number} tidak ditemukan, skip rename ke temp.`
        );
      }
    }

    const updatedChapters = chapters.map((ch: any, index: number) => {
      const oldNumber = ch.number;
      const newNumber = String(index + 1).padStart(3, "0");

      return {
        ...ch,
        oldNumber,
        number: newNumber,
      };
    });

    for (const ch of updatedChapters) {
      const tempPath = path.join(chaptersBaseDir, `${ch.oldNumber}_temp`);
      const newPath = path.join(chaptersBaseDir, ch.number);

      try {
        await fs.access(tempPath);
        await fs.rename(tempPath, newPath);
      } catch (e) {
        console.log(`Folder temp untuk ${ch.oldNumber} tidak ditemukan.`);
      }

      delete ch.oldNumber;
    }

    comics[comicIndex].chapters = updatedChapters;
    await fs.writeFile(DATA_PATH, JSON.stringify(comics, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to save order and move folders" },
      { status: 500 }
    );
  }
}
