"use client";

import Link from "next/link";
import { Bookmark, Plus, Search, ChevronRight, Home } from "lucide-react";

interface MetadataHeaderProps {
  director: string;
  query: string;
  title: string;
  setQuery: (value: string) => void;
}

export default function MetadataHeader({
  director,
  query,
  setQuery,
  title,
}: MetadataHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8fafc]/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 py-5 transition-all">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link
              href="/filmfy"
              className="hover:text-blue-500 transition-colors flex items-center gap-1"
            >
              <Home size={10} /> Filmfy
            </Link>
            <ChevronRight size={10} />
            <span className="text-slate-500 dark:text-slate-300">{title}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-500">#</span>
            {director}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search code or title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-64 pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm active:scale-90"
              href="/filmfy/favorite"
            >
              <Bookmark className="w-5 h-5" />
            </Link>
            <Link
              href="/filmfy/upload"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-[13px] font-black uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3px]" />
              <span className="hidden sm:inline">Add Entry</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
