"use client";

import Link from "next/link";
import { Upload, Bookmark } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-2xl font-bold text-gray-900 dark:text-white">
          <Link href="/komify" className="hover:opacity-80">
            Komify
          </Link>
        </div>

        <input
          type="text"
          placeholder="Cari komik..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg
               focus:outline-none focus:ring-2 focus:ring-blue-500
               dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />

        <div className="flex items-center gap-3">
          <Link
            href="/komify/bookmarks"
            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            title="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
            <span>My Bookmarks</span>
          </Link>
          <Link
            href="/komify/upload"
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            title="Upload"
          >
            <Upload size={20} />
            <span>Upload</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
