import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    // Path untuk comics.json
    const comicsPath = path.join(process.cwd(), "data/komify", "comics.json");

    // Baca file comics.json
    let comics: any[] = [];
    if (fs.existsSync(comicsPath)) {
      const data = fs.readFileSync(comicsPath, "utf-8");
      comics = JSON.parse(data);
    }

    // Filter komik
    const newComics = comics.filter((c) => c.slug !== Number(slug));

    // Tulis ulang file JSON
    fs.writeFileSync(comicsPath, JSON.stringify(newComics, null, 2));

    // Hapus folder fisik komik
    const comicDir = path.join(process.cwd(), "public", "komify", String(slug));

    if (fs.existsSync(comicDir)) {
      fs.rmSync(comicDir, { recursive: true, force: true });
    }

    return NextResponse.json({ message: "Comic deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete comic", error: String(error) },
      { status: 500 }
    );
  }
}
