import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data", "filmfy");

const CAST_JSON = path.join(DATA_DIR, "casts.json");
const AVATAR_DIR = path.join(DATA_DIR, "casts");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    ensureDir(DATA_DIR);
    ensureDir(AVATAR_DIR);

    const formData = await req.formData();
    const slug = String(formData.get("slug"));

    if (!slug || slug === "undefined" || slug === "null") {
      return NextResponse.json(
        { error: "Invalid or missing cast slug" },
        { status: 400 }
      );
    }

    const payload: any = {
      slug,
      name: formData.get("name"),
      alias: formData.get("alias"),
      birthDate: formData.get("birthDate"),
      debutReason: formData.get("debutReason"),
      debutStart: formData.get("debutStart"),
      debutEnd: formData.get("debutEnd"),
      description: formData.get("description"),
    };

    Object.keys(payload).forEach(
      (k) =>
        (payload[k] === null ||
          payload[k] === undefined ||
          payload[k] === "") &&
        delete payload[k]
    );

    const avatarFile = formData.get("avatar") as File | null;

    if (avatarFile && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());

      const avatarPath = path.join(AVATAR_DIR, `${slug}.jpg`);
      fs.writeFileSync(avatarPath, buffer);
      payload.avatar = `/data/filmfy/casts/${slug}.jpg`;
    }

    const raw = fs.existsSync(CAST_JSON)
      ? fs.readFileSync(CAST_JSON, "utf-8")
      : "[]";

    const casts = JSON.parse(raw);
    const index = casts.findIndex((c: any) => c.slug === slug);

    if (index >= 0) {
      casts[index] = {
        ...casts[index],
        ...payload,
      };
    } else {
      if (slug !== "undefined") {
        casts.push(payload);
      }
    }

    fs.writeFileSync(CAST_JSON, JSON.stringify(casts, null, 2));

    return NextResponse.json({
      success: true,
      avatar: payload.avatar,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save cast" }, { status: 500 });
  }
}
