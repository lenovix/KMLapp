import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "filmfy");
const FILE = path.join(DATA_DIR, "films.json");
const MOVIE_DIR = path.join(process.cwd(), "public", "filmfy", "movie");

const getString = (v: any) => (typeof v === "string" ? v.trim() : "");

const getArray = (v: any) =>
  typeof v === "string"
    ? [
        ...new Set(
          v
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        ),
      ]
    : [];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get("id"));

    if (!id) {
      return NextResponse.json({ message: "Invalid film id" }, { status: 400 });
    }

    if (!fs.existsSync(FILE)) {
      return NextResponse.json(
        { message: "Film data not found" },
        { status: 500 }
      );
    }

    const films = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    const index = films.findIndex((f: any) => f.id === id);

    if (index === -1) {
      return NextResponse.json({ message: "Film not found" }, { status: 404 });
    }

    const film = films[index];

    const newCode = getString(formData.get("code"));
    const newTitle = getString(formData.get("title"));

    if (!newCode || !newTitle) {
      return NextResponse.json(
        { message: "Code dan title wajib diisi" },
        { status: 400 }
      );
    }

    const duplicate = films.find((f: any) => f.code === newCode && f.id !== id);
    if (duplicate) {
      return NextResponse.json(
        { message: "Code film sudah digunakan" },
        { status: 409 }
      );
    }

    const oldCode = film.code;

    film.code = newCode;
    film.title = newTitle;
    film.releaseDate = getString(formData.get("releaseDate"));
    film.director = getString(formData.get("director"));
    film.maker = getString(formData.get("maker"));
    film.label = getString(formData.get("label"));
    film.series = getString(formData.get("series")) || null;
    film.cencored = getString(formData.get("cencored")) || "Uncensored";

    film.genre = getArray(formData.get("genre"));
    film.cast = getArray(formData.get("cast"));

    const isDeleted = getString(formData.get("isDeleted"));
    film.isDeleted = isDeleted === "yes";

    const cover = formData.get("cover") as File | null;

    const movieDir = path.join(MOVIE_DIR, newCode);
    fs.mkdirSync(movieDir, { recursive: true });

    if (cover && cover.size > 0) {
      const buffer = Buffer.from(await cover.arrayBuffer());
      fs.writeFileSync(path.join(movieDir, "cover.jpg"), buffer);
      film.cover = `/filmfy/movie/${newCode}/cover.jpg`;
    }

    if (oldCode !== newCode) {
      const oldDir = path.join(MOVIE_DIR, oldCode);
      if (fs.existsSync(oldDir)) {
        fs.renameSync(oldDir, movieDir);
      }
    }

    films[index] = film;
    fs.writeFileSync(FILE, JSON.stringify(films, null, 2));

    return NextResponse.json({
      message: "Film berhasil diperbarui",
      film,
    });
  } catch (err) {
    console.error("updateMovie error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
