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

  const index = data.favorites.findIndex((f: any) => f.filmId === filmId);

  if (index >= 0) {
    data.favorites.splice(index, 1);
  } else {
    data.favorites.push({
      filmId,
      addedAt: new Date().toISOString(),
    });
  }

  writeData(data);

  return NextResponse.json({
    success: true,
    isFavorite: index === -1,
  });
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}
