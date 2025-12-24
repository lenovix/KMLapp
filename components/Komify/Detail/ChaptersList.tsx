"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { Pencil, Trash } from "lucide-react";

const LANGUAGE_FLAG_MAP: Record<string, { label: string; flag: string }> = {
  English: { label: "English", flag: "🇺🇸" },
  Japanese: { label: "Japanese", flag: "🇯🇵" },
  Chinese: { label: "Chinese", flag: "🇨🇳" },
  Indonesia: { label: "Indonesia", flag: "🇮🇩" },
  Korean: { label: "Korean", flag: "🇰🇷" },
};

const getLanguageMeta = (lang?: string) =>
  LANGUAGE_FLAG_MAP[lang ?? ""] ?? {
    label: lang ?? "Unknown",
    flag: "🏳️",
  };

const getCencoredMeta = (value?: string) => {
  if (value?.toLowerCase() === "uncensored") {
    return {
      label: "Uncensored",
      className:
        "bg-emerald-600/20 text-emerald-400 border border-emerald-600/40",
    };
  }

  return {
    label: "Cencored",
    className: "bg-red-600/20 text-red-400 border border-red-600/40",
  };
};

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
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {chapters.map((ch) => {
        const langMeta = getLanguageMeta(ch.language);

        return (
          <div
            key={ch.number}
            className="
              bg-slate-800 border border-slate-700 rounded-xl p-5
              hover:border-blue-500 hover:bg-slate-750
              transition shadow-sm hover:shadow-md
            "
          >
            <Link href={`/komify/${slug}/read/${ch.number}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="text-xl font-bold text-blue-400">
                  Chapter {ch.number}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className="
                      inline-flex items-center gap-1
                      px-2 py-0.5
                      rounded-full
                      bg-slate-700/70
                      text-slate-200
                      border border-slate-600
                    "
                  >
                    <span className="text-sm">{langMeta.flag}</span>
                    {langMeta.label}
                  </span>

                  {(() => {
                    const cMeta = getCencoredMeta(ch.cencored);
                    return (
                      <span
                        className={`
                          inline-flex items-center
                          px-2 py-0.5
                          rounded-full
                          text-xs font-medium
                          ${cMeta.className}
                        `}
                      >
                        {cMeta.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="text-slate-200 text-base font-medium mb-3 line-clamp-2">
                {ch.title}
              </div>
            </Link>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{dayjs(ch.uploadChapter).fromNow()}</span>

              <div className="flex gap-2">
                <Link
                  href={`/komify/edit-chapter?slug=${slug}&chapter=${ch.number}`}
                  className="
                    inline-flex items-center gap-1 px-2.5 py-1
                    rounded-md bg-blue-600/80 hover:bg-blue-600
                    text-white transition
                  "
                >
                  <Pencil size={14} />
                  Edit
                </Link>

                <button
                  onClick={() => onDeleteChapter && onDeleteChapter(ch.number)}
                  className="
                    inline-flex items-center gap-1 px-2.5 py-1
                    rounded-md bg-red-600/80 hover:bg-red-600
                    text-white transition
                  "
                >
                  <Trash size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
