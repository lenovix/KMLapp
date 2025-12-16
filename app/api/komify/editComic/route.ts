import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/* ================== SHARED UTIL ================== */
type NormalizedField = string | string[] | null;

const normalizeField = (value: any): NormalizedField => {
  if (!value) return null;

  let arr: string[] = [];

  if (Array.isArray(value)) {
    arr = value
      .flatMap((v) => String(v).split(","))
      .map((v) => v.trim())
      .filter(Boolean);
  } else if (typeof value === "string") {
    arr = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  arr = [...new Set(arr)];

  if (arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  return arr;
};

const getString = (v: any) => (Array.isArray(v) ? v[0] : v ?? "");

/* ================================================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const slugRaw = formData.get("slug");
    if (!slugRaw) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const slug = Number(slugRaw);

    const comicsPath = path.join(
      process.cwd(),
      "data",
      "komify",
      "comics.json"
    );

    if (!fs.existsSync(comicsPath)) {
      return NextResponse.json(
        { message: "Comics data not found" },
        { status: 404 }
      );
    }

    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));

    const idx = comics.findIndex((c: any) => Number(c.slug) === slug);
    if (idx === -1) {
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });
    }

    /* ================= UPDATE METADATA ================= */
    comics[idx] = {
      ...comics[idx],

      slug,
      title: getString(formData.get("title")),
      parodies: normalizeField(formData.get("parodies")),
      characters: normalizeField(formData.get("characters")),
      artists: normalizeField(formData.get("artists")),
      groups: normalizeField(formData.get("groups")),
      categories: normalizeField(formData.get("categories")),
      author: normalizeField(formData.get("author")),
      tags: normalizeField(formData.get("tags")),
      status: getString(formData.get("status")),

      uploaded: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
        .replace("T", " "),
    };

    /* ================= HANDLE COVER ================= */
    const coverFile = formData.get("cover") as File | null;

    if (coverFile && coverFile.size > 0) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());

      const coverDir = path.join(
        process.cwd(),
        "public",
        "komify",
        String(slug)
      );

      fs.mkdirSync(coverDir, { recursive: true });

      const coverPath = path.join(coverDir, "cover.jpg");
      fs.writeFileSync(coverPath, buffer);

      comics[idx].cover = `/komify/${slug}/cover.jpg`;
    }

    /* ================= SAVE ================= */
    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Comic updated successfully" });
  } catch (error) {
    console.error("Edit comic error:", error);
    return NextResponse.json(
      { message: "Failed to update comic" },
      { status: 500 }
    );
  }
}
