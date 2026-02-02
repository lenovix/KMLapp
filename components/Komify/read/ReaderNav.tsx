"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

interface Chapter {
  number: string | number;
}

interface Comic {
  slug: number | string;
}

interface ReaderNavProps {
  comic: Comic;
  prev: Chapter | null;
  next: Chapter | null;
}

export default function ReaderNav({ comic, prev, next }: ReaderNavProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-y border-white/5 bg-zinc-900/30 rounded-4xl px-6 backdrop-blur-sm">
      <div className="w-full sm:w-1/3 flex justify-start">
        {prev ? (
          <Link
            href={`/komify/${comic.slug}/read/${prev.number}`}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
              <ChevronLeft
                size={20}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Previous
              </span>
              <span className="text-sm font-bold tracking-tight">
                Chapter {prev.number}
              </span>
            </div>
          </Link>
        ) : (
          <div className="opacity-20 flex items-center gap-3 grayscale cursor-not-allowed">
            <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
              <ChevronLeft size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Start of Comic
            </span>
          </div>
        )}
      </div>

      <Link
        href={`/komify/${comic.slug}`}
        className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-2xl transition-all shadow-xl border border-zinc-700/50 group"
        title="Back to Chapter List"
      >
        <LayoutGrid
          size={20}
          className="group-hover:rotate-90 transition-transform duration-500"
        />
      </Link>

      <div className="w-full sm:w-1/3 flex justify-end">
        {next ? (
          <Link
            href={`/komify/${comic.slug}/read/${next.number}`}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all text-right"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Next Up
              </span>
              <span className="text-sm font-bold tracking-tight text-blue-400">
                Chapter {next.number}
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/20 group-hover:bg-blue-500 group-hover:scale-110 transition-all">
              <ChevronRight
                size={20}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </Link>
        ) : (
          <div className="opacity-20 flex items-center gap-3 grayscale cursor-not-allowed text-right">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Completed
              </span>
              <span className="text-sm font-bold tracking-tight">
                End of Comic
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
              <ChevronRight size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
