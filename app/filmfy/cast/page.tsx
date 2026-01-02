"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Plus, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

interface Cast {
  slug: string;
  name: string;
  alias?: string;
  birthDate?: string;
  debutReason?: string;
  debutStart?: string;
  debutEnd?: string;
  description?: string;
  avatar?: string;
}

export default function CastPage() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/filmfy/cast")
      .then((res) => res.json())
      .then(setCasts)
      .finally(() => setLoading(false));
  }, []);

  const filteredCasts = useMemo(() => {
    if (!query) return casts;
    const q = query.toLowerCase();
    return casts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [casts, query]);

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
