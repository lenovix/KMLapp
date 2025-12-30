"use client";

import Image from "next/image";
import Link from "next/link";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
}

export default function CastFilmListSection({ films }: { films: Film[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Film List:</h2>

      {films.length === 0 && (
        <p className="text-gray-500 text-sm">Tidak ada film yang cocok.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {films.map((film) => (
          <Link
            key={film.id}
            href={`/filmfy/${film.id}`}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border hover:shadow-lg transition"
          >
            <div className="relative aspect-3/2 bg-gray-200 dark:bg-gray-700">
              {film.cover ? (
                <Image
                  src={film.cover}
                  alt={film.title}
                  width={300}
                  height={450}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
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
  );
}
