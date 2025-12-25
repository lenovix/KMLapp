import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "filmfy");
const DATA_FILE = path.join(DATA_DIR, "films.json");
const PUBLIC_FILM_DIR = path.join(process.cwd(), "public", "filmfy");

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

/**
 * Windows-safe folder name
 */
function sanitizeFolderName(name: string) {
  return name
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .substring(0, 100);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const title = form.get("title") as string;
    const code = form.get("code") as string;
    const coverFile = form.get("cover") as File | null;
    const cencored = form.get("cencored") as string;

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

    // ===============================
    // Pastikan folder data ada
    // ===============================
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(PUBLIC_FILM_DIR)) {
      fs.mkdirSync(PUBLIC_FILM_DIR, { recursive: true });
    }

    // ===============================
    // Load data lama
    // ===============================
    let films: Film[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      films = JSON.parse(raw || "[]");
    }

    // ===============================
    // Auto increment ID
    // ===============================
    const lastId = films.length > 0 ? Math.max(...films.map((f) => f.id)) : 0;
    const nextId = lastId + 1;

    // ===============================
    // Folder film (by code)
    // ===============================
    const filmPublicDir = path.join(PUBLIC_FILM_DIR, code);
    if (!fs.existsSync(filmPublicDir)) {
      fs.mkdirSync(filmPublicDir, { recursive: true });
    }

    // ===============================
    // Simpan cover
    // ===============================
    let coverPath: string | null = null;

    if (coverFile) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const coverFilePath = path.join(filmPublicDir, "cover.jpg");
      fs.writeFileSync(coverFilePath, buffer);
      coverPath = `/filmfy/${code}/cover.jpg`;
    }

    // ===============================
    // Parse parts
    // ===============================
    const rawParts = form.get("parts") as string;
    const partsInput = rawParts ? JSON.parse(rawParts) : [];

    // ===============================
    // Buat folder part
    // ===============================
    const parts: FilmPart[] = partsInput.map((p: any, index: number) => {
      const folder = sanitizeFolderName(p.title);

      if (folder) {
        const partDir = path.join(filmPublicDir, folder);
        if (!fs.existsSync(partDir)) {
          fs.mkdirSync(partDir, { recursive: true });
        }
      }

      return {
        order: index + 1,
        title: p.title,
        note: p.note || "",
        folder,
      };
    });

    // ===============================
    // Buat film object
    // ===============================
    const newFilm: Film = {
      id: nextId,
      title,
      code,
      cencored,
      releaseDate: form.get("releaseDate") as string,
      director: form.get("director") as string,
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
          .map((c) => c.trim())
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
