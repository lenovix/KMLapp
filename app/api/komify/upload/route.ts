import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Utility: convert File → Buffer
async function fileToBuffer(file: any): Promise<Buffer | null> {
  if (!file) return null;

  // CASE 1 — Web File (browser)
  if (typeof file.arrayBuffer === "function") {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // CASE 2 — formidable or custom upload
  if (file.filepath && fs.existsSync(file.filepath)) {
    return fs.readFileSync(file.filepath);
  }

  console.warn("unknown file format:", file);
  return null;
}

// Utility helpers
const uniqueArray = (arr: string[]) => [
  ...new Set(arr.map((v) => v.trim()).filter(Boolean)),
];

const toArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(toArray);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
};

const getString = (v: any) => (Array.isArray(v) ? v[0] : v ?? "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Base path: /public/komify/[slug]
    const uploadDir = path.join(process.cwd(), "public", "komify");
    const slug = formData.get("slug")?.toString() || "unknown";
    const slugPath = path.join(uploadDir, slug);

    fs.mkdirSync(slugPath, { recursive: true });

    // =========================================================
    // ===================== UPLOAD COVER =======================
    // =========================================================
    const coverFile = formData.get("cover") as File | null;
    const coverBuffer = await fileToBuffer(coverFile);

    if (coverBuffer) {
      const coverPath = path.join(slugPath, "cover.jpg");
      fs.writeFileSync(coverPath, coverBuffer);
    } else {
      console.warn("⚠ Tidak ada cover file yang diterima.");
    }

    // =========================================================
    // =================== CHAPTERS UPLOAD ======================
    // =========================================================
    const chaptersStr = formData.get("chapters")?.toString() || "[]";
    const chapters = JSON.parse(chaptersStr);

    const chaptersWithPages = [];

    for (const ch of chapters) {
      const chapterDir = path.join(slugPath, "chapters", ch.number);
      fs.mkdirSync(chapterDir, { recursive: true });

      const fieldKey = `chapter-${ch.number}`; // sesuai FormData
      const uploadedFiles = formData.getAll(fieldKey) as File[];

      const pages = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const buffer = await fileToBuffer(uploadedFiles[i]);
        if (!buffer) continue;

        const filename = `page${i + 1}.jpg`;
        const filePath = path.join(chapterDir, filename);

        fs.writeFileSync(filePath, buffer);

        pages.push({
          id: `${Date.now()}_${i}`,
          filename,
        });
      }

      chaptersWithPages.push({
        ...ch,
        pages,
      });
    }

    // =========================================================
    // ================= SAVE METADATA JSON =====================
    // =========================================================
    const comicsPath = path.join(process.cwd(), "data/komify", "comics.json");
    fs.mkdirSync(path.dirname(comicsPath), { recursive: true });

    let comics: any[] = [];
    if (fs.existsSync(comicsPath)) {
      comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
    }

    const newComic = {
      slug: Number(slug),
      title: getString(formData.get("title")),
      parodies: uniqueArray(toArray(formData.get("parodies"))),
      characters: uniqueArray(toArray(formData.get("characters"))),
      artists: uniqueArray(toArray(formData.get("artist"))),
      groups: uniqueArray(toArray(formData.get("groups"))),
      categories: uniqueArray(toArray(formData.get("categories"))),
      author: uniqueArray(toArray(formData.get("author"))),
      tags: uniqueArray(toArray(formData.get("tags"))),
      status: getString(formData.get("status")),
      uploaded: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
        .replace("T", " "),
      cover: `/komify/${slug}/cover.jpg`,
      chapters: chaptersWithPages.map((ch) => ({
        number: ch.number,
        title: ch.title,
        language: ch.language,
        uploadChapter: new Date()
          .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
          .replace("T", " "),
        pages: ch.pages,
      })),
    };

    const index = comics.findIndex((c) => c.slug === Number(slug));
    if (index !== -1) comics[index] = newComic;
    else comics.push(newComic);

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Upload successful" });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { message: "Upload failed", error: err.toString() },
      { status: 500 }
    );
  }
}
