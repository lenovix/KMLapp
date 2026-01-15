"use client";

import dynamic from "next/dynamic";

const FilmfyPlayer = dynamic(() => import("./FilmfyPlayer"), { ssr: false });

interface Props {
  src: string;
  filmId: number;
  // subtitleSrc?: string;
}

export default function FilmfyPlayerClient({
  src,
  filmId,
}: // subtitleSrc
Props) {
  return (
    <FilmfyPlayer
      src={src}
      filmId={filmId}
      // subtitleSrc={subtitleSrc}
    />
  );
}
