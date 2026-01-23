import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "komify", "comics.json");

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

    const formattedPages = (chData.pages || []).map((p: any) => {
      const fileName = p.filename;
      return {
        ...p,
        fullUrl: `/komify/${slug}/chapters/${chapter}/${fileName}`,
      };
    });

    return NextResponse.json({ ...chData, pages: formattedPages });
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
