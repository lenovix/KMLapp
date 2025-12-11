// components/Komify/Detail/ChaptersList.tsx
"use client";

import Link from "next/link";
import dayjs from "dayjs";

export default function ChaptersList({
  slug,
  chapters,
}: {
  slug: number;
  chapters: any[];
}) {
  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {chapters.map((ch) => (
        <Link
          key={ch.number}
          href={`/reader/${slug}/${ch.number}`}
          className="
            bg-slate-800 border border-slate-700 rounded-2xl p-5
            shadow-sm hover:shadow-md hover:border-blue-500 
            hover:bg-slate-750 transition"
        >
          <div className="text-xl font-semibold text-blue-400 mb-1">
            Chapter {ch.number}
          </div>

          <div className="text-slate-300 text-sm">{ch.title}</div>

          <div className="text-xs text-slate-500 mt-4">
            {dayjs(ch.uploadChapter).fromNow()}
          </div>
        </Link>
      ))}
    </div>
  );
}
