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
  const { filmId } = await req.json();
  if (!filmId) {
    return NextResponse.json({ error: "filmId required" }, { status: 400 });
  }

  const data = readData();

  if (data.favorites.includes(filmId)) {
    data.favorites = data.favorites.filter((id: number) => id !== filmId);
  } else {
    data.favorites.push(filmId);
  }

  writeData(data);

  return NextResponse.json({
    success: true,
    isFavorite: data.favorites.includes(filmId),
  });
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}
