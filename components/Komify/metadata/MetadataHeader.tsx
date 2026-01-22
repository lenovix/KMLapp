"use client";

import Link from "next/link";
import { Upload, Bookmark, Search, ChevronRight } from "lucide-react";

interface MetadataHeaderProps {
  title: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchPlaceholder?: string;
  showBookmark?: boolean;
  showUpload?: boolean;
}

export default function MetadataHeader({
  title,
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search in this metadata...",
  showBookmark = true,
  showUpload = true,
}: MetadataHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
            <Link
              href="/komify"
              className="text-zinc-500 hover:text-white transition-colors tracking-tight"
            >
              Komify
            </Link>
            <ChevronRight size={14} className="text-zinc-700" />
            <span className="bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent capitalize">
              {title}
            </span>
          </div>

          <div className="relative flex-1 max-w-xl group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            {showBookmark && (
              <Link
                href="/komify/bookmarks"
                className="flex items-center justify-center gap-2 p-3 md:px-4 md:py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl hover:bg-zinc-800 hover:text-white transition-all duration-300 shadow-lg"
                title="Bookmarks"
              >
                <Bookmark className="w-4 h-4 text-yellow-500" />
                <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">
                  Saved
                </span>
              </Link>
            )}

            {showUpload && (
              <Link
                href="/komify/upload"
                className="flex items-center justify-center gap-2 p-3 md:px-5 md:py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 shadow-lg"
                title="Upload Comic"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">
                  Upload
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
