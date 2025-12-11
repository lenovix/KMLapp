"use client";

import Link from "next/link";

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
      </div>
    </div>
  );
}
