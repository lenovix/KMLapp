"use client";

import Link from "next/link";
import { Upload, LayoutGrid } from "lucide-react";

export default function AllComicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Bookmarks
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold hidden sm:block">
                Your Personal Library
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/komify"
              className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white transition text-sm font-medium rounded-xl hover:bg-zinc-800/50"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Browse</span>
            </Link>

            <Link
              href="/komify/upload"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-black rounded-xl transition text-sm font-bold shadow-lg shadow-white/5"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
