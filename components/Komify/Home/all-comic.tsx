"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import AllComicHeader from "@/components/Komify/Home/header";
import Pagination from "@/components/Komify/Home/Pagination";
import FilterTags from "@/components/Komify/Home/FilterTags";

interface Ratings {
  [slug: string]: number;
}

export default function AllComic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Ratings>({});

  const filteredComics = useMemo(() => {
    const filtered = comics.filter((comic) => {
      const title =
        typeof comic.title === "string"
          ? comic.title
          : Array.isArray(comic.title)
          ? comic.title[0]
          : "";
      const matchesSearch = title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const comicTags = Array.isArray(comic.tags) ? comic.tags : [comic.tags];
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => comicTags.includes(tag));
      return matchesSearch && matchesTags;
    });
    return filtered.sort((a, b) => {
      const uploadedA = Array.isArray(a.uploaded) ? a.uploaded[0] : a.uploaded;
      const uploadedB = Array.isArray(b.uploaded) ? b.uploaded[0] : b.uploaded;
      return new Date(uploadedB).getTime() - new Date(uploadedA).getTime();
    });
  }, [searchTerm, selectedTags]);

  const COMICS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredComics.length / COMICS_PER_PAGE);
  const paginatedComics = filteredComics.slice(
    (currentPage - 1) * COMICS_PER_PAGE,
    currentPage * COMICS_PER_PAGE
  );
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allTags = useMemo(() => {
    if (!Array.isArray(comics)) return [];

    const tags = comics.flatMap((c) => {
      if (!c || !c.tags) return [];

      // Normal array → gunakan langsung
      if (Array.isArray(c.tags) && typeof c.tags[0] === "string") {
        return c.tags.flatMap((t) => {
          try {
            // Jika "t" ternyata JSON array, parse
            const parsed = JSON.parse(t);
            if (Array.isArray(parsed)) return parsed;
          } catch {}
          return t;
        });
      }

      // Single string → mungkin JSON array
      if (typeof c.tags === "string") {
        try {
          const parsed = JSON.parse(c.tags);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
        return [c.tags];
      }

      return [];
    });

    const cleaned = tags
      .map((t) => (typeof t === "string" ? t.trim() : ""))
      .filter((t) => t !== "" && t !== "[]" && t !== "undefined");

    return Array.from(new Set(cleaned));
  }, [comics]);


  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };


  // --- Fetch ratings ---
  useEffect(() => {
    async function fetchRatings() {
      const newRatings: Ratings = {};
      for (const comic of filteredComics) {
        try {
          const res = await fetch(`/api/komify/ratings?slug=${comic.slug}`);
          const data = await res.json();
          newRatings[comic.slug] = data.rating || 0;
        } catch {
          newRatings[comic.slug] = 0;
        }
      }
      setRatings(newRatings);
    }

    if (filteredComics.length > 0) fetchRatings();
  }, [filteredComics]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-400"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <main className="flex flex-col gap-6 h-full justify-between">
        <AllComicHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="h-[550]">
          {filteredComics.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              Tidak ditemukan komik dengan judul tersebut.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {paginatedComics.map((comic) => (
                  <Link
                    key={comic.slug}
                    href={`/komify/${comic.slug}`}
                    className="group bg-white dark:bg-slate-900 border hover:border-amber-50 border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition flex flex-col"
                  >
                    <img
                      src={comic.cover || "/placeholder-cover.jpg"}
                      alt={
                        typeof comic.title === "string"
                          ? comic.title
                          : comic.title?.[0]
                      }
                      className="w-full h-56 object-cover transition-transform duration-300"
                    />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {typeof comic.title === "string"
                          ? comic.title
                          : comic.title?.[0]}
                      </h2>

                      {/* Rating */}
                      <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                        {renderStars(ratings[comic.slug] || 0)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
        <FilterTags
          tags={allTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
      </main>
    </>
  );
}
