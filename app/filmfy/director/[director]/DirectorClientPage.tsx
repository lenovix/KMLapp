"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Pencil, Plus, Search } from "lucide-react";
import EditDirectorModal from "./EditDirectorModal";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
}

interface DirectorInfo {
  name: string;
  description?: string;
  avatar?: string | null;
}

export default function DirectorClientPage({
  director,
  films,
  directorInfo: initialDirectorInfo,
}: {
  director: string;
  films: Film[];
  directorInfo?: DirectorInfo;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [directorInfo, setDirectorInfo] = useState<DirectorInfo>({
    name: initialDirectorInfo?.name || director,
    description: initialDirectorInfo?.description || "",
    avatar: initialDirectorInfo?.avatar || null,
  });

  const filteredFilms = useMemo(() => {
    const q = query.toLowerCase();
    return films.filter(
      (film) =>
        film.title.toLowerCase().includes(q) ||
        film.code.toLowerCase().includes(q)
    );
  }, [query, films]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/filmfy"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">Filmfy</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari film / kode..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border
                             dark:border-gray-700 bg-white dark:bg-gray-800
                             text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="p-2 rounded-xl border dark:border-gray-700">
                <Bookmark className="w-5 h-5" />
              </button>

              <Link
                href="/filmfy/upload"
                className="inline-flex items-center gap-2 px-4 py-2
                           rounded-xl bg-blue-600 text-white text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Film
              </Link>
            </div>
          </div>
        </header>

        <section className="flex gap-6 items-start">
          <div
            className="w-32 h-32 rounded-2xl bg-gray-200 dark:bg-gray-800
                       flex items-center justify-center overflow-hidden"
          >
            {directorInfo.avatar ? (
              <Image
                src={directorInfo.avatar}
                alt={directorInfo.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-500">
                {directorInfo.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{directorInfo.name}</h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
              {directorInfo.description ||
                `Daftar film yang disutradarai oleh ${directorInfo.name}.`}
            </p>

            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2
                         rounded-xl bg-blue-600 text-white text-sm"
            >
              <Pencil className="w-4 h-4" />
              Edit Director
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Film oleh {directorInfo.name}
          </h2>

          {filteredFilms.length === 0 && (
            <p className="text-gray-500 text-sm">Tidak ada film yang cocok.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredFilms.map((film) => (
              <Link
                key={film.id}
                href={`/filmfy/${film.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border hover:shadow-lg"
              >
                <div className="aspect-2/3 bg-gray-200 dark:bg-gray-700">
                  {film.cover ? (
                    <Image
                      src={film.cover}
                      alt={film.title}
                      width={300}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm">
                      No Cover
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-sm font-medium">{film.title}</p>
                  <p className="text-xs text-gray-500">{film.code}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <EditDirectorModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        slug={director}
        name={directorInfo.name}
        description={directorInfo.description}
        avatar={directorInfo.avatar}
        onSave={(data) => {
          setDirectorInfo((prev) => ({
            ...prev,
            name: data.name,
            description: data.description,
          }));
        }}
      />
    </main>
  );
}
