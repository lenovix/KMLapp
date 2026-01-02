import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { slug, filename } = await req.json();

    if (!slug || !filename) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const dataPath = path.join(process.cwd(), "data", "filmfy", "casts.json");

    const casts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const castIndex = casts.findIndex((c: any) => c.slug === slug);

    if (castIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Cast not found" },
        { status: 404 }
      );
    }

    casts[castIndex].gallery = casts[castIndex].gallery
      .filter((g: any) => g.name !== filename)
      .map((g: any, i: number) => ({
        ...g,
        order: i + 1,
      }));

    fs.writeFileSync(dataPath, JSON.stringify(casts, null, 2));

    const imagePath = path.join(
      process.cwd(),
      "public",
      "filmfy",
      "casts",
      slug,
      "gallery",
      filename
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
