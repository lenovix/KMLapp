"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FilmfyDirectorHeader from "@/components/filmfy/metadata/header";
import films from "@/data/filmfy/films.json";

export type MetadataType = "director" | "maker" | "label" | "series";

interface Film {
  id: number;
  title: string;
  code: string;
  director?: string;
  maker?: string;
  label?: string;
  series?: string;
  releaseDate: string;
  cover: string;
}

interface FilmfyMetadataPageProps {
  type: MetadataType;
  value: string;
  title: string;
}

export default function FilmfyMetadataPage({
  type,
  value,
  title,
}: FilmfyMetadataPageProps) {
  const [query, setQuery] = useState("");

  const decodedValue = decodeURIComponent(value);

  const filteredFilms = (films as Film[])
    .filter((film) => {
      const metaValue = film[type];
      return metaValue?.toLowerCase() === decodedValue.toLowerCase();
    })
    .filter((film) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        film.title.toLowerCase().includes(q) ||
        film.code.toLowerCase().includes(q)
      );
    });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <FilmfyDirectorHeader
          director={decodedValue}
          query={query}
          setQuery={setQuery}
          title={title}
        />

        {filteredFilms.length === 0 ? (
          <p className="text-gray-500">Belum ada film.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredFilms.map((film) => (
              <Link key={film.id} href={`/filmfy/${film.id}`} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition">
                  <div className="relative aspect-3/2 bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={film.cover}
                      alt={film.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:underline">
                      {film.title}
                    </h2>
                    <p className="text-xs text-gray-500">{film.releaseDate}</p>
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
