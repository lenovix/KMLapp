"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import HeaderRead from "@/components/Komify/read/HeaderRead";
dayjs.extend(relativeTime);

export default function ReaderPage() {
  const params = useParams();
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
          `/api/komify/read?slug=${comic?.slug}&chapter=${chapter?.number}`
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
    <main className="px-4 py-6 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      <HeaderRead
        comic={{ slug: comic.slug, title: comic.title }}
        chapter={chapter}
      />

      <div className="sticky top-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-3 mb-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
        {prevChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${prevChapter.number}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            ← Chapter {prevChapter.number}
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${nextChapter.number}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Chapter {nextChapter.number} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex flex-col items-center gap-5">
        {pages.length > 0 ? (
          pages.map((filename, i) => (
            <img
              key={filename}
              src={`${imagePath}/${filename}`}
              alt={`Page ${i + 1}`}
              className="
              w-full max-w-3xl  shadow-md
              dark:shadow-black/50
              border border-gray-200 dark:border-slate-700
            "
            />
          ))
        ) : (
          <p className="text-gray-400 dark:text-gray-500 mt-10">
            Tidak ada halaman ditemukan.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-10 py-5 border-t border-gray-200 dark:border-slate-700">
        {prevChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${prevChapter.number}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            ← Chapter {prevChapter.number}
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link
            href={`/komify/${comic.slug}/read/${nextChapter.number}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
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
