"use client";

import Link from "next/link";
import { ChevronRight, LayoutGrid, ArrowLeft } from "lucide-react";

interface UploadComicHeaderProps {
  defaulftSlug: number;
}

export default function UploadComicHeader({
  defaulftSlug,
}: UploadComicHeaderProps) {
  return (
    <header className="sticky top-0 z-[40] w-full border-b border-zinc-800 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          href="/komify"
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-all bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">CANCEL</span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-4 text-sm font-medium">
          <div className="flex items-center gap-2 text-zinc-500">
            <LayoutGrid size={14} />
            <span className="hidden md:inline font-semibold">Upload</span>
          </div>

          <ChevronRight size={14} className="text-zinc-700" />

          <div className="flex items-center gap-2">
            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-tighter border border-blue-500/20">
              SLUG #{defaulftSlug}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
