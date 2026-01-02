import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const MOVIE_DIR = path.join(process.cwd(), "public", "filmfy", "movie");

type NormalizedField = string | string[] | null;

const normalizeField = (value: any): NormalizedField => {
  if (!value) return null;

  let arr: string[] = [];

  if (Array.isArray(value)) {
    arr = value
      .flatMap((v) => String(v).split(","))
      .map((v) => v.trim())
      .filter(Boolean);
  } else if (typeof value === "string") {
    arr = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  arr = [...new Set(arr)];

  if (arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  return arr;
};

const getString = (v: any) => (Array.isArray(v) ? v[0] : v ?? "");

export async function POST(req: Request) {
  const formData = await req.formData();
  const id = Number(formData.get("id"));

  const films = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  const index = films.findIndex((f: any) => f.id === id);
  if (index === -1)
    return NextResponse.json({ error: "Film not found" }, { status: 404 });

  const film = films[index];

  film.title = getString(formData.get("title"));
  film.code = normalizeField(formData.get("code"));
  film.releaseDate = normalizeField(formData.get("releaseDate"));
  film.director = normalizeField(formData.get("director"));
  film.maker = normalizeField(formData.get("maker"));
  film.label = normalizeField(formData.get("label"));
  film.series = normalizeField(formData.get("series"));
  film.cencored = normalizeField(formData.get("cencored"));
  film.genre = String(formData.get("genre") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  film.cast = String(formData.get("cast") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const cover = formData.get("cover") as File;
  if (cover) {
    const buffer = Buffer.from(await cover.arrayBuffer());
    const coverDir = path.join(MOVIE_DIR, film.code);
    fs.mkdirSync(coverDir, { recursive: true });

    const coverPath = path.join(coverDir, "cover.jpg");
    fs.writeFileSync(coverPath, buffer);

    film.cover = `/filmfy/movie/${film.code}/cover.jpg`;
  }

  fs.writeFileSync(FILE, JSON.stringify(films, null, 2));
  return NextResponse.json({ success: true });
}
