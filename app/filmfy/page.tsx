"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Bookmark, Search } from "lucide-react";
import filmsData from "@/data/filmfy/films.json";
import { useState } from "react";

interface FilmItem {
  id: number;
  code: string;
  title: string;
  cover: string | null;
}

export default function FilmfyPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetPage = () => setPage(1);

  const onSearchChange = (value: string) => {
    setQuery(value);
    resetPage();
  };

  const films: FilmItem[] = Array.isArray(filmsData) ? filmsData : [];

  const filteredFilms = films.filter(
    (film) =>
      film.title.toLowerCase().includes(query.toLowerCase()) ||
      film.code.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFilms.length / PAGE_SIZE);
  const paginatedFilms = filteredFilms.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto">
            {/* Left */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Filmfy
              </h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari film / kode..."
                  value={query}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300
            dark:border-gray-700 bg-white dark:bg-gray-800
            text-sm text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bookmark */}
              <button
                className="p-2 rounded-xl border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Bookmark"
              >
                <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>

              {/* Add */}
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

        {/* Film List */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {paginatedFilms.map((film) => (
            <Link
              key={film.id}
              href={`/filmfy/${film.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl
                border border-gray-200 dark:border-gray-700
                overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <div className="relative aspect-3/2 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={film.cover ?? "/img/placeholder.png"}
                  alt={film.title}
                  fill
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="p-3 space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {film.code}
                </p>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {film.title}
                </h3>
              </div>
            </Link>
          ))}

          {paginatedFilms.length === 0 && (
            <p className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400">
              Film tidak ditemukan
            </p>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-1.5 rounded-lg text-sm border
                border-gray-300 dark:border-gray-700
                disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-sm border
                  ${
                    page === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-1.5 rounded-lg text-sm border
                border-gray-300 dark:border-gray-700
                disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
