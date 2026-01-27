"use client";

import Image from "next/image";
import { ImageIcon, X, UploadCloud } from "lucide-react";

interface ComicCoverProps {
  cover: string | null;
  onClick: () => void;
  onDelete: () => void;
}

export default function ComicCover({
  cover,
  onClick,
  onDelete,
}: ComicCoverProps) {
  return (
    <div
      className={`
        relative w-full aspect-video rounded-2xl border-2 border-dashed 
        transition-all duration-300 group overflow-hidden cursor-pointer
        ${
          cover
            ? "border-zinc-800 bg-zinc-900"
            : "border-zinc-800 bg-zinc-950/50 hover:border-blue-500/50 hover:bg-blue-500/5"
        }
      `}
      onClick={onClick}
    >
      {cover ? (
        <>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <UploadCloud className="text-white" size={24} />
            </div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest">
              Change Cover
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg transition-transform hover:scale-110 active:scale-90 z-30"
            title="Delete Cover"
          >
            <X size={16} />
          </button>

          <Image
            src={cover}
            alt="Comic Cover Preview"
            fill
            unoptimized
            className="object-cover z-10"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <ImageIcon
              className="text-zinc-600 group-hover:text-blue-500"
              size={32}
            />
          </div>
          <div>
            <p className="text-zinc-400 text-sm font-semibold">Upload Cover</p>
            <p className="text-zinc-600 text-[10px] mt-1">
              Recommended 3:4 ratio
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
