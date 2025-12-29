import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data", "filmfy");
const CASTS_FILE = path.join(DATA_DIR, "casts.json");
const AVATAR_DIR = path.join(DATA_DIR, "casts");

export async function POST(req: Request) {
  const formData = await req.formData();

  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const character = formData.get("character") as string | null;
  const description = formData.get("description") as string | null;
  const avatar = formData.get("avatar") as File | null;

  if (!slug || !name) {
    return NextResponse.json(
      { success: false, message: "Slug & name wajib diisi" },
      { status: 400 }
    );
  }

  // Pastikan folder ada
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(AVATAR_DIR)) fs.mkdirSync(AVATAR_DIR, { recursive: true });

  // Load data cast
  let casts: any[] = [];
  if (fs.existsSync(CASTS_FILE)) {
    casts = JSON.parse(fs.readFileSync(CASTS_FILE, "utf-8"));
  }

  const index = casts.findIndex((c) => c.slug === slug);
  let avatarPath = index >= 0 ? casts[index].avatar : null;

  // Upload avatar
  if (avatar) {
    const buffer = Buffer.from(await avatar.arrayBuffer());
    const ext = avatar.name.split(".").pop() || "jpg";

    avatarPath = `/data/filmfy/casts/${slug}.${ext}`;
    fs.writeFileSync(path.join(AVATAR_DIR, `${slug}.${ext}`), buffer);
  }

  const payload = {
    slug,
    name,
    character,
    description,
    avatar: avatarPath,
  };

  if (index >= 0) {
    casts[index] = {
      ...casts[index],
      ...payload,
    };
  } else {
    casts.push(payload);
  }

  fs.writeFileSync(CASTS_FILE, JSON.stringify(casts, null, 2));

  return NextResponse.json({
    success: true,
    cast: payload,
  });
}
