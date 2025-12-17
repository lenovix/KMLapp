import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const tmpPath = path.join(process.cwd(), "public", "tmp_upload");

    // Hapus folder cache
    await fs.rm(tmpPath, { recursive: true, force: true });

    // Buat ulang folder kosong
    await fs.mkdir(tmpPath, { recursive: true });

    return NextResponse.json({
      message: "Cache berhasil dibersihkan.",
    });
  } catch (err) {
    console.error("Clear cache error:", err);
    return NextResponse.json(
      { error: "Gagal membersihkan cache." },
      { status: 500 }
    );
  }
}
