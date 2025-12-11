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
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 gap-6">
      {chapters.map((ch) => (
        <Link
          key={ch.number}
          href={`/reader/${slug}/${ch.number}`}
          className="
        w-full
        bg-slate-800 border border-slate-700 rounded-2xl p-6
        shadow-md hover:shadow-lg hover:border-blue-500
        hover:bg-slate-750 transition
      "
        >
          <div className="text-2xl font-bold text-blue-400 mb-2">
            Chapter {ch.number}
          </div>

          <div className="text-slate-300 text-base mb-2">{ch.title}</div>

          <div className="text-xs text-slate-500">
            {dayjs(ch.uploadChapter).fromNow()}
          </div>
        </Link>
      ))}
    </div>
  );

}
