import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

async function fileToBuffer(file: any): Promise<Buffer | null> {
  if (!file) return null;

  if (typeof file.arrayBuffer === "function") {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  if (file.filepath && fs.existsSync(file.filepath)) {
    return fs.readFileSync(file.filepath);
  }

  console.warn("unknown file format:", file);
  return null;
}

const normalizeArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [String(value)];
};

const insertOrGetId = (table: string, name: string): number => {
  db.prepare(`INSERT OR IGNORE INTO ${table} (name) VALUES (?)`).run(name);
  const row = db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(name) as
    | { id: number }
    | undefined;

  if (!row) throw new Error(`Failed to get id from ${table}: ${name}`);

  return row.id;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const slug = formData.get("slug")!.toString();

    const uploadDir = path.join(process.cwd(), "public", "komify", slug);
    fs.mkdirSync(uploadDir, { recursive: true });

    const coverFile = formData.get("cover") as File | null;
    const coverBuffer = await fileToBuffer(coverFile);

    if (coverBuffer) {
      fs.writeFileSync(path.join(uploadDir, "cover.jpg"), coverBuffer);
    }

    const chapters = JSON.parse(formData.get("chapters")?.toString() || "[]");

    const chaptersWithPages: any[] = [];

    for (const ch of chapters) {
      const chapterDir = path.join(uploadDir, "chapters", ch.number);
      fs.mkdirSync(chapterDir, { recursive: true });

      const files = formData.getAll(`chapter-${ch.number}`) as File[];
      const pages = [];

      for (let i = 0; i < files.length; i++) {
        const buf = await fileToBuffer(files[i]);
        if (!buf) continue;

        const filename = `page${i + 1}.jpg`;
        fs.writeFileSync(path.join(chapterDir, filename), buf);

        pages.push({ filename });
      }

      chaptersWithPages.push({ ...ch, pages });
    }

    db.transaction(() => {
      db.prepare(
        `
    INSERT OR IGNORE INTO comics
    (slug, title, category, status, uploaded_at, cover, rating, bookmark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
      ).run(
        slug,
        formData.get("title"),
        formData.get("categories"),
        formData.get("status"),
        new Date().toISOString(),
        `/komify/${slug}/cover.jpg`,
        Number(formData.get("rating") ?? 0),
        formData.get("bookmarked") === "true" ? 1 : 0
      );

      const comicRow = db
        .prepare(`SELECT id FROM comics WHERE slug = ?`)
        .get(slug) as { id: number } | undefined;

      if (!comicRow) {
        throw new Error(`Comic with slug ${slug} not found`);
      }

      const comicId = comicRow.id;

      [
        "comic_tags",
        "comic_artists",
        "comic_groups",
        "comic_authors",
        "comic_parodies",
        "comic_characters",
      ].forEach((t) =>
        db.prepare(`DELETE FROM ${t} WHERE comic_id = ?`).run(comicId)
      );

      normalizeArray(formData.get("tags")).forEach((v) =>
        db
          .prepare(`INSERT INTO comic_tags VALUES (?, ?)`)
          .run(comicId, insertOrGetId("tags", v))
      );

      normalizeArray(formData.get("groups")).forEach((v) =>
        db
          .prepare(`INSERT INTO comic_groups VALUES (?, ?)`)
          .run(comicId, insertOrGetId("groups", v))
      );

      db.prepare(`DELETE FROM chapters WHERE comic_id = ?`).run(comicId);

      for (const ch of chaptersWithPages) {
        const res = db
          .prepare(
            `
      INSERT INTO chapters
      (comic_id, number, title, language, censored, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
          )
          .run(
            comicId,
            ch.number,
            ch.title,
            ch.language,
            ch.cencored,
            new Date().toISOString()
          );

        ch.pages.forEach((p: any, i: number) =>
          db
            .prepare(
              `
        INSERT INTO pages (chapter_id, page_order, filename)
        VALUES (?, ?, ?)
      `
            )
            .run(res.lastInsertRowid, i + 1, p.filename)
        );
      }
    })();

    return NextResponse.json({ message: "Upload successful (SQLite)" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Upload failed", error: err.toString() },
      { status: 500 }
    );
  }
}
