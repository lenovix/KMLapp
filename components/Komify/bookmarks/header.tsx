"use client";

import Link from "next/link";
import { Upload, ArrowLeft, Bookmark } from "lucide-react";

interface AllComicHeaderProps {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
}

export default function AllComicHeader({
  searchTerm,
  setSearchTerm,
}: AllComicHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Link
            href="/komify"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="sr-only">Back</span>
          </Link>

          <h1 className="text-3xl font-bold">
            My Bookmarks
          </h1>
        </div>

        {/* Right section (Bookmark + Upload) */}
        <div className="flex items-center gap-3">
          {/* Bookmark */}
          <Link
            href="/komify/bookmarks"
            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            title="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
            <span>My Bookmarks</span>
          </Link>

          {/* Upload */}
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
