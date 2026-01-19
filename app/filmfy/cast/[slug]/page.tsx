import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import CastClientPage from "./CastClientPage";

interface Film {
  id: number;
  title: string;
  code: string;
  cast: string[];
  cover?: string | null;
  createdAt: string;
}

interface CastGalleryItem {
  name: string;
  order: number;
}

interface SocialMediaItem {
  platform: string;
  url: string;
}

interface CastInfo {
  slug: string;
  name: string;
  alias?: string;
  avatar?: string;

  birthDate?: string;
  age?: string;
  birthplace?: string;
  sign?: string;
  blood?: string;

  physical?: {
    height?: string;
    measurements?: string;
    cup?: string;
    shoeSize?: string;
    hairLength?: string;
    hairColor?: string;
  };

  profile?: {
    hobbies?: string;
    specialSkills?: string;
  };

  tags?: string[];

  socialMedia?: SocialMediaItem[];

  debut?: {
    reason?: string;
    start?: string;
    end?: string;
  };

  description?: string;
  gallery?: CastGalleryItem[];
}

const FILMS_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const CASTS_FILE = path.join(process.cwd(), "data", "filmfy", "casts.json");

export default async function CastPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  if (!fs.existsSync(FILMS_FILE) || !fs.existsSync(CASTS_FILE)) {
    return notFound();
  }

  try {
    const films: Film[] = JSON.parse(fs.readFileSync(FILMS_FILE, "utf-8"));
    const casts: CastInfo[] = JSON.parse(fs.readFileSync(CASTS_FILE, "utf-8"));

    const castInfo = casts.find((c) => c.slug === slug);

    if (!castInfo) {
      return notFound();
    }

    const filmsByCast = films.filter(
      (film) => Array.isArray(film.cast) && film.cast.includes(slug),
    );

    return (
      <CastClientPage
        cast={slug}
        films={filmsByCast}
        castInfo={{
          ...castInfo,
          socialMedia: castInfo.socialMedia || [],
        }}
      />
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return notFound();
  }
}
