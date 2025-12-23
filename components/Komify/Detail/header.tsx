"use client";

import Link from "next/link";
import { Upload, Bookmark } from "lucide-react";

interface UploadComicHeaderProps {
  defaulftSlug: string;
}

export default function UploadComicHeader({
  defaulftSlug,
}: UploadComicHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-2xl font-bold text-gray-900 dark:text-white">
          <p>
            <Link href="/komify" className="hover:opacity-80">
              Komify
            </Link>
            <span> :: {defaulftSlug}</span>
          </p>
        </div>
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
