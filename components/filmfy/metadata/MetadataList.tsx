"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Plus, Search } from "lucide-react";

interface Film {
  id: number;
  director?: string | null;
  maker?: string | null;
  label?: string | null;
  series?: string | null;
}

interface MetadataListProps {
  title: string;
  field: "director" | "maker" | "label" | "series";
  linkPrefix: string;
}

export default function MetadataList({
  title,
  field,
  linkPrefix,
}: MetadataListProps) {
  const [films, setFilms] = useState<Film[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/filmfy/films")
      .then((res) => res.json())
      .then(setFilms);
  }, []);

  const items = useMemo(() => {
    const set = new Set<string>();

    films.forEach((film) => {
      const value = film[field];
      if (value && value.trim()) {
        set.add(value);
      }
    });

    return Array.from(set).sort();
  }, [films, field]);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/filmfy"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Cari ${title.toLowerCase()}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border
                  border-gray-300 dark:border-gray-700
                  bg-white dark:bg-gray-800
                  text-sm text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                className="p-2 rounded-xl border border-gray-300 dark:border-gray-700
                bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Bookmark"
              >
                <Bookmark className="w-5 h-5" />
              </button>

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

        {filteredItems.length === 0 ? (
          <p className="text-gray-500">
            Data {title.toLowerCase()} tidak ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Link
                key={item}
                href={`${linkPrefix}/${encodeURIComponent(item)}`}
                className="border rounded-xl px-4 py-3
                bg-white dark:bg-gray-800
                hover:shadow transition text-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
