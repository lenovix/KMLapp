import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const comicsPath = path.join(process.cwd(), "data/komify/comics.json");

    if (!fs.existsSync(comicsPath)) {
      return NextResponse.json(
        { bookmarked: false, rating: 0 },
        { status: 404 }
      );
    }

    const comics = JSON.parse(fs.readFileSync(comicsPath, "utf-8"));

    const comic = comics.find((c: any) => String(c.slug) === String(slug));

    if (!comic) {
      return NextResponse.json(
        { bookmarked: false, rating: 0 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bookmarked: Boolean(comic.bookmark),
      rating: Number(comic.rating) || 0,
    });
  } catch (error) {
    console.error("USER-DATA API ERROR:", error);
    return NextResponse.json(
      {
        bookmarked: false,
        rating: 0,
      },
      { status: 500 }
    );
  }
}
