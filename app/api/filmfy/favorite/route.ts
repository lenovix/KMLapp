import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILMS_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export async function POST(req: Request) {
  const { filmId } = await req.json();

  if (!filmId) {
    return NextResponse.json({ error: "filmId required" }, { status: 400 });
  }

  if (!fs.existsSync(FILMS_FILE)) {
    return NextResponse.json({ error: "Database not found" }, { status: 404 });
  }

  const films = JSON.parse(fs.readFileSync(FILMS_FILE, "utf-8"));
  const index = films.findIndex((f: any) => f.id === Number(filmId));

  if (index === -1) {
    return NextResponse.json({ error: "Film not found" }, { status: 404 });
  }

  const currentStatus = films[index].isFavorite || false;
  films[index].isFavorite = !currentStatus;

  if (films[index].isFavorite) {
    films[index].favoriteAddedAt = new Date().toISOString();
  } else {
    delete films[index].favoriteAddedAt;
  }

  fs.writeFileSync(FILMS_FILE, JSON.stringify(films, null, 2));

  return NextResponse.json({
    success: true,
    isFavorite: films[index].isFavorite,
  });
}
