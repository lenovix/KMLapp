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

    // 🔥 Replace chapters order
    comics[comicIndex].chapters = chapters;

    await fs.writeFile(DATA_PATH, JSON.stringify(comics, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to save order" },
      { status: 500 }
    );
  }
}
