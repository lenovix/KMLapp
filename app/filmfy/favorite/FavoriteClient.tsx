"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Heart,
  SortAsc,
  Calendar,
  X,
  Plus,
} from "lucide-react";
import { Film } from "@/types/filmfy";

interface FavoriteFilm extends Film {
  favoritedAt: string;
}

export default function FavoriteClient({ films }: { films: FavoriteFilm[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    return films
      .filter((f) => {
        const q = query.toLowerCase();
        return (
          f.title.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)
        );
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-30 w-full bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/filmfy"
              className="p-2.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition shadow-lg shadow-pink-500/20 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                Favorites
              </h1>
              <p className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mt-1">
                Your Collection
              </p>
            </div>
          </div>

          <div className="hidden md:block relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari di favorit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-pink-500 text-sm outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="hidden sm:block px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-none shadow-sm text-xs font-bold outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <option value="newest">Terbaru Disimpan</option>
              <option value="az">Nama A - Z</option>
            </select>

            <Link
              href="/filmfy/upload"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari film..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 py-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border-none text-sm"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border-none shadow-sm text-sm font-bold"
          >
            <option value="newest">Recently Favorited</option>
            <option value="az">A - Z</option>
          </select>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filtered.map((film) => (
            <Link
              key={film.id}
              href={`/filmfy/${film.id}`}
              className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                <Image
                  src={film.cover ?? "/img/placeholder.png"}
                  alt={film.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-3 left-3">
                  <div className="p-1.5 bg-pink-600 rounded-lg shadow-lg">
                    <Heart className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest block mb-1">
                  {film.code}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors">
                  {film.title}
                </h3>

                <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-700 flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Added{" "}
                    {new Date(film.favoritedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="relative mx-auto w-16 h-16 mb-6">
              <Heart className="w-12 h-12 text-pink-200 mx-auto" />
              <Search className="absolute -bottom-1 -right-1 w-6 h-6 text-pink-500 bg-white dark:bg-gray-900 rounded-full p-1" />
            </div>
            <p className="text-gray-900 dark:text-white font-black text-xl">
              Koleksi tidak ditemukan
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Coba cari judul lain atau reset filter kamu.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
