"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import comics from "@/data/komify/comics.json";
import HeaderRead from "@/components/Komify/read/HeaderRead";
import ReaderNav from "@/components/Komify/read/ReaderNav";
import SkeletonPages from "@/components/Komify/read/SkeletonPages";

type Params = {
  slug: string;
  chapterSlug: string;
};

export default function ReaderPage() {
  const { slug, chapterSlug } = useParams<Params>();

  const comic = useMemo(
    () => comics.find((c) => String(c.slug) === slug),
    [slug]
  );

  const chapter = useMemo(
    () => comic?.chapters.find((ch) => String(ch.number) === chapterSlug),
    [comic, chapterSlug]
  );

  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!comic || !chapter) return;

    setLoading(true);
    const controller = new AbortController();

    async function fetchPages() {
      try {
        const res = await fetch(
          `/api/komify/read?slug=${comic?.slug}&chapter=${chapter?.number}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setPages(data.pages ?? []);
      } catch {
        setPages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
    return () => controller.abort();
  }, [comic, chapter]);

  if (!comic || !chapter) {
    return <p className="p-6 text-gray-400">Komik / chapter tidak ditemukan</p>;
  }

  const imagePath = `/komify/${comic.slug}/chapters/${chapter.number}`;

  const chapterIndex = comic.chapters.findIndex(
    (ch) => ch.number === chapter.number
  );

  const prevChapter = comic.chapters[chapterIndex - 1] ?? null;
  const nextChapter = comic.chapters[chapterIndex + 1] ?? null;

  return (
    <main className="px-4 py-6 max-w-5xl mx-auto">
      <HeaderRead
        comic={{ slug: comic.slug, title: comic.title }}
        chapter={chapter}
      />

      <ReaderNav comic={comic} prev={prevChapter} next={nextChapter} />

      <div className="flex flex-col items-center gap-6">
        {loading && <SkeletonPages />}

        {!loading &&
          pages.map((filename, i) => (
            <Image
              key={filename}
              src={`${imagePath}/${filename}`}
              alt={`Page ${i + 1}`}
              width={900}
              height={1300}
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="
                w-full max-w-3xl
                rounded-lg
                border border-slate-700
                shadow-md
              "
            />
          ))}
      </div>

      <ReaderNav comic={comic} prev={prevChapter} next={nextChapter} />
    </main>
  );
}
