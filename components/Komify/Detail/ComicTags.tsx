// components/Komify/Detail/ComicTags.tsx
"use client";

import Link from "next/link";

export default function ComicTags({ tags = [] }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {tags.map((tag, i) => (
        <Link
          key={i}
          href={`/tags/${encodeURIComponent(tag)}`}
          className="
          inline-flex items-center
          text-xs font-medium
          bg-blue-800/20 text-blue-400
          border border-blue-600
          px-3 py-1
          rounded-full
          shadow-sm
          hover:bg-blue-800/40
          hover:text-white
          transition
          duration-200
          cursor-pointer
        "
        >
          {tag}
        </Link>
      ))}
    </div>
  );

}
