import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data", "filmfy");
const DATA_FILE = path.join(DATA_DIR, "films.json");

interface FilmPart {
  order: number;
  title: string;
  note?: string;
}

interface Film {
  id: string;
  title: string;
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }

    // Pastikan folder data ada
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Load data lama
    let films: Film[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      films = JSON.parse(raw || "[]");
    }

    const filmId = crypto.randomUUID();

    const newFilm: Film = {
      id: filmId,
      title: body.title,
      releaseDate: body.releaseDate,
      director: body.director,
      maker: body.maker,
      label: body.label,
      genre: Array.isArray(body.genre)
        ? body.genre
        : (body.genre || "")
            .split(",")
            .map((g: string) => g.trim())
            .filter(Boolean),
      cast: Array.isArray(body.cast)
        ? body.cast
        : (body.cast || "")
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean),
      series: body.series || null,
      cover: null, // cover di-handle terpisah
      parts: (body.parts || []).map((p: any, index: number) => ({
        order: index + 1,
        title: p.title,
        note: p.note || "",
      })),
      createdAt: new Date().toISOString(),
    };

    films.push(newFilm);

    fs.writeFileSync(DATA_FILE, JSON.stringify(films, null, 2));

    return NextResponse.json({
      message: "Film metadata created",
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
