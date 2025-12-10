"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import AllComicHeader from "@/components/Komify/Home/header";
import Pagination from "@/components/Komify/Home/Pagination";
import FilterTags from "@/components/Komify/Home/FilterTags";

export default function AllComic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    const tags = comics.flatMap((c) =>
      Array.isArray(c.tags) ? c.tags : [c.tags]
    );
    const cleaned = tags.filter((t) => t && t !== "[]" && t.trim() !== "");

    return Array.from(new Set(cleaned));
  }, [comics]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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
                    href={`/${comic.slug}`}
                    className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                  >
                    <img
                      src={comic.cover || "/placeholder-cover.jpg"}
                      alt={
                        typeof comic.title === "string"
                          ? comic.title
                          : comic.title?.[0]
                      }
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h2 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 truncate">
                        {typeof comic.title === "string"
                          ? comic.title
                          : comic.title?.[0]}
                      </h2>
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
