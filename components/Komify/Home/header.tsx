"use client";

import Link from "next/link";
import { Upload, ArrowLeft, Bookmark, X, Search } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700/50 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-white" />
          </Link>
          <Link
            href="/komify"
            className="text-2xl font-black tracking-tighter text-white hover:text-blue-500 transition-colors"
          >
            KOMIFY<span className="text-blue-500">.</span>
          </Link>
        </div>

        <div className="relative w-full max-w-lg group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Cari judul, author, atau genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 
                       text-sm text-white pl-10 pr-10 py-2.5 rounded-2xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                       transition-all placeholder:text-zinc-600"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md
                         text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/komify/bookmarks"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 
                       text-zinc-100 rounded-2xl border border-zinc-700 transition text-sm font-semibold"
          >
            <Bookmark className="w-4 h-4 text-yellow-500" />
            <span className="hidden lg:inline">Bookmarks</span>
          </Link>

          <Link
            href="/komify/upload"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 
                       text-white rounded-2xl shadow-lg shadow-blue-900/20 transition text-sm font-semibold"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden lg:inline">Upload</span>
          </Link>
        </div>
      </div>

      <nav className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {metadataLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest
                       bg-zinc-900/40 border border-zinc-800 text-zinc-400
                       hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <hr className="border-zinc-800/50" />
    </div>
  );
}
