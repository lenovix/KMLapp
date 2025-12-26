"use client";

import dynamic from "next/dynamic";

const FilmfyPlayer = dynamic(() => import("./FilmfyPlayer"), { ssr: false });

interface Props {
  src: string;
  filmId: number;
}

export default function FilmfyPlayerClient({ src, filmId }: Props) {
  return <FilmfyPlayer src={src} filmId={filmId} />;
}
