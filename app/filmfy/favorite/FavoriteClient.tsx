"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
  genre: string[];
  createdAt: string;
  favoritedAt: string;
}

export default function FavoriteClient({ films }: { films: Film[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    return films
      .filter((f) => {
        const q = query.toLowerCase();
        const matchQuery =
          f.title.toLowerCase().includes(q) || f.code.toLowerCase().includes(q);

        return matchQuery;
      })
      .sort((a, b) => {
        if (sort === "az") {
          return a.title.localeCompare(b.title);
        }

        return (
          new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime()
        );
      });
  }, [films, query, sort]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/filmfy"
                  className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  Favorite Movies
                </h1>
              </div>

              <div className="hidden md:block w-full max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search title or code..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="relative md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or code..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="newest">Recently Favorited</option>
                <option value="az">A - Z</option>
              </select>
            </div>
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-16">
            Tidak ada film yang cocok.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((film) => (
              <Link
                key={film.id}
                href={`/filmfy/${film.id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden hover:shadow-lg transition"
              >
                <div className="relative aspect-2/3 bg-gray-200 dark:bg-gray-700">
                  {film.cover && (
                    <Image
                      src={film.cover}
                      alt={film.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2">
                    {film.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">{film.code}</p>
                  <p className="text-[10px] text-gray-400">
                    Favorited: {new Date(film.favoritedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
