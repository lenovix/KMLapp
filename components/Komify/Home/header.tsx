"use client";

import Link from "next/link";
import { Upload, ArrowLeft, Bookmark } from "lucide-react";
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
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 text-2xl font-bold text-gray-900 dark:text-white">
          <Link href="/" className="hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <Link href="/komify" className="hover:opacity-80">
            Komify
          </Link>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari komik..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        {/* Right */}
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

      {/* METADATA NAV */}
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
