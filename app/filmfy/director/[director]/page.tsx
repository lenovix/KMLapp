import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import DirectorClientPage from "./DirectorClientPage";

interface Film {
  id: number;
  title: string;
  code: string;
  director?: string;
  cover?: string | null;
  createdAt: string;
}

interface DirectorInfo {
  slug: string;
  name: string;
  description?: string;
  avatar?: string | null;
}

const FILMS_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const DIRECTORS_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "filmfy",
  "directors.json"
);

export default async function DirectorPage({
  params,
}: {
  params: Promise<{ director: string }>;
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.director);

  if (!fs.existsSync(FILMS_FILE) || !fs.existsSync(DIRECTORS_FILE)) {
    return notFound();
  }

  try {
    const films: Film[] = JSON.parse(fs.readFileSync(FILMS_FILE, "utf-8"));
    const directors: DirectorInfo[] = JSON.parse(
      fs.readFileSync(DIRECTORS_FILE, "utf-8")
    );

    const directorInfo = directors.find((d) => d.slug === slug);

    if (!directorInfo) {
      return notFound();
    }

    const filmsByDirector = films.filter((film) => film.director === slug);

    return (
      <DirectorClientPage
        director={slug}
        films={filmsByDirector}
        directorInfo={{
          name: directorInfo.name,
          description: directorInfo.description,
          avatar: directorInfo.avatar,
        }}
      />
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return notFound();
  }
}
