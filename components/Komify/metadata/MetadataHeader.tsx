"use client";

import Link from "next/link";
import { Upload, Bookmark, ArrowLeft } from "lucide-react";

interface MetadataHeaderProps {
  /** Judul halaman, contoh: "Parodies", "Characters" */
  title: string;

  /** Search state */
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  /** Placeholder input search */
  searchPlaceholder?: string;

  /** Tampilkan tombol bookmark */
  showBookmark?: boolean;

  /** Tampilkan tombol upload */
  showUpload?: boolean;
}

export default function MetadataHeader({
  title,
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Cari...",
  showBookmark = true,
  showUpload = true,
}: MetadataHeaderProps) {
  return (
    <header className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-white">
            <Link href="/komify" className="hover:opacity-80">
              Komify
            </Link>
            <span className="text-blue-400">{title}</span>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:max-w-md px-4 py-2 rounded-xl
                       border border-slate-700 bg-slate-900
                       text-slate-200 placeholder-slate-400
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500 transition"
          />

          {/* Right */}
          <div className="flex items-center gap-3">
            {showBookmark && (
              <Link
                href="/komify/bookmarks"
                className="flex items-center gap-2 px-3 py-2
                           bg-yellow-500 text-black rounded-xl
                           hover:bg-yellow-400 transition text-sm font-medium"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Bookmarks</span>
              </Link>
            )}

            {showUpload && (
              <Link
                href="/komify/upload"
                className="flex items-center gap-2 px-3 py-2
                           bg-blue-600 text-white rounded-xl
                           hover:bg-blue-500 transition text-sm font-medium"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
