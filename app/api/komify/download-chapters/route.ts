import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function POST(req: NextRequest) {
  try {
    const { slug, chapters } = await req.json();

    if (!slug || !Array.isArray(chapters) || chapters.length === 0) {
      return new Response("Invalid request", { status: 400 });
    }

    const root = process.cwd();
    const comicsPath = path.join(root, "data/komify/comics.json");
    const comicDir = path.join(root, "public/komify", String(slug));
    const chaptersRoot = path.join(comicDir, "chapters");

    if (!fs.existsSync(comicsPath)) {
      return new Response("Metadata not found", { status: 404 });
    }

    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
    const comic = comics.find((c: any) => String(c.slug) === String(slug));

    if (!comic) {
      return new Response("Comic not found", { status: 404 });
    }

    const validChapters = chapters.filter((ch: string) =>
      comic.chapters.some((c: any) => c.number === ch)
    );

    if (validChapters.length === 0) {
      return new Response("No valid chapters selected", { status: 400 });
    }

    const date = new Date().toISOString().split("T")[0];
    const zipName = `${date}_${slug}_chapters.zip`;

    const stream = new ReadableStream({
      start(controller) {
        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.on("data", (chunk) => controller.enqueue(chunk));
        archive.on("end", () => controller.close());
        archive.on("error", (err) => controller.error(err));

        const filteredComic = {
          ...comic,
          chapters: comic.chapters.filter((c: any) =>
            validChapters.includes(c.number)
          ),
        };

        archive.append(JSON.stringify(filteredComic, null, 2), {
          name: "metadata.json",
        });

        validChapters.forEach((chapterNumber: string) => {
          const chapterPath = path.join(chaptersRoot, chapterNumber);

          if (fs.existsSync(chapterPath)) {
            archive.directory(chapterPath, `chapters/${chapterNumber}`);
          }
        });

        archive.finalize();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipName}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
