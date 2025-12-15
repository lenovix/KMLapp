import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const slug = formData.get("slug") as string | null;
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const comicsPath = path.join(
      process.cwd(),
      "data",
      "komify",
      "comics.json"
    );

    let comics: any[] = [];
    if (fs.existsSync(comicsPath)) {
      comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));
    }

    const idx = comics.findIndex((c) => Number(c.slug) === Number(slug));
    if (idx === -1) {
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });
    }

    // helper: string -> array (split koma)
    const toArray = (val: FormDataEntryValue | null): string[] => {
      if (!val) return [];
      if (typeof val !== "string") return [];
      return val
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    };

    // update data
    comics[idx] = {
      ...comics[idx],
      slug,
      title: (formData.get("title") as string) || "",
      parodies: toArray(formData.get("parodies")),
      characters: toArray(formData.get("characters")),
      artists: toArray(formData.get("artists")),
      groups: toArray(formData.get("groups")),
      categories: toArray(formData.get("categories")),
      uploaded: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
        .replace("T", " "),
      author: toArray(formData.get("author")),
      tags: toArray(formData.get("tags")),
      status: (formData.get("status") as string) || "",
      cover: comics[idx].cover,
    };

    // handle cover upload
    const coverFile = formData.get("cover") as File | null;

    if (coverFile && coverFile.size > 0) {
      const bytes = await coverFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const coverDir = path.join(process.cwd(), "public", "komify", slug);

      if (!fs.existsSync(coverDir)) {
        fs.mkdirSync(coverDir, { recursive: true });
      }

      const coverPath = path.join(coverDir, "cover.jpg");
      fs.writeFileSync(coverPath, buffer);

      comics[idx].cover = `/komify/${slug}/cover.jpg`;
    }

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Comic updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update comic" },
      { status: 500 }
    );
  }
}
