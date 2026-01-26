import fs from "fs";
import path from "path";
import FavoriteClient from "@/app/filmfy/favorite/FavoriteClient";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
  genre: string[];
  createdAt: string;
  isFavorite?: boolean;
  favoriteAddedAt?: string;
}

const FILM_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export const revalidate = 0;

function getFavoriteFilms(): Film[] {
  if (!fs.existsSync(FILM_FILE)) return [];

  try {
    const fileContent = fs.readFileSync(FILM_FILE, "utf-8");
    const films: Film[] = JSON.parse(fileContent || "[]");

    return films
      .filter((film) => film.isFavorite === true)
      .sort((a, b) => {
        const dateA = new Date(a.favoriteAddedAt || 0).getTime();
        const dateB = new Date(b.favoriteAddedAt || 0).getTime();
        return dateB - dateA;
      });
  } catch (error) {
    console.error("Error reading favorite films:", error);
    return [];
  }
}

export default function FavoritePage() {
  const favoriteFilms = getFavoriteFilms();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FavoriteClient films={favoriteFilms} />
    </div>
  );
}
