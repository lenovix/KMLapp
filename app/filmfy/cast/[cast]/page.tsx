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

interface CastInfo {
  slug: string;
  name: string;
  alias?: string;
  avatar?: string;
  birthDate?: string;
  debutReason?: string;
  debutStart?: string;
  debutEnd?: string;
  description?: string;
}

const FILMS_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const CASTS_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "filmfy",
  "casts.json"
);

export default async function CastPage({
  params,
}: {
  params: Promise<{ cast: string }>;
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.cast);

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
      (film) => Array.isArray(film.cast) && film.cast.includes(slug)
    );

    return (
      <CastClientPage
        cast={slug}
        films={filmsByCast}
        castInfo={{
          slug: castInfo.slug,
          name: castInfo.name,
          alias: castInfo.alias,
          avatar: castInfo.avatar,
          birthDate: castInfo.birthDate,
          debutReason: castInfo.debutReason,
          debutStart: castInfo.debutStart,
          debutEnd: castInfo.debutEnd,
          description: castInfo.description,
        }}
      />
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return notFound();
  }
}
