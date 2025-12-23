import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const comicsDir = path.join(process.cwd(), "public", "komify");
    const comicsJson = path.join(process.cwd(), "data/komify", "comics.json");

    await fs.rm(comicsDir, { recursive: true, force: true });

    await fs.mkdir(comicsDir, { recursive: true });

    await fs.writeFile(comicsJson, "[]", "utf-8");

    return NextResponse.json({
      message: "Semua komik dan data berhasil dihapus.",
    });
  } catch (err) {
    console.error("Delete comics error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus komik." },
      { status: 500 }
    );
  }
}
