import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILMS_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export async function POST(req: Request) {
  const { filmId, rating } = await req.json();

  if (!filmId || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!fs.existsSync(FILMS_FILE)) {
    return NextResponse.json({ error: "Database not found" }, { status: 404 });
  }

  const films = JSON.parse(fs.readFileSync(FILMS_FILE, "utf-8"));
  const index = films.findIndex((f: any) => f.id === Number(filmId));

  if (index === -1) {
    return NextResponse.json({ error: "Film not found" }, { status: 404 });
  }

  films[index].rating = rating;

  fs.writeFileSync(FILMS_FILE, JSON.stringify(films, null, 2));

  return NextResponse.json({ success: true, rating });
}
