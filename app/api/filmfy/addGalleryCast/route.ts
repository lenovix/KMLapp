import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CASTS_FILE = path.join(process.cwd(), "data", "filmfy", "casts.json");
const PUBLIC_CAST_DIR = path.join(process.cwd(), "public", "filmfy", "casts");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const slug = formData.get("slug") as string;
    const file = formData.get("file") as File;

    if (!slug || !file) {
      return NextResponse.json(
        { error: "slug dan file wajib" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const galleryDir = path.join(PUBLIC_CAST_DIR, slug, "gallery");
    fs.mkdirSync(galleryDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(galleryDir, filename);

    fs.writeFileSync(filePath, buffer);

    const casts = JSON.parse(fs.readFileSync(CASTS_FILE, "utf-8"));
    const castIndex = casts.findIndex((c: any) => c.slug === slug);

    if (castIndex === -1) {
      return NextResponse.json(
        { error: "Cast tidak ditemukan" },
        { status: 404 }
      );
    }

    const gallery = casts[castIndex].gallery || [];

    gallery.push({
      name: filename,
      order: gallery.length + 1,
      addImageDate: new Date().toISOString(),
    });

    casts[castIndex].gallery = gallery;

    fs.writeFileSync(CASTS_FILE, JSON.stringify(casts, null, 2));

    return NextResponse.json({
      success: true,
      image: `/filmfy/casts/${slug}/gallery/${filename}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal upload gallery" },
      { status: 500 }
    );
  }
}
