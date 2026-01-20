import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "filmfy", "user-actions.json");

function readData() {
  if (!fs.existsSync(FILE)) {
    return { favorites: [], ratings: {} };
  }
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeData(data: any) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  const { filmId, rating } = await req.json();

  if (!filmId || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = readData();
  data.ratings[String(filmId)] = rating;

  writeData(data);

  return NextResponse.json({ success: true, rating });
}
