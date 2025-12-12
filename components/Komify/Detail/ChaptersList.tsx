"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";

export default function ChaptersList({
  slug,
  chapters,
  onDeleteChapter,
}: {
  slug: number;
  chapters: any[];
  onDeleteChapter?: (chapterNumber: number) => void;
}) {
  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 gap-6">
      {chapters.map((ch) => (
        <div
          key={ch.number}
          className="
            relative w-full bg-slate-800 border border-slate-700 rounded-2xl p-6
            shadow-md hover:shadow-lg hover:border-blue-500
            hover:bg-slate-750 transition
          "
        >
          {/* Edit + Delete Buttons */}
          <div className="absolute top-4 right-4 flex gap-3">
            <Link
              href={`/komify/${slug}/edit-chapter/${ch.number}`}
              className="
                flex items-center gap-1 px-3 py-1 text-xs font-semibold 
                bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                transition shadow
              "
            >
              <Pencil size={14} />
              Edit
            </Link>

            <button
              onClick={() => onDeleteChapter && onDeleteChapter(ch.number)}
              className="
                flex items-center gap-1 px-3 py-1 text-xs font-semibold 
                bg-red-600 hover:bg-red-700 text-white rounded-lg 
                transition shadow
              "
            >
              <Trash size={14} />
              Delete
            </button>
          </div>

          <Link href={`/komify/${slug}/read/${ch.number}`}>
            <div className="text-2xl font-bold text-blue-400 mb-2">
              Chapter {ch.number}
            </div>

            <div className="text-slate-300 text-base mb-2">{ch.title}</div>

            <div className="text-xs text-slate-500">
              {dayjs(ch.uploadChapter).fromNow()}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
