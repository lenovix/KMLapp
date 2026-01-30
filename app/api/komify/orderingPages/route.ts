import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "komify", "comics.json");

const formatPages = (pages: any[], slug: string, chapter: string) => {
  return (pages || []).map((p: any) => ({
    ...p,
    fullUrl: `/komify/${slug}/chapters/${chapter}/${p.filename}`,
  }));
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const chapter = searchParams.get("chapter");

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const comics = JSON.parse(raw);
    const comic = comics.find((c: any) => String(c.slug) === String(slug));
    const chData = comic?.chapters?.find(
      (ch: any) => String(ch.number) === String(chapter)
    );

    if (!chData)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({
      ...chData,
      pages: formatPages(chData.pages, String(slug), String(chapter)),
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { slug, chapterNumber, pages } = await req.json();

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const comics = JSON.parse(raw);

    const comicIndex = comics.findIndex(
      (c: any) => String(c.slug) === String(slug)
    );
    const chapterIndex = comics[comicIndex].chapters.findIndex(
      (ch: any) => String(ch.number) === String(chapterNumber)
    );

    const updatedPages = pages.map((p: any, index: number) => {
      const { fullUrl, ...rest } = p;
      return {
        ...rest,
        order: index + 1,
      };
    });

    comics[comicIndex].chapters[chapterIndex].pages = updatedPages;
    comics[comicIndex].chapters[chapterIndex].updatedAt =
      new Date().toISOString();

    await fs.writeFile(DATA_PATH, JSON.stringify(comics, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const chapter = formData.get("chapter") as string;
    const newFiles = formData.getAll("new_pages") as File[];

    if (!slug || !chapter || newFiles.length === 0) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const chapterDir = path.join(
      process.cwd(),
      "public",
      "komify",
      slug,
      "chapters",
      chapter
    );
    await fs.mkdir(chapterDir, { recursive: true });

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    let comics = JSON.parse(raw);

    const comicIndex = comics.findIndex(
      (c: any) => String(c.slug) === String(slug)
    );
    if (comicIndex === -1)
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });

    const chIndex = comics[comicIndex].chapters.findIndex(
      (ch: any) => String(ch.number) === String(chapter)
    );
    if (chIndex === -1)
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );

    const currentPages = comics[comicIndex].chapters[chIndex].pages || [];
    const newPagesData = [];

    const batchTimestamp = Date.now();

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      const uniqueId = `${batchTimestamp}-${i}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;

      const fileExtension = path.extname(file.name);
      const safeName = `page-${uniqueId}${fileExtension}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(chapterDir, safeName), buffer);

      newPagesData.push({
        id: `pg-${uniqueId}`,
        filename: safeName,
        order: currentPages.length + i + 1,
      });
    }

    const updatedPages = [...currentPages, ...newPagesData];
    comics[comicIndex].chapters[chIndex].pages = updatedPages;
    comics[comicIndex].chapters[chIndex].updatedAt = new Date().toISOString();

    await fs.writeFile(DATA_PATH, JSON.stringify(comics, null, 2));

    return NextResponse.json({
      success: true,
      pages: formatPages(updatedPages, slug, chapter),
    });
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const chapter = searchParams.get("chapter");
    const filename = searchParams.get("filename");
    const deleteAll = searchParams.get("all") === "true";

    if (!slug || !chapter)
      return NextResponse.json({ message: "Missing params" }, { status: 400 });

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const comics = JSON.parse(raw);
    const comicIndex = comics.findIndex(
      (c: any) => String(c.slug) === String(slug)
    );
    const chIndex = comics[comicIndex].chapters.findIndex(
      (ch: any) => String(ch.number) === String(chapter)
    );

    const chapterDir = path.join(
      process.cwd(),
      "public",
      "komify",
      String(slug),
      "chapters",
      String(chapter)
    );

    if (deleteAll) {
      comics[comicIndex].chapters[chIndex].pages = [];
      try {
        await fs.rm(chapterDir, { recursive: true, force: true });
        await fs.mkdir(chapterDir, { recursive: true });
      } catch (e) {}
    } else if (filename) {
      comics[comicIndex].chapters[chIndex].pages = comics[comicIndex].chapters[
        chIndex
      ].pages.filter((p: any) => p.filename !== filename);
      try {
        await fs.unlink(path.join(chapterDir, filename));
      } catch (e) {}
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(comics, null, 2));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
