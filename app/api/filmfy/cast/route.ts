import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "filmfy");
const CAST_JSON = path.join(DATA_DIR, "casts.json");
const AVATAR_BASE_DIR = path.join(process.cwd(), "public", "filmfy", "casts");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(CAST_JSON)) {
      return NextResponse.json([]);
    }
    const casts = JSON.parse(fs.readFileSync(CAST_JSON, "utf-8"));
    return NextResponse.json(casts);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    ensureDir(DATA_DIR);
    ensureDir(AVATAR_BASE_DIR);

    const formData = await req.formData();
    const slug = String(formData.get("slug") || "").trim();

    if (!slug) {
      return NextResponse.json(
        { error: "Cast slug is required" },
        { status: 400 },
      );
    }

    let socialMediaPayload = undefined;
    const socialMediaRaw = formData.get("socialMedia");

    if (socialMediaRaw) {
      try {
        socialMediaPayload = JSON.parse(String(socialMediaRaw));
      } catch (e) {
        console.error("Failed to parse socialMedia JSON", e);
      }
    }

    const payload: any = {
      slug,
      name: formData.get("name") || undefined,
      alias: formData.get("alias") || undefined,
      birthDate: formData.get("birthDate") || undefined,
      age: formData.get("age") || undefined,
      birthplace: formData.get("birthplace") || undefined,
      sign: formData.get("sign") || undefined,
      blood: formData.get("blood") || undefined,

      physical: {
        height: formData.get("physical.height") || undefined,
        measurements: formData.get("physical.measurements") || undefined,
        cup: formData.get("physical.cup") || undefined,
        shoeSize: formData.get("physical.shoeSize") || undefined,
        hairLength: formData.get("physical.hairLength") || undefined,
        hairColor: formData.get("physical.hairColor") || undefined,
      },

      profile: {
        hobbies: formData.get("profile.hobbies") || undefined,
        specialSkills: formData.get("profile.specialSkills") || undefined,
      },

      socialMedia: socialMediaPayload,

      debut: {
        reason: formData.get("debut.reason") || undefined,
        start: formData.get("debut.start") || undefined,
        end: formData.get("debut.end") || undefined,
      },

      description: formData.get("description") || undefined,

      tags: formData.get("tags")
        ? String(formData.get("tags"))
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    };

    function clean(obj: any) {
      if (!obj || typeof obj !== "object") return;
      Object.keys(obj).forEach((k) => {
        const v = obj[k];
        if (
          v === undefined ||
          v === null ||
          v === "" ||
          (typeof v === "object" &&
            !Array.isArray(v) &&
            Object.keys(v).length === 0)
        ) {
          delete obj[k];
        }
      });
    }

    clean(payload.physical);
    clean(payload.profile);
    clean(payload.debut);

    if (
      Array.isArray(payload.socialMedia) &&
      payload.socialMedia.length === 0
    ) {
      delete payload.socialMedia;
    }

    clean(payload);

    const avatarFile = formData.get("avatar") as File | null;
    if (avatarFile && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const castDir = path.join(AVATAR_BASE_DIR, slug);
      ensureDir(castDir);

      const avatarFilename = "avatar.jpg";
      const avatarPath = path.join(castDir, avatarFilename);
      fs.writeFileSync(avatarPath, buffer);
      payload.avatar = `/filmfy/casts/${slug}/${avatarFilename}`;
    }

    const raw = fs.existsSync(CAST_JSON)
      ? fs.readFileSync(CAST_JSON, "utf-8")
      : "[]";
    let casts = JSON.parse(raw);

    const index = casts.findIndex((c: any) => c.slug === slug);
    const now = new Date().toISOString();

    if (index >= 0) {
      casts[index] = {
        ...casts[index],
        ...payload,
        updatedAt: now,
      };
    } else {
      casts.push({
        ...payload,
        createdAt: now,
        updatedAt: now,
      });
    }

    fs.writeFileSync(CAST_JSON, JSON.stringify(casts, null, 2));

    return NextResponse.json({
      success: true,
      slug,
      avatar: payload.avatar,
    });
  } catch (err) {
    console.error("CAST SAVE ERROR:", err);
    return NextResponse.json({ error: "Failed to save cast" }, { status: 500 });
  }
}
