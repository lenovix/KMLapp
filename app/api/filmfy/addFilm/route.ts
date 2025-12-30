import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "filmfy");
const DATA_FILE = path.join(DATA_DIR, "films.json");

const PUBLIC_DIR = path.join(process.cwd(), "public");
const PUBLIC_FILM_DIR = path.join(PUBLIC_DIR, "filmfy");
// const DIRECTOR_FILE = path.join(PUBLIC_DIR, "data", "filmfy", "directors.json");
const CAST_FILE = path.join(PUBLIC_DIR, "data", "filmfy", "casts.json");

interface FilmPart {
  order: number;
  title: string;
  note?: string;
  folder: string;
}

interface Film {
  id: number;
  title: string;
  code: string;
  cencored: string;
  releaseDate?: string;
  director?: string;
  maker?: string;
  label?: string;
  genre: string[];
  cast: string[];
  series?: string | null;
  cover?: string | null;
  parts: FilmPart[];
  createdAt: string;
}

interface Director {
  slug: string;
  name: string;
  description: string;
  avatar: string;
}

interface Cast {
  slug: string;
  name: string;
  character?: string;
  description: string;
  avatar: string;
}

function sanitizeFolderName(name: string) {
  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .substring(0, 100);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const title = form.get("title") as string;
    const code = form.get("code") as string;
    const coverFile = form.get("cover") as File | null;
    const cencored = form.get("cencored") as string;
    const directorName = (form.get("director") as string)?.trim();

    if (!title || !code) {
      return NextResponse.json(
        { message: "Title dan code wajib diisi" },
        { status: 400 }
      );
    }

    if (!cencored) {
      return NextResponse.json(
        { message: "Status cencored wajib diisi" },
        { status: 400 }
      );
    }

    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.mkdirSync(PUBLIC_FILM_DIR, { recursive: true });
    // fs.mkdirSync(path.dirname(DIRECTOR_FILE), { recursive: true });

    let films: Film[] = [];
    if (fs.existsSync(DATA_FILE)) {
      films = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "[]");
    }

    const lastId = films.length ? Math.max(...films.map((f) => f.id)) : 0;
    const nextId = lastId + 1;

    const filmPublicDir = path.join(PUBLIC_FILM_DIR, code);
    fs.mkdirSync(filmPublicDir, { recursive: true });

    let coverPath: string | null = null;
    if (coverFile) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      fs.writeFileSync(path.join(filmPublicDir, "cover.jpg"), buffer);
      coverPath = `/filmfy/${code}/cover.jpg`;
    }

    const rawParts = form.get("parts") as string;
    const partsInput = rawParts ? JSON.parse(rawParts) : [];

    const parts: FilmPart[] = partsInput.map((p: any, index: number) => {
      const folder = sanitizeFolderName(p.title);
      if (folder) {
        fs.mkdirSync(path.join(filmPublicDir, folder), { recursive: true });
      }

      return {
        order: index + 1,
        title: p.title,
        note: p.note || "",
        folder,
      };
    });

    // if (directorName) {
    //   const slug = slugify(directorName);

    //   let directors: Director[] = [];
    //   if (fs.existsSync(DIRECTOR_FILE)) {
    //     directors = JSON.parse(fs.readFileSync(DIRECTOR_FILE, "utf-8") || "[]");
    //   }

    //   const exists = directors.some((d) => d.slug === slug);

    //   if (!exists) {
    //     directors.push({
    //       slug,
    //       name: directorName,
    //       description: "",
    //       avatar: `/data/filmfy/directors/${slug}.jpg`,
    //     });

    //     fs.writeFileSync(DIRECTOR_FILE, JSON.stringify(directors, null, 2));
    //   }
    // }

    // === AUTO CREATE CAST ===
    const castRaw = form.get("cast") as string | null;

    if (castRaw) {
      const castNames = castRaw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      let casts: any[] = [];
      if (fs.existsSync(CAST_FILE)) {
        casts = JSON.parse(fs.readFileSync(CAST_FILE, "utf-8") || "[]");
      }

      let updated = false;

      for (const castName of castNames) {
        const slug = slugify(castName);
        const exists = casts.some((c) => c.slug === slug);

        if (!exists) {
          casts.push({
            slug,
            name: castName,
            character: "",
            description: "",
            avatar: `/data/filmfy/casts/${slug}.jpg`,
          });
          updated = true;
        }
      }

      if (updated) {
        fs.mkdirSync(path.dirname(CAST_FILE), { recursive: true });
        fs.writeFileSync(CAST_FILE, JSON.stringify(casts, null, 2));
      }
    }

    const newFilm: Film = {
      id: nextId,
      title,
      code,
      cencored,
      releaseDate: form.get("releaseDate") as string,
      director: directorName ? slugify(directorName) : undefined,
      maker: form.get("maker") as string,
      label: form.get("label") as string,
      genre:
        (form.get("genre") as string | null)
          ?.split(",")
          .map((g) => g.trim())
          .filter(Boolean) || [],
      cast:
        (form.get("cast") as string | null)
          ?.split(",")
          .map((c) => slugify(c.trim()))
          .filter(Boolean) || [],
      series: (form.get("series") as string) || null,
      cover: coverPath,
      parts,
      createdAt: new Date().toISOString(),
    };

    films.push(newFilm);
    fs.writeFileSync(DATA_FILE, JSON.stringify(films, null, 2));

    return NextResponse.json({
      message: "Film berhasil dibuat",
      film: newFilm,
    });
  } catch (error) {
    console.error("addFilm error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
