"use client";

import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft } from "lucide-react";
dayjs.extend(relativeTime);

interface HeaderReadProps {
  comic: {
    slug: Number;
    title: string;
  };
  chapter: {
    number: string | number;
    title: string;
    language?: string;
    uploadChapter?: string;
  };
}

export default function HeaderRead({ comic, chapter }: HeaderReadProps) {
  return (
    <header className="mb-8 space-y-4">
      {/* Back + Title */}
      <div className="flex items-center justify-between">
        <Link
          href={`/komify/${comic.slug}`}
          className="
            inline-flex items-center gap-2
            px-3 py-2
            text-sm font-medium
            rounded-lg
            bg-slate-200 text-slate-700
            dark:bg-slate-700 dark:text-slate-200
            hover:bg-slate-300 dark:hover:bg-slate-600
            transition-all duration-200
          "
        >
          <span className="text-lg">
            <ArrowLeft className="w-6 h-6" />
          </span>
          {comic.title}
        </Link>

        <div className="text-right">
          <h1 className="text-xl font-bold leading-tight">{comic.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chapter {chapter.number} —{" "}
            <span className="font-medium">{chapter.title}</span>
          </p>
        </div>
      </div>

      {/* Info Chapter */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
        {/* Language */}
        <span className="bg-gray-200 dark:bg-slate-700 px-3 py-1 rounded-full">
          {chapter.language || "Unknown Language"}
        </span>

        {/* Uploaded */}
        {chapter.uploadChapter && (
          <span className="bg-gray-200 dark:bg-slate-700 px-3 py-1 rounded-full">
            Uploaded {dayjs(chapter.uploadChapter).fromNow()}
          </span>
        )}
      </div>
    </header>
  );
}
