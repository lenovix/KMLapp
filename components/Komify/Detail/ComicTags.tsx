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
          className="text-xs bg-blue-900/30 text-blue-300 border border-blue-800 
             px-2 py-1 rounded-full shadow-sm hover:bg-blue-900/50 transition"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
