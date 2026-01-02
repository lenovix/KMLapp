import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "filmfy", "films.json");

  try {
    const file = fs.readFileSync(filePath, "utf-8");
    const films = JSON.parse(file);

    return NextResponse.json(films);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load films" },
      { status: 500 }
    );
  }
}
