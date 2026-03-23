"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bookmark, Plus, Search, User, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Cast } from "@/types/filmfy";

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
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
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
          c.name.toLowerCase().includes(q) ||
          (c.slug && c.slug.toLowerCase().includes(q)),
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((cast) =>
        cast.tags?.some((tag) => selectedTags.includes(tag)),
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full animate-bounce" />
          <p className="text-sm font-bold text-gray-500">Memuat Casts...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="sticky top-0 z-30 w-full bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/filmfy"
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                Casts
              </h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                Directory
              </p>
            </div>
          </div>

          <div className="hidden md:block relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama talent..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
        <div className="md:hidden relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama talent..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 py-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border-none text-sm"
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Kategori Talent
              </h2>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:underline uppercase"
                >
                  <X className="w-3 h-3" /> Clear Filter
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-90 ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500/20"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-blue-500"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredCasts.map((cast) => (
            <Link
              key={cast.slug}
              href={`/filmfy/cast/${cast.slug}`}
              className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-4xl p-3 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                {cast.avatar ? (
                  <Image
                    src={
                      cast.updatedAt
                        ? `${cast.avatar}?t=${new Date(cast.updatedAt).getTime()}`
                        : cast.avatar
                    }
                    alt={cast.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="pt-4 pb-2 px-2 text-center">
                <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {cast.name}
                </h3>
              </div>
            </Link>
          ))}
        </section>

        {filteredCasts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-4xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-white font-black text-lg">
              Cast tidak ditemukan
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedTags([]);
              }}
              className="mt-4 px-6 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-black text-xs hover:bg-blue-100 transition"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
