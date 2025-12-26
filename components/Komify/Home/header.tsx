"use client";

import Link from "next/link";
import { Upload, ArrowLeft, Bookmark, X } from "lucide-react";
import { metadataLinks } from "@/components/Komify/metadata/metadataLinks";

interface AllComicHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function AllComicHeader({
  searchTerm,
  setSearchTerm,
}: AllComicHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-2xl font-bold text-gray-900 dark:text-white">
          <Link href="/" className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <Link href="/komify" className="hover:opacity-80">
            Komify
          </Link>
        </div>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Cari komik..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         p-1 rounded-full
                         text-gray-500 hover:text-gray-800
                         dark:text-gray-400 dark:hover:text-white
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/komify/bookmarks"
            className="flex items-center gap-2 px-3 py-2
                       bg-yellow-500 text-black rounded-xl
                       hover:bg-yellow-400 transition text-sm font-medium"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Bookmarks</span>
          </Link>

          <Link
            href="/komify/upload"
            className="flex items-center gap-2 px-3 py-2
                       bg-blue-600 text-white rounded-xl
                       hover:bg-blue-500 transition text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </Link>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2">
        {metadataLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-4 py-2 rounded-xl text-sm font-medium
                       bg-slate-800/70 border border-slate-700
                       text-slate-200
                       hover:bg-slate-700 hover:border-blue-500/60
                       hover:text-blue-400 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
