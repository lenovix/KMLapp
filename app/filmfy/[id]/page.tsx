import fs from "fs";
import path from "path";
import Image from "next/image";
import { notFound } from "next/navigation";

interface FilmPart {
  order: number;
  title: string;
  note?: string;
  folder: string;
}

interface Film {
  id: number;
  title: string;
  code: string;
  cencored: string;
  releaseDate?: string;
  director?: string;
  maker?: string;
  label?: string;
  genre: string[];
  cast: string[];
  series?: string | null;
  cover?: string | null;
  parts: FilmPart[];
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export default function FilmDetailPage({ params }: { params: { id: String } }) {
  if (!fs.existsSync(DATA_FILE)) {
    notFound();
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const films: Film[] = JSON.parse(raw || "[]");

  const film = films.find((f) => f.id === Number(params.id));

  if (!film) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex gap-6">
          {film.cover && (
            <Image
              src={film.cover}
              alt={film.title}
              width={260}
              height={380}
              className="rounded-xl object-cover border"
            />
          )}

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {film.title}
            </h1>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white">
                {film.cencored}
              </span>

              {film.releaseDate && (
                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  📅 {film.releaseDate}
                </span>
              )}
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {film.director && <p>🎬 Director: {film.director}</p>}
              {film.maker && <p>🏭 Maker: {film.maker}</p>}
              {film.label && <p>🏷 Label: {film.label}</p>}
              {film.series && <p>📀 Series: {film.series}</p>}
            </div>

            {film.genre.length > 0 && (
              <p className="text-sm">
                <b>Genre:</b> {film.genre.join(", ")}
              </p>
            )}

            {film.cast.length > 0 && (
              <p className="text-sm">
                <b>Cast:</b> {film.cast.join(", ")}
              </p>
            )}
          </div>
        </header>

        {/* Parts */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border">
          <h2 className="text-lg font-semibold mb-4">Part Film</h2>

          {film.parts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Film ini belum memiliki part.
            </p>
          ) : (
            <ul className="space-y-3">
              {film.parts.map((part) => (
                <li
                  key={part.order}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <p className="font-medium">
                    Part {part.order}: {part.title}
                  </p>
                  {part.note && (
                    <p className="text-sm text-gray-500">{part.note}</p>
                  )}
                  <p className="text-xs text-gray-400">Folder: {part.folder}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Footer */}
        <footer className="text-xs text-gray-400">
          Dibuat: {new Date(film.createdAt).toLocaleString()}
        </footer>
      </div>
    </main>
  );
}
