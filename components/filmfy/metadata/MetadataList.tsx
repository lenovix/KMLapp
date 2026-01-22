"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Search,
  Tag,
  ChevronRight,
} from "lucide-react";

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

  const itemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    films.forEach((film) => {
      const value = film[field];
      if (value && value.trim()) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  }, [films, field]);

  const items = useMemo(() => {
    return Object.keys(itemCounts).sort();
  }, [itemCounts]);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="sticky top-0 z-30 py-4 -mx-4 px-4 bg-[#f8fafc]/80 dark:bg-[#0f172a]/80 backdrop-blur-xl transition-all">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Link
                href="/filmfy"
                className="group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-all shadow-sm active:scale-90"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {title}
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Collection Directory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full md:w-72 pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <Link
                href="/filmfy/upload"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New</span>
              </Link>
            </div>
          </div>
        </header>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800/50 mb-4">
              <Tag className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium">
              No results found for "{query}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredItems.map((item) => (
              <Link
                key={item}
                href={`${linkPrefix}/${encodeURIComponent(item)}`}
                className="group relative flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
              >
                <Tag className="absolute -right-2 -bottom-2 w-16 h-16 text-slate-50 dark:text-slate-800/50 group-hover:text-blue-50 dark:group-hover:text-blue-900/10 transition-colors duration-500" />

                <div className="relative z-10">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {item}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {itemCounts[item]} {itemCounts[item] > 1 ? "Films" : "Film"}
                  </p>
                </div>

                <div className="relative z-10 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
