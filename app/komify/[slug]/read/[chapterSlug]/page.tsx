"use client";

import { useState, useEffect, useMemo, useRef } from "react";
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
  summary?: string;
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
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const comic = useMemo(
    () => comics.find((c: Comic) => String(c.slug) === slug),
    [slug]
  );

  const chapter = useMemo(
    () =>
      comic?.chapters.find((ch: Chapter) => String(ch.number) === chapterSlug),
    [comic, chapterSlug]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      const position = window.scrollY;
      localStorage.setItem(
        `read-pos-${slug}-${chapterSlug}`,
        position.toString()
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug, chapterSlug, loading]);

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

        setTimeout(() => {
          const savedPos = localStorage.getItem(
            `read-pos-${slug}-${chapterSlug}`
          );
          if (savedPos) {
            window.scrollTo({ top: parseInt(savedPos), behavior: "instant" });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
          setLoading(false);
        }, 100);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") setPages([]);
        setLoading(false);
      }
    }

    fetchPages();
    return () => controller.abort();
  }, [slug, chapterSlug]);

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
    (ch: Chapter) => String(ch.number) === String(chapter.number)
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
        <div
          ref={containerRef}
          className="flex flex-col items-center bg-zinc-900/20 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/5"
        >
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
        </div>
        <div className="mt-12">
          <ReaderNav comic={comic} prev={prevChapter} next={nextChapter} />
          <div>
            {chapter.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-2xl bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 shadow-[4px_0_15px_rgba(37,99,235,0.4)]" />

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">
                      Chapter Synopsis
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <h3 className="text-lg font-bold text-white/90 italic">
                    "{chapter.title || `Chapter ${chapter.number}`}"
                  </h3>

                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-medium">
                    {chapter.summary}
                  </p>
                </div>

                <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
