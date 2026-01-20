"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Bookmark, Search, Users } from "lucide-react";
import filmsData from "@/data/filmfy/films.json";
import { Film } from "@/types/filmfy";

export default function FilmfyPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filterDeleted, setFilterDeleted] = useState<string>("all");
  const [filterCensored, setFilterCensored] = useState<string>("all");

  const PAGE_SIZE = 15;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const sortedAndFilteredFilms = useMemo(() => {
    const films: Film[] = Array.isArray(filmsData) ? (filmsData as Film[]) : [];

    const sorted = [...films].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sorted.filter((film) => {
      const matchesQuery =
        film.title.toLowerCase().includes(query.toLowerCase()) ||
        film.code.toLowerCase().includes(query.toLowerCase());

      const matchesDelete =
        filterDeleted === "all"
          ? true
          : filterDeleted === "deleted"
          ? film.isDeleted === true
          : film.isDeleted === false;

      const matchesCensored =
        filterCensored === "all" ? true : film.cencored === filterCensored;

      return matchesQuery && matchesDelete && matchesCensored;
    });
  }, [query, filterDeleted, filterCensored]);

  const totalPages = Math.ceil(sortedAndFilteredFilms.length / PAGE_SIZE);
  const paginatedFilms = sortedAndFilteredFilms.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-30 w-full bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                Filmfy
              </h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                Library
              </p>
            </div>
          </div>

          <div className="hidden md:block relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau kode film..."
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/filmfy/favorite"
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 transition shadow-sm"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
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
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link
              href="/filmfy/cast"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-blue-500 transition shadow-sm"
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>Casts</span>
            </Link>

            <div className="flex gap-2 flex-1 md:flex-none">
              <select
                value={filterDeleted}
                onChange={(e) => {
                  setFilterDeleted(e.target.value);
                  setPage(1);
                }}
                className="flex-1 md:w-32 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border-none shadow-sm text-xs font-bold outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="deleted">Deleted</option>
              </select>

              <select
                value={filterCensored}
                onChange={(e) => {
                  setFilterCensored(e.target.value);
                  setPage(1);
                }}
                className="flex-1 md:w-32 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border-none shadow-sm text-xs font-bold outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <option value="all">Censored: All</option>
                <option value="Cencored">Censored</option>
                <option value="Uncencored">Uncensored</option>
              </select>
            </div>
          </div>

          <div className="md:hidden w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari film..."
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 py-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border-none text-sm"
            />
          </div>
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {paginatedFilms.map((film) => (
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
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                  {film.isDeleted && (
                    <span className="px-2 py-0.5 bg-red-600 text-[8px] font-black text-white rounded uppercase tracking-tighter shadow-lg">
                      Deleted
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 ${
                      film.cencored === "Cencored"
                        ? "bg-orange-500"
                        : "bg-blue-600"
                    } text-[8px] font-black text-white rounded uppercase tracking-tighter shadow-lg`}
                  >
                    {film.cencored}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-linear-to-b from-transparent to-white dark:to-gray-800">
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
                  {film.code}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {film.title}
                </h3>
              </div>
            </Link>
          ))}
        </section>

        {paginatedFilms.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <Search className="w-12 h-12 text-gray-300 mx-auto" />
              <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
            </div>

            <p className="text-gray-900 dark:text-white font-black text-lg">
              Film tidak ditemukan
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Coba ubah kata kunci atau filter yang kamu gunakan.
            </p>

            <button
              onClick={() => {
                setQuery("");
                setFilterDeleted("all");
                setFilterCensored("all");
                setPage(1);
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-black hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95 border border-blue-100 dark:border-blue-800"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-8">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 active:scale-90 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    page === i + 1
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 active:scale-90 transition rotate-180"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
