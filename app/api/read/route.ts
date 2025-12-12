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

  const dir = path.join(
    process.cwd(),
    "public",
    "komify",
    String(slug),
    "chapters",
    String(chapter)
  );

  try {
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ pages: [] });
    }

    const files = fs
      .readdirSync(dir)
      .filter((f) => /^page\d+\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => {
        // Sort by page number
        const na = parseInt(a.replace(/\D/g, ""));
        const nb = parseInt(b.replace(/\D/g, ""));
        return na - nb;
      });

    return NextResponse.json({ pages: files });
  } catch (err) {
    console.error("Failed to read chapter directory", err);
    return NextResponse.json({ pages: [] });
  }
}
