import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, Plus, Film as FilmIcon } from "lucide-react";

import InfoItem from "@/components/UI/InfoItem";
import FilmfyPlayerClient from "@/components/filmfy/FilmfyPlayerClient";
import MovieActionButtons from "@/components/filmfy/MovieActionButtons";
import FavoriteRatingButtons from "@/components/filmfy/FavoriteRatingButtons";
import CoverSectionClient from "@/components/filmfy/CoverSectionClient";

import { Film, Cast } from "@/types/filmfy";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DATA_FILE = path.join(process.cwd(), "data", "filmfy", "films.json");

export const revalidate = 0;

async function getCasts(): Promise<Cast[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/filmfy/cast`, {
      cache: "no-store",
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

function getVideoFiles(folderPath: string) {
  if (!fs.existsSync(folderPath)) return [];
  return fs
    .readdirSync(folderPath)
    .filter((file) =>
      [".mp4", ".webm", ".mov"].includes(path.extname(file).toLowerCase()),
    );
}

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const casts = await getCasts();
  const castMap = new Map<string, Cast>(casts.map((c) => [c.slug, c]));

  if (!fs.existsSync(DATA_FILE)) return notFound();
  const films: Film[] = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "[]");
  const film = films.find((f) => f.id === Number(id));

  if (!film) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-30 w-full bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/filmfy"
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Filmfy <span className="text-blue-600">Detail</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/filmfy/favorite"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 transition"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <Link
              href="/filmfy/upload"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        <section>
          {film.parts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-12">
              {film.parts
                .sort((a, b) => a.order - b.order)
                .map((part) => {
                  const folderPath = path.join(
                    process.cwd(),
                    "public",
                    "filmfy",
                    "movie",
                    film.code,
                    part.folder,
                  );
                  const videos = getVideoFiles(folderPath);

                  return (
                    <div key={part.order} className="">
                      {videos.map((file) => (
                        <VideoCard
                          key={file}
                          file={file}
                          filmId={film.id}
                          src={`/filmfy/movie/${film.code}/${part.folder}/${file}`}
                          partOrder={part.order}
                        />
                      ))}
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start">
          <div className="mx-auto md:mx-0 w-full max-w-75">
            <CoverSectionClient
              cover={film.cover}
              title={film.title}
              code={film.code}
              createdAt={film.createdAt}
            />

            <div className="mt-6 space-y-3">
              <FavoriteRatingButtons
                filmId={film.id}
                initialFavorite={film.isFavorite || false}
                initialRating={film.rating || null}
              />
              <MovieActionButtons filmId={film.id} />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black mb-3 tracking-widest">
                {film.code}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                {film.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {film.genre.map((g) => (
                  <span
                    key={g}
                    className="px-4 py-1.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 py-8 border-y border-gray-200 dark:border-gray-800">
              <InfoItem label="Status">
                <span
                  className={`text-xs font-black tracking-tighter ${
                    film.isDeleted ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {film.isDeleted ? "● DELETED" : "● ACTIVE"}
                </span>
              </InfoItem>
              <InfoItem label="Version">{film.cencored || "-"}</InfoItem>
              <InfoItem label="Release">{film.releaseDate || "-"}</InfoItem>
              <InfoLink
                label="Director"
                href={`/filmfy/director/`}
                value={film.director}
              />
              <InfoLink
                label="Maker"
                href={`/filmfy/maker/`}
                value={film.maker}
              />
              <InfoLink
                label="Series"
                href={`/filmfy/series/`}
                value={film.series}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                Cast Members
              </h3>
              <div className="flex flex-wrap gap-3">
                {film.cast.map((cId) => (
                  <Link
                    key={cId}
                    href={`/filmfy/cast/${cId}`}
                    className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold hover:border-blue-500 transition shadow-sm"
                  >
                    {castMap.get(cId)?.name || cId}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoLink({
  label,
  href,
  value,
}: {
  label: string;
  href: string;
  value?: string | null;
}) {
  return (
    <InfoItem label={label}>
      {value ? (
        <Link
          href={`${href}${encodeURIComponent(value)}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {value}
        </Link>
      ) : (
        "-"
      )}
    </InfoItem>
  );
}

function VideoCard({
  file,
  src,
  filmId,
  partOrder,
}: {
  file: string;
  src: string;
  filmId: number;
  partOrder: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="px-4 py-2 border-b dark:border-gray-800 flex justify-between items-center bg-gray-100/50 dark:bg-gray-800/50">
        <span className="text-[10px] font-mono text-gray-500 truncate max-w-xs">
          {file}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-gray-700 shadow-sm uppercase">
          {path.extname(file).replace(".", "")}
        </span>
      </div>
      <div className="p-1">
        <FilmfyPlayerClient
          src={src}
          filmId={filmId}
          key={`${filmId}-${partOrder}-${file}`}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed dark:border-gray-800">
      <FilmIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">
        Belum ada video yang tersedia untuk film ini.
      </p>
    </div>
  );
}
