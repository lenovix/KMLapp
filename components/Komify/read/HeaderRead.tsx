"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Calendar, Globe2, BookOpen } from "lucide-react";

dayjs.extend(relativeTime);

interface HeaderReadProps {
  comic: {
    slug: string | number;
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
    <header className="sticky top-0 z-[60] w-full border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center min-w-0">
            <h1 className="text-sm font-black text-white uppercase tracking-tight truncate">
              {comic.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">
                CH {chapter.number}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 truncate max-w-[150px] sm:max-w-xs">
                {chapter.title}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Globe2 size={14} className="text-zinc-600" />
              {chapter.language || "EN"}
            </div>
            {chapter.uploadChapter && (
              <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-4">
                <Calendar size={14} className="text-zinc-600" />
                {dayjs(chapter.uploadChapter).fromNow()}
              </div>
            )}
          </div>

          <div className="md:hidden p-2 text-zinc-600">
            <BookOpen size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
