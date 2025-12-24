"use client";

import { useState } from "react";
import Image from "next/image";

interface ReaderImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function ReaderImage({
  src,
  alt,
  priority = false,
}: ReaderImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-3xl">
      {/* Skeleton / Loader */}
      {!loaded && (
        <div
          className="
            absolute inset-0
            bg-slate-800/40
            animate-pulse
            rounded-lg
            flex items-center justify-center
          "
        >
          <span className="text-slate-400 text-sm">Loading page...</span>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={900}
        height={1300}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoadingComplete={() => setLoaded(true)}
        className={`
          w-full rounded-lg
          border border-slate-700 shadow-md
          transition-opacity duration-300
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
