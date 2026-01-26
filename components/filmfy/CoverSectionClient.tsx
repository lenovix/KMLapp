"use client";

import { useState } from "react";
import Image from "next/image";
import { Film as FilmIcon, Maximize2 } from "lucide-react";
import CoverViewer from "./CoverViewer";

export default function CoverSectionClient({
  cover,
  title,
  code,
  createdAt,
}: any) {
  const [showViewer, setShowViewer] = useState(false);

  const coverSrc = cover ? `${cover}?t=${new Date(createdAt).getTime()}` : null;

  return (
    <>
      <div
        onClick={() => cover && setShowViewer(true)}
        className="group relative aspect-2/3 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 cursor-pointer"
      >
        {cover ? (
          <>
            <Image
              src={coverSrc!}
              alt={title}
              fill
              className="object-cover transition duration-500 group-hover:scale-110"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <Maximize2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <FilmIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {showViewer && (
        <CoverViewer
          code={code}
          coverUrl={coverSrc!}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
}
