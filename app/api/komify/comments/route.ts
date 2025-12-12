import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const COMICS_PATH = path.join(process.cwd(), "data/komify", "comics.json");

// Load comics.json
function loadComics() {
  if (!fs.existsSync(COMICS_PATH)) return [];
  const raw = fs.readFileSync(COMICS_PATH, "utf-8");
  return JSON.parse(raw);
}

// Save comics.json
function saveComics(data: any) {
  fs.writeFileSync(COMICS_PATH, JSON.stringify(data, null, 2));
}

// GET — ambil komentar untuk slug
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug tidak ditemukan" },
      { status: 400 }
    );
  }

  const comics = loadComics();
  const comic = comics.find((c: any) => String(c.slug) === slug);

  return NextResponse.json(comic?.comments || []);
}

// POST — tambah komentar
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug tidak ditemukan" },
      { status: 400 }
    );
  }

  const { username = "Anon", text } = await req.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "Komentar kosong" }, { status: 400 });
  }

  const comics = loadComics();
  const index = comics.findIndex((c: any) => String(c.slug) === slug);

  if (index === -1) {
    return NextResponse.json(
      { error: "Comic tidak ditemukan" },
      { status: 404 }
    );
  }

  // Buat komentar baru
  const newComment = {
    id: `cmt_${Date.now()}`,
    username,
    text,
    timestamp: new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .replace("T", " "),
  };

  comics[index].comments = [...(comics[index].comments || []), newComment];

  saveComics(comics);

  return NextResponse.json({
    message: "Komentar ditambahkan",
    comment: newComment,
  });
}

// PUT — edit komentar
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const { id, text } = await req.json();

  if (!slug || !id || !text?.trim()) {
    return NextResponse.json(
      { error: "Slug, ID, atau komentar kosong" },
      { status: 400 }
    );
  }

  const comics = loadComics();
  const comic = comics.find((c: any) => String(c.slug) === slug);

  if (!comic) {
    return NextResponse.json(
      { error: "Comic tidak ditemukan" },
      { status: 404 }
    );
  }

  const idx = (comic.comments || []).findIndex((c: any) => c.id === id);
  if (idx === -1) {
    return NextResponse.json(
      { error: "Komentar tidak ditemukan" },
      { status: 404 }
    );
  }

  comic.comments[idx].text = text;
  comic.comments[idx].edited = true;
  comic.comments[idx].timestamp = new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .replace("T", " ");

  saveComics(comics);

  return NextResponse.json({
    message: "Komentar diedit",
    comment: comic.comments[idx],
  });
}

// DELETE — hapus komentar
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const { id } = await req.json();

  if (!slug || !id) {
    return NextResponse.json({ error: "Slug atau ID kosong" }, { status: 400 });
  }

  const comics = loadComics();
  const index = comics.findIndex((c: any) => String(c.slug) === slug);

  if (index === -1) {
    return NextResponse.json(
      { error: "Comic tidak ditemukan" },
      { status: 404 }
    );
  }

  const before = comics[index].comments || [];
  const after = before.filter((c: any) => c.id !== id);

  if (before.length === after.length) {
    return NextResponse.json(
      { error: "Komentar tidak ditemukan" },
      { status: 404 }
    );
  }

  comics[index].comments = after;
  saveComics(comics);

  return NextResponse.json({
    message: "Komentar dihapus",
  });
}
