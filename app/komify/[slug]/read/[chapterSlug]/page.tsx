"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import comicsData from "@/data/komify/comics.json";
import HeaderRead from "@/components/Komify/read/HeaderRead";
import ReaderNav from "@/components/Komify/read/ReaderNav";
import SkeletonPages from "@/components/Komify/read/SkeletonPages";
import ReaderImage from "@/components/Komify/read/ReaderImage";

interface Chapter {
  number: string | number;
  title: string;
}

interface Comic {
  slug: string | number;
  title: string;
  chapters: Chapter[];
}

const comics = comicsData as Comic[];

type Params = {
  slug: string;
  chapterSlug: string;
};

export default function ReaderPage() {
  const { slug, chapterSlug } = useParams<Params>();
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const comic = useMemo(
    () => comics.find((c: Comic) => String(c.slug) === slug),
    [slug],
  );

  const chapter = useMemo(
    () =>
      comic?.chapters.find((ch: Chapter) => String(ch.number) === chapterSlug),
    [comic, chapterSlug],
  );

  useEffect(() => {
    if (!comic || !chapter) return;

    setLoading(true);
    const controller = new AbortController();

    async function fetchPages() {
      try {
        const res = await fetch(
          `/api/komify/read?slug=${comic?.slug}&chapter=${chapter?.number}`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setPages(data.pages ?? []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") setPages([]);
        }
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    fetchPages();
    return () => controller.abort();
  }, [comic, chapter]);

  if (!comic || !chapter) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-500">
        <p className="font-black uppercase tracking-widest text-sm">
          Komik / Chapter Tidak Ditemukan
        </p>
      </div>
    );
  }

  const imagePath = `/komify/${comic.slug}/chapters/${chapter.number}`;

  const chapterIndex = comic.chapters.findIndex(
    (ch: Chapter) => String(ch.number) === String(chapter.number),
  );

  const prevChapter = comic.chapters[chapterIndex - 1] ?? null;
  const nextChapter = comic.chapters[chapterIndex + 1] ?? null;

  return (
    <main className=" text-zinc-100">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-100"
        style={{ scaleX }}
      />
      <div className="sticky top-0 z-50 transition-transform duration-300">
        <HeaderRead
          comic={{ slug: comic.slug, title: comic.title }}
          chapter={chapter}
        />
      </div>
      <div className="max-w-4xl mx-auto px-0 sm:px-4 py-8">
        <div className="mb-10 px-4">
          <ReaderNav comic={comic} prev={prevChapter} next={nextChapter} />
        </div>
        <div className="flex flex-col items-center bg-zinc-900/20 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          {loading ? (
            <SkeletonPages />
          ) : (
            <div className="w-full flex flex-col items-center gap-4 sm:gap-8">
              {pages.map((filename, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "200px" }}
                  key={filename}
                  className="w-full"
                >
                  <ReaderImage
                    src={`${imagePath}/${filename}`}
                    alt={`Halaman ${i + 1}`}
                    priority={i < 2}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-12 mb-20 px-4">
          <div className="flex flex-col items-center gap-6">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
              Akhir dari Chapter {chapter.number}
            </p>
            <ReaderNav comic={comic} prev={prevChapter} next={nextChapter} />
          </div>
        </div>
      </div>
    </main>
  );
}
