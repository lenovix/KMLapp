import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const code = formData.get("code") as string;
    const croppedBlob = formData.get("croppedImage") as File;

    if (!code || !croppedBlob) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const filmDir = path.join(process.cwd(), "public", "filmfy", "movie", code);
    const originalPath = path.join(filmDir, "cover_original.jpg");
    const coverPath = path.join(filmDir, "cover.jpg");

    if (!fs.existsSync(filmDir)) {
      return NextResponse.json({ message: "Directory not found" }, { status: 404 });
    }

    if (!fs.existsSync(originalPath)) {
      if (fs.existsSync(coverPath)) {
        fs.copyFileSync(coverPath, originalPath);
      } else {
        return NextResponse.json({ message: "Source image not found" }, { status: 400 });
      }
    }

    const buffer = Buffer.from(await croppedBlob.arrayBuffer());
    fs.writeFileSync(coverPath, buffer);

    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      let films = JSON.parse(fileData || "[]");
      const filmIndex = films.findIndex((f: any) => f.code === code);

      if (filmIndex !== -1) {
        films[filmIndex].createdAt = new Date().toISOString();
        fs.writeFileSync(DATA_FILE, JSON.stringify(films, null, 2));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Re-crop Error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}