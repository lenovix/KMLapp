import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const comicsDir = path.join(process.cwd(), "public", "komify");
    const comicsJson = path.join(process.cwd(), "data/komify", "comics.json");

    // Hapus folder public/comics
    await fs.rm(comicsDir, { recursive: true, force: true });

    // Buat ulang folder kosong
    await fs.mkdir(comicsDir, { recursive: true });

    // Kosongkan data comics.json
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
