"use client";

import Link from "next/link";
import { ArrowLeft, Upload, RotateCcw } from "lucide-react";

interface UploadComicHeaderProps {
  defaulftSlug: number;
  onReset: () => void;
  onPublish: () => void;
}

export default function UploadComicHeader({
  defaulftSlug,
  onReset,
  onPublish,
}: UploadComicHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 backdrop-blur-xl bg-zinc-950/80">
      <div className="mx-auto px-4 md:px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/komify"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-all bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">CANCEL</span>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4 font-medium">
            <span className="bg-blue-500/10 text-blue-400 text-sm px-2 py-1 rounded font-bold tracking-tighter border border-blue-500/20">
              SLUG #{defaulftSlug}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-red-400 transition-all text-xs font-bold hover:bg-red-500/10 rounded-xl"
          >
            <RotateCcw size={16} />
            <span className="hidden md:inline">RESET</span>
          </button>

          <button
            type="submit"
            form="comic-upload-form"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            <Upload size={16} />
            PUBLISH
          </button>
        </div>
      </div>
    </header>
  );
}
