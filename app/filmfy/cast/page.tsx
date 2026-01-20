"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Plus, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

interface Cast {
  slug: string;
  name: string;
  alias?: string;
  updatedAt?: string;
  createdAt?: string;
  avatar?: string;
  tags?: string[];
}

export default function CastPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();

    casts.forEach((cast) => {
      cast.tags?.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }, [casts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    fetch("/api/filmfy/cast")
      .then((res) => res.json())
      .then(setCasts)
      .finally(() => setLoading(false));
  }, []);

  const filteredCasts = useMemo(() => {
    let result = [...casts];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((cast) =>
        cast.tags?.some((tag) => selectedTags.includes(tag))
      );
    }

    return result.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      if (dateA !== dateB) {
        return dateB - dateA;
      }

      return a.name.localeCompare(b.name);
    });
  }, [casts, query, selectedTags]);

  if (loading) {
    return <p className="p-6">Loading cast...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Link
                href="/filmfy"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Casts
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari cast..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300
                  dark:border-gray-700 bg-white dark:bg-gray-800
                  text-sm text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                className="p-2 rounded-xl border border-gray-300 dark:border-gray-700
                bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Bookmark"
              >
                <Bookmark className="w-5 h-5 text-gray-700 dark:text-gray-200" />
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

        {allTags.length > 0 && (
          <div className="px-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Filter by tags
              </p>

              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`
                      inline-flex items-center gap-1
                      px-3 py-1.5 rounded-full text-xs font-medium
                      border transition-all duration-200
                      ${
                        active
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/30"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-6">
          {filteredCasts.length === 0 ? (
            <p className="text-gray-500">
              {query ? "Cast tidak ditemukan." : "Belum ada data cast."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredCasts.map((cast) => (
                <Link
                  key={cast.slug}
                  href={`/filmfy/cast/${cast.slug}`}
                  className="group border rounded-xl p-4 hover:shadow-lg transition"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {cast.avatar ? (
                      <img
                        src={cast.avatar}
                        alt={cast.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Avatar
                      </div>
                    )}
                  </div>

                  <h2 className="text-sm font-semibold text-center">
                    {cast.name}
                  </h2>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
