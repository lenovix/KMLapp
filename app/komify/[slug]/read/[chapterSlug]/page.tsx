"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface ComicData {
  slug: string;
  title: string;
  author: string[];
  artist: string[];
  groups: string[];
  parodies: string[];
  characters: string[];
  categories: string[];
  tags: string[];
  uploaded: string;
  status: "Ongoing" | "Completed" | "Hiatus";
  cover: string;
}

export default function ReaderPage() {
  const params = useParams(); // { slug: "1", chapterSlug: "001" }
  const { slug, chapterSlug } = params;

  const comic = comics.find((c) => String(c.slug) === slug);
  const chapter = comic?.chapters.find(
    (ch) => String(ch.number) === chapterSlug
  );

  const [pages, setPages] = useState<string[]>([]);

  if (!comic)
    return (
      <p className="p-6 text-gray-500 dark:text-gray-300">
        Komik tidak ditemukan.
      </p>
    );
  if (!chapter)
    return (
      <p className="p-6 text-gray-500 dark:text-gray-300">
        Chapter tidak ditemukan.
      </p>
    );

  useEffect(() => {
    if (!comic || !chapter) return;

    async function fetchPages() {
      try {
        const res = await fetch(
          `/api/read?slug=${comic?.slug}&chapter=${chapter?.number}`
        );
        if (res.ok) {
          const data = await res.json();
          setPages(data.pages || []);
        }
      } catch {
        setPages([]);
      }
    }

    fetchPages();
  }, [comic, chapter]);

  const imagePath = `/komify/${comic.slug}/chapters/${chapter.number}`;

  const chapterIndex = comic.chapters.findIndex(
    (ch) => ch.number === chapter.number
  );
  const prevChapter =
    chapterIndex > 0 ? comic.chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < comic.chapters.length - 1
      ? comic.chapters[chapterIndex + 1]
      : null;

  return (
    <main className="px-4 py-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href={`/komify/${comic.slug}`}
          className="text-sm text-blue-600 dark:text-amber-400 hover:underline"
        >
          ← Back to {comic.title}
        </Link>
      </div>

      {/* Header Komik */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">
          {comic.title} - Chapter {chapter.number}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            {chapter.language || "Unknown"}
          </span>
          {chapter.uploadChapter && (
            <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
              Uploaded {dayjs(chapter.uploadChapter).fromNow()}
            </span>
          )}
        </div>
      </div>

      {/* Navigasi Chapter - atas */}
      <div className="flex justify-between items-center mb-6">
        {prevChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${prevChapter.number}`}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            ← Chapter {prevChapter.number}
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${nextChapter.number}`}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            Chapter {nextChapter.number} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Gambar Halaman */}
      <div className="flex flex-col items-center gap-4">
        {pages.length > 0 ? (
          pages.map((filename, i) => (
            <img
              key={filename}
              src={`${imagePath}/${filename}`}
              alt={`Page ${i + 1}`}
              className="w-full max-w-2xl rounded shadow dark:shadow-gray-800"
            />
          ))
        ) : (
          <p className="text-gray-400 dark:text-gray-500">
            Tidak ada halaman ditemukan.
          </p>
        )}
      </div>

      {/* Navigasi Chapter - bawah */}
      <div className="flex justify-between items-center mt-8">
        {prevChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${prevChapter.number}`}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            ← Chapter {prevChapter.number}
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${nextChapter.number}`}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            Chapter {nextChapter.number} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </main>
  );
}
