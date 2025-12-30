"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Plus, Search } from "lucide-react";

interface FilmfyDirectorHeaderProps {
  director: string;
  query: string;
  title: string;
  setQuery: (value: string) => void;
}

export default function FilmfyDirectorHeader({
  director,
  query,
  setQuery,
  title,
}: FilmfyDirectorHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto px-4">
        {/* Left */}
        <div className="flex items-center gap-4">

          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            <Link href="/filmfy">Filmfy</Link> :: {title} :: {director}
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
              onChange={(e) => setQuery(e.target.value)}
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
  );
}
