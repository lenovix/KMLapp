import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const commentsPath = path.join(process.cwd(), "data/komify", "comments.json");

// Helper baca file
function loadComments() {
  if (!fs.existsSync(commentsPath)) return {};
  const raw = fs.readFileSync(commentsPath, "utf-8");
  return JSON.parse(raw);
}

// Helper save file
function saveComments(data: any) {
  fs.writeFileSync(commentsPath, JSON.stringify(data, null, 2));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json(
      { error: "Slug tidak ditemukan" },
      { status: 400 }
    );

  const all = loadComments();
  return NextResponse.json(all[slug] || []);
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json(
      { error: "Slug tidak ditemukan" },
      { status: 400 }
    );

  const body = await req.json();
  const { username = "Anon", text } = body;

  if (!text?.trim())
    return NextResponse.json({ error: "Komentar kosong" }, { status: 400 });

  const all = loadComments();
  const list = all[slug] || [];

  const newComment = {
    id: `cmt_${Date.now()}`,
    username,
    text,
    timestamp: new Date()
      .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
      .replace("T", " "),
  };

  all[slug] = [...list, newComment];
  saveComments(all);

  return NextResponse.json({
    message: "Komentar ditambahkan",
    comment: newComment,
  });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json(
      { error: "Slug tidak ditemukan" },
      { status: 400 }
    );

  const body = await req.json();
  const { id, text } = body;

  if (!id || !text?.trim())
    return NextResponse.json(
      { error: "ID atau komentar kosong" },
      { status: 400 }
    );

  const all = loadComments();
  const list = all[slug] || [];

  const index = list.findIndex((c: any) => c.id === id);
  if (index === -1)
    return NextResponse.json(
      { error: "Komentar tidak ditemukan" },
      { status: 404 }
    );

  list[index].text = text;
  list[index].edited = true;
  list[index].timestamp = new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
    .replace("T", " ");

  all[slug] = list;
  saveComments(all);

  return NextResponse.json({
    message: "Komentar diedit",
    comment: list[index],
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug)
    return NextResponse.json(
      { error: "Slug tidak ditemukan" },
      { status: 400 }
    );

  const body = await req.json();
  const { id } = body;

  if (!id)
    return NextResponse.json(
      { error: "ID komentar tidak diberikan" },
      { status: 400 }
    );

  const all = loadComments();
  const list = all[slug] || [];

  const filtered = list.filter((c: any) => c.id !== id);

  if (filtered.length === list.length)
    return NextResponse.json(
      { error: "Komentar tidak ditemukan" },
      { status: 404 }
    );

  all[slug] = filtered;
  saveComments(all);

  return NextResponse.json({ message: "Komentar dihapus" });
}
