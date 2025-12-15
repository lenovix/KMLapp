import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const slug = formData.get("slug")?.toString();
    const chapter = formData.get("chapter")?.toString();
    const title = formData.get("title")?.toString();
    const language = formData.get("language")?.toString();
    const order = formData.get("order")?.toString();

    if (!slug || !chapter) {
      return NextResponse.json(
        { message: "slug & chapter required" },
        { status: 400 }
      );
    }

    /* === LOAD comics.json === */
    const comicsPath = path.join(process.cwd(), "data/komify", "comics.json");
    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));

    const comicIdx = comics.findIndex(
      (c: any) => String(c.slug) === String(slug)
    );
    if (comicIdx === -1)
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });

    const chapterIdx = comics[comicIdx].chapters.findIndex(
      (c: any) => String(c.number) === String(chapter)
    );
    if (chapterIdx === -1)
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );

    /* === UPDATE METADATA === */
    comics[comicIdx].chapters[chapterIdx] = {
      ...comics[comicIdx].chapters[chapterIdx],
      title,
      language,
      uploadChapter: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
        .replace("T", " "),
    };

    /* === UPLOAD FILES === */
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "komify",
      slug,
      "chapters",
      chapter
    );
    fs.mkdirSync(uploadDir, { recursive: true });

    const files = formData.getAll("files") as File[];
    const existingPages = comics[comicIdx].chapters[chapterIdx].pages || [];

    let pageIndex = existingPages.length;

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name || ".jpg");
      const filename = `page${++pageIndex}${ext}`;

      fs.writeFileSync(path.join(uploadDir, filename), buffer);

      existingPages.push({
        id: `${Date.now()}_${Math.random()}`,
        filename,
      });
    }

    /* === ORDER HANDLING === */
    if (order) {
      try {
        const orderArr: string[] = JSON.parse(order);
        comics[comicIdx].chapters[chapterIdx].pages = orderArr
          .map((name) => existingPages.find((p: any) => p.filename === name))
          .filter(Boolean);
      } catch {
        return NextResponse.json(
          { message: "Invalid order format" },
          { status: 400 }
        );
      }
    } else {
      comics[comicIdx].chapters[chapterIdx].pages = existingPages;
    }

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Chapter updated" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Upload failed", error: err.message },
      { status: 500 }
    );
  }
}
