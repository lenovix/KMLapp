import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Slug is required", { status: 400 });
  }

  const root = process.cwd();

  const comicsPath = path.join(root, "data/komify/comics.json");
  const comicDir = path.join(root, "public/komify", slug);
  const chaptersDir = path.join(comicDir, "chapters");

  if (!fs.existsSync(comicsPath)) {
    return new Response("Metadata not found", { status: 404 });
  }

  const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
  const comic = comics.find((c: any) => String(c.slug) === slug);

  if (!comic) {
    return new Response("Comic not found", { status: 404 });
  }

  const coverFile = fs
    .readdirSync(comicDir)
    .find((f) => f.startsWith("cover."));

  if (!coverFile) {
    return new Response("Cover not found", { status: 404 });
  }

  const coverPath = path.join(comicDir, coverFile);

  const date = new Date().toISOString().split("T")[0];
  const zipName = `${date}_${slug}_batch.zip`;

  const stream = new ReadableStream({
    start(controller) {
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.on("data", (chunk) => controller.enqueue(chunk));
      archive.on("end", () => controller.close());
      archive.on("error", (err) => controller.error(err));

      archive.append(JSON.stringify(comic, null, 2), {
        name: "metadata.json",
      });

      archive.file(coverPath, {
        name: coverFile,
      });

      if (fs.existsSync(chaptersDir)) {
        const chapterFolders = fs.readdirSync(chaptersDir);

        chapterFolders.forEach((chapter) => {
          const chapterPath = path.join(chaptersDir, chapter);

          if (fs.statSync(chapterPath).isDirectory()) {
            archive.directory(chapterPath, `chapters/${chapter}`);
          }
        });
      }

      archive.finalize();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${zipName}"`,
    },
  });
}
