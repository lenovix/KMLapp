"use client";

import Link from "next/link";
import { Upload, ArrowLeft } from "lucide-react";

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
          <Link href="/" className="flex items-center gap-1 hover:opacity-80">
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <Link href="/komify" className="hover:opacity-80">
            Komify
          </Link>
        </div>
        <input
          type="text"
          placeholder="Cari komik..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
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
  );
}
