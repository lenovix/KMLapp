"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  filmId: number;
}

export default function FilmfyPlayer({ src, filmId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const storageKey = `filmfy-progress-${filmId}-${src}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      video.currentTime = Number(savedTime);
    }

    const saveTime = () => {
      localStorage.setItem(storageKey, String(video.currentTime));
    };

    video.addEventListener("timeupdate", saveTime);
    return () => video.removeEventListener("timeupdate", saveTime);
  }, [storageKey]);

  return (
    <video
      ref={videoRef}
      controls
      preload="metadata"
      className="w-full rounded-xl bg-black border"
    >
      <source src={src} type="video/mp4" />
      Browser tidak mendukung video.
    </video>
  );
}
