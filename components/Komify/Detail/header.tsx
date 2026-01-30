"use client";

import Link from "next/link";
import { Upload, Bookmark, Home, ChevronRight, LayoutGrid } from "lucide-react";

interface UploadComicHeaderProps {
  defaultSlug: string;
}

export default function UploadComicHeader({
  defaultSlug,
}: UploadComicHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-xl">
      <div className="max-w-350 mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          <Link
            href="/komify"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-blue-500/50 transition-all">
              <Home size={14} />
            </div>
            <span className="hidden sm:inline">Komify</span>
          </Link>

          <ChevronRight size={14} className="text-zinc-700" />

          <div className="flex items-center gap-2 text-white max-w-37.5 md:max-w-75">
            <LayoutGrid size={14} className="text-blue-500 shrink-0" />
            <span className="font-bold truncate tracking-tight uppercase text-xs md:text-sm">
              {defaultSlug}
            </span>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/komify/bookmarks"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
            title="My Bookmarks"
          >
            <Bookmark className="w-4 h-4 text-yellow-500" />
            <span className="hidden md:inline">BOOKMARKS</span>
          </Link>

          <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

          <Link
            href="/komify/upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            title="Upload New Comic"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">UPLOAD NEW</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
