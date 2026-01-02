import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILMS_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const MOVIE_DIR = path.join(process.cwd(), "public", "filmfy", "movie");

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID film wajib" }, { status: 400 });
    }

    if (!fs.existsSync(FILMS_FILE)) {
      return NextResponse.json(
        { error: "File film tidak ditemukan" },
        { status: 404 }
      );
    }

    const films = JSON.parse(fs.readFileSync(FILMS_FILE, "utf-8"));
    const index = films.findIndex((f: any) => f.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Film tidak ditemukan" },
        { status: 404 }
      );
    }

    const film = films[index];

    const moviePath = path.join(MOVIE_DIR, film.code);
    if (fs.existsSync(moviePath)) {
      fs.rmSync(moviePath, { recursive: true, force: true });
    }

    films.splice(index, 1);
    fs.writeFileSync(FILMS_FILE, JSON.stringify(films, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal menghapus film" },
      { status: 500 }
    );
  }
}
