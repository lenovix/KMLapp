import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export async function GET() {
  let nextId = 1;

  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const films = JSON.parse(raw || "[]");

    if (films.length > 0) {
      const lastId = Math.max(...films.map((f: any) => f.id));
      nextId = lastId + 1;
    }
  }

  return NextResponse.json({ nextId });
}
