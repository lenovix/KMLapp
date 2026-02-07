import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "assetfy", "assets.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileData = fs.readFileSync(filePath, "utf-8");
    const assets = JSON.parse(fileData);

    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil data", error },
      { status: 500 },
    );
  }
}
