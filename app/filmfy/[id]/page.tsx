import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, Plus } from "lucide-react";

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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FilmDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  if (!fs.existsSync(DATA_FILE)) {
    return notFound();
  }

  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const films: Film[] = JSON.parse(raw || "[]");

  const filmId = Number(id);
  if (Number.isNaN(filmId)) {
    return notFound();
  }

  const film = films.find((f) => f.id === filmId);
  if (!film) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Link
                href="/filmfy"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Filmfy
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-xl border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Bookmark"
              >
                <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>

              <Link
                href="/filmfy/upload"
                className="inline-flex items-center gap-2 px-4 py-2
                  rounded-xl bg-blue-600 text-white text-sm font-medium
                  hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah Film</span>
              </Link>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <section className="flex flex-col md:flex-row gap-6">
          {film.cover && (
            <Image
              src={film.cover}
              alt={film.title}
              width={260}
              height={380}
              className="rounded-2xl object-cover border self-start"
              priority
            />
          )}

          <div className="flex-1 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              <span className="text-gray-500 dark:text-gray-400 mr-2">
                {film.code}
              </span>
              <span>-</span>
              <span className="ml-2">{film.title}</span>
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
              {film.director && (
                <p>
                  🎬 Director:{" "}
                  <Link
                    href={`/filmfy/director/${encodeURIComponent(
                      film.director
                    )}`}
                    className="inline-block px-2 py-1 mr-2 rounded-full
                    bg-blue-100 dark:bg-blue-900
                    text-blue-700 dark:text-blue-300 text-xs
                    hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    {film.director}
                  </Link>
                </p>
              )}

              {film.maker && (
                <p>
                  🏭 Maker:{" "}
                  <Link
                    href={`/filmfy/maker/${encodeURIComponent(film.maker)}`}
                    className="inline-block px-2 py-1 mr-2 rounded-full
                    bg-blue-100 dark:bg-blue-900
                    text-blue-700 dark:text-blue-300 text-xs
                    hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    {film.maker}
                  </Link>
                </p>
              )}

              {film.label && (
                <p>
                  🏷 Label:{" "}
                  <Link
                    href={`/filmfy/label/${encodeURIComponent(film.label)}`}
                    className="inline-block px-2 py-1 mr-2 rounded-full
                    bg-blue-100 dark:bg-blue-900
                    text-blue-700 dark:text-blue-300 text-xs
                    hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    {film.label}
                  </Link>
                </p>
              )}

              {film.series && (
                <p>
                  📀 Series:{" "}
                  <Link
                    href={`/filmfy/series/${encodeURIComponent(film.series)}`}
                    className="inline-block px-2 py-1 mr-2 rounded-full
                    bg-blue-100 dark:bg-blue-900
                    text-blue-700 dark:text-blue-300 text-xs
                    hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    {film.series}
                  </Link>
                </p>
              )}

              {film.cast.length > 0 && (
                <p>
                  👥 Cast:{" "}
                  {film.cast.map((name, i) => (
                    <span key={name}>
                      <Link
                        href={`/filmfy/cast/${encodeURIComponent(name)}`}
                        className="inline-block px-2 py-1 mr-2 rounded-full
                        bg-blue-100 dark:bg-blue-900
                        text-blue-700 dark:text-blue-300 text-xs
                        hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                      >
                        {name}
                      </Link>
                      {i < film.cast.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              )}
            </div>

            {film.genre.length > 0 && (
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {film.genre.map((g, i) => (
                  <span key={g}>
                    <Link
                      href={`/filmfy/genre/${encodeURIComponent(g)}`}
                      className="inline-block px-2 py-1 mr-2 rounded-full
                      bg-blue-100 dark:bg-blue-900
                      text-blue-700 dark:text-blue-300 text-xs
                      hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    >
                      {g}
                    </Link>
                    {i < film.genre.length - 1 && ", "}
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>

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

        <footer className="text-xs text-gray-400 text-center">
          Dibuat: {new Date(film.createdAt).toLocaleString("id-ID")}
        </footer>
      </div>
    </main>
  );
}
