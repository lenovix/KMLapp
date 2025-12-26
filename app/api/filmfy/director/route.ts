import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data", "filmfy");
const DIRECTORS_FILE = path.join(DATA_DIR, "directors.json");
const AVATAR_DIR = path.join(DATA_DIR, "directors");

export async function POST(req: Request) {
  const formData = await req.formData();

  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const avatar = formData.get("avatar") as File | null;

  if (!slug || !name) {
    return NextResponse.json(
      { success: false, message: "Slug & name wajib diisi" },
      { status: 400 }
    );
  }

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });

  let directors: any[] = [];
  if (fs.existsSync(DIRECTORS_FILE)) {
    directors = JSON.parse(fs.readFileSync(DIRECTORS_FILE, "utf-8"));
  }

  const index = directors.findIndex((d) => d.slug === slug);

  let avatarPath = index >= 0 ? directors[index].avatar : null;

  if (avatar) {
    const buffer = Buffer.from(await avatar.arrayBuffer());
    const ext = avatar.name.split(".").pop() || "jpg";

    avatarPath = `/data/filmfy/directors/${slug}.${ext}`;
    fs.writeFileSync(path.join(AVATAR_DIR, `${slug}.${ext}`), buffer);
  }

  const payload = {
    slug,
    name,
    description,
    avatar: avatarPath,
  };

  if (index >= 0) {
    directors[index] = {
      ...directors[index],
      ...payload,
    };
  } else {
    directors.push(payload);
  }

  fs.writeFileSync(DIRECTORS_FILE, JSON.stringify(directors, null, 2));

  return NextResponse.json({
    success: true,
    director: payload,
  });
}
