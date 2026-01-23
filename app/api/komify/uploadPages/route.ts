// app/api/komify/uploadPages/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const chapter = formData.get("chapter") as string;
    const images = formData.getAll("images") as File[];

    const DATA_PATH = path.join(process.cwd(), "data", "komify", "comics.json");
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const comics = JSON.parse(raw);

    const cIdx = comics.findIndex((c: any) => String(c.slug) === slug);
    const chIdx = comics[cIdx].chapters.findIndex(
      (ch: any) => String(ch.number) === chapter
    );

    const targetDir = path.join(
      process.cwd(),
      "public",
      "komify",
      slug,
      "chapters",
      chapter
    );
    await fs.mkdir(targetDir, { recursive: true });

    const newPages = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = image.name;
      await fs.writeFile(path.join(targetDir, filename), buffer);

      newPages.push({
        id: uuidv4(),
        filename: filename,
        order: comics[cIdx].chapters[chIdx].pages.length + 1,
      });
    }

    comics[cIdx].chapters[chIdx].pages.push(...newPages);
    await fs.writeFile(DATA_PATH, JSON.stringify(comics, null, 2));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
