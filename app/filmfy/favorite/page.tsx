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
  favoritedAt: string;
}

const FILM_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const USER_FILE = path.join(
  process.cwd(),
  "data",
  "filmfy",
  "user-actions.json"
);

function getFavoriteFilms() {
  if (!fs.existsSync(USER_FILE) || !fs.existsSync(FILM_FILE)) return [];

  const user = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
  const films = JSON.parse(fs.readFileSync(FILM_FILE, "utf-8"));

  return user.favorites
    .map((fav: any) => {
      const film = films.find((f: any) => f.id === fav.filmId);
      if (!film) return null;
      return {
        ...film,
        favoritedAt: fav.addedAt,
      };
    })
    .filter(Boolean);
}

export default function FavoritePage() {
  const favoriteFilms = getFavoriteFilms();

  return <FavoriteClient films={favoriteFilms} />;
}
