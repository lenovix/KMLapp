import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const chapter = searchParams.get("chapter");

  if (!slug || !chapter) {
    return NextResponse.json({ pages: [] });
  }

  const chapterDir = path.join(
    process.cwd(),
    "public",
    "komify",
    String(slug),
    "chapters",
    String(chapter)
  );

  const comicsPath = path.join(process.cwd(), "data", "komify", "comics.json");

  try {
    if (!fs.existsSync(chapterDir) || !fs.existsSync(comicsPath)) {
      return NextResponse.json({ pages: [] });
    }

    /** 1️⃣ ambil daftar file fisik */
    const physicalFiles = fs
      .readdirSync(chapterDir)
      .filter((f) => /^page\d+\.(jpg|jpeg|png|webp)$/i.test(f));

    /** 2️⃣ ambil data order dari JSON */
    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
    const comic = comics.find((c: any) => String(c.slug) === String(slug));
    const chapterData = comic?.chapters?.find(
      (c: any) => String(c.number) === String(chapter)
    );

    const pagesFromJson = Array.isArray(chapterData?.pages)
      ? chapterData.pages
      : [];

    /** 3️⃣ map filename -> order */
    const orderMap = new Map(
      pagesFromJson.map((p: any) => [p.filename, p.order ?? 0])
    );

    /** 4️⃣ sort berdasarkan order */
    const sortedFiles = physicalFiles.sort((a, b) => {
      const oa = Number(orderMap.get(a) ?? 9999);
      const ob = Number(orderMap.get(b) ?? 9999);

      if (oa !== ob) return oa - ob;

      const na = Number(a.replace(/\D/g, ""));
      const nb = Number(b.replace(/\D/g, ""));
      return na - nb;
    });

    return NextResponse.json({ pages: sortedFiles });
  } catch (err) {
    console.error("Failed to read chapter directory", err);
    return NextResponse.json({ pages: [] });
  }
}
