import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, Plus } from "lucide-react";
import FilmfyPlayerClient from "@/components/filmfy/FilmfyPlayerClient";

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

function getVideoFiles(folderPath: string) {
  if (!fs.existsSync(folderPath)) return [];

  return fs
    .readdirSync(folderPath)
    .filter((file) =>
      [".mp4", ".webm", ".mov"].includes(path.extname(file).toLowerCase())
    );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FilmDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) return notFound();

  if (!fs.existsSync(DATA_FILE)) return notFound();

  const films: Film[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "[]");

  const filmId = Number(id);
  if (Number.isNaN(filmId)) return notFound();

  const film = films.find((f) => f.id === filmId);
  if (!film) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/filmfy"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Filmfy
              </h1>
            </div>

            <div className="flex gap-2">
              <button className="p-2 rounded-xl border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link
                href="/filmfy/upload"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                Tambah Film
              </Link>
            </div>
          </div>
        </header>

        <section className="flex flex-col md:flex-row gap-8 items-start">
          {film.cover && (
            <div className="relative shrink-0 mx-auto md:mx-0">
              <Image
                src={film.cover}
                alt={film.title}
                width={260}
                height={380}
                className="rounded-2xl border dark:border-gray-700 object-cover shadow-lg"
                priority
              />
            </div>
          )}

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <span className="text-blue-600 font-mono text-sm font-bold uppercase tracking-wider">
                {film.code}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                {film.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {film.genre.map((g, i) => (
                <span
                  key={`${g}-${i}`}
                  className="px-4 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm border-t dark:border-gray-800 pt-6">
              <div>
                <p className="text-gray-500">Version</p>
                <p className="font-medium dark:text-gray-200">
                  {film.cencored || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Release Date</p>
                <p className="font-medium dark:text-gray-200">
                  {film.releaseDate || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Director</p>
                <p className="font-medium dark:text-gray-200">
                  <Link
                    href={`/filmfy/director/${encodeURIComponent(
                      film.director
                    )}`}
                  >
                    {film.director || "-"}
                  </Link>
                </p>
              </div>
              <div>
                <p className="text-gray-500">Maker</p>
                <p className="font-medium dark:text-gray-200">
                  {film.maker || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Label</p>
                <p className="font-medium dark:text-gray-200">
                  {film.label || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Series</p>
                <p className="font-medium dark:text-gray-200">
                  {film.series || "-"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Cast</p>
                <p className="font-medium dark:text-gray-200">
                  {film.cast || "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 md:p-8 border dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            Playlist Part
          </h2>

          {film.parts.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Film ini belum memiliki part video.
              </p>
            </div>
          ) : (
            <ul className="space-y-8">
              {film.parts
                .sort((a, b) => a.order - b.order)
                .map((part) => {
                  const folderPath = path.join(
                    process.cwd(),
                    "public",
                    "filmfy",
                    film.code,
                    part.folder
                  );

                  const videos = getVideoFiles(folderPath);

                  return (
                    <li key={part.order} className="group space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm">
                          {part.order}
                        </span>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition">
                            {part.title}
                          </h3>
                          {part.note && (
                            <p className="text-xs text-gray-500">{part.note}</p>
                          )}
                        </div>
                      </div>

                      {videos.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 ml-0 md:ml-11">
                          {videos.map((file) => {
                            const src = `/filmfy/${film.code}/${part.folder}/${file}`;

                            return (
                              <div
                                key={file}
                                className="space-y-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border dark:border-gray-700"
                              >
                                <div className="flex justify-between items-center px-1">
                                  <p className="text-xs font-mono text-gray-400 truncate max-w-50">
                                    {file}
                                  </p>
                                  <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded uppercase font-bold">
                                    {path.extname(file).replace(".", "")}
                                  </span>
                                </div>

                                <FilmfyPlayerClient
                                  key={`${film.id}-${part.order}-${file}`}
                                  src={src}
                                  filmId={film.id}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="ml-11 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed dark:border-gray-700">
                          <p className="text-xs text-gray-400 italic">
                            Media tidak ditemukan di folder: {part.folder}
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
            </ul>
          )}
        </section>

        <footer className="text-xs text-gray-400 text-center pb-12">
          Konten ditambahkan pada{" "}
          {new Date(film.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </footer>
      </div>
    </main>
  );
}
