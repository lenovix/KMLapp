import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
  genre: string[];
  createdAt: string;
}

const FILM_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");
const USER_FILE = path.join(
  process.cwd(),
  "data",
  "filmfy",
  "user-actions.json"
);

function getFavorites(): number[] {
  if (!fs.existsSync(USER_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
  return data.favorites ?? [];
}

function getFilms(): Film[] {
  if (!fs.existsSync(FILM_FILE)) return [];
  return JSON.parse(fs.readFileSync(FILM_FILE, "utf-8"));
}

export default function FavoritePage() {
  const favoriteIds = getFavorites();
  const films = getFilms();

  const favoriteFilms = films.filter((f) => favoriteIds.includes(f.id));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/filmfy"
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              Favorite Movies
            </h1>
          </div>
        </header>

        {favoriteFilms.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl dark:border-gray-700">
            <p className="text-sm text-gray-500">Belum ada film favorit.</p>
            <Link
              href="/filmfy"
              className="inline-block mt-4 text-sm text-blue-600 hover:underline"
            >
              Jelajahi Film
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {favoriteFilms.map((film) => (
              <Link
                key={film.id}
                href={`/filmfy/${film.id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative aspect-2/3 bg-gray-200 dark:bg-gray-700">
                  {film.cover ? (
                    <Image
                      src={film.cover}
                      alt={film.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                      No Cover
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">
                    {film.title}
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    {(film.genre ?? []).slice(0, 3).map((g, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
