"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Komify/bookmarks/header";
import Pagination from "@/components/Komify/Home/Pagination";
import comicsData from "@/data/komify/comics.json";
import { Star, Bookmark as BookmarkIcon, Loader2 } from "lucide-react";
import { Comic, RatingsMap } from "@/types/komify";

export default function BookmarksPage() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [ratings, setRatings] = useState<RatingsMap>({});
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/komify/bookmarks");
        const data = await res.json();
        const list = Array.isArray(data.bookmarks) ? data.bookmarks : [];
        setBookmarkedSlugs(list.slice().reverse());
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        setBookmarkedSlugs([]);
      }
    }
    fetchBookmarks();
  }, []);

  useEffect(() => {
    async function fetchRatings() {
      if (bookmarkedSlugs.length === 0) {
        setLoading(false);
        return;
      }

      const newRatings: RatingsMap = {};
      try {
        await Promise.all(
          bookmarkedSlugs.map(async (slug) => {
            const res = await fetch(`/api/komify/ratings?slug=${slug}`);
            const data = await res.json();
            newRatings[slug] = data.rating || 0;
          }),
        );
        setRatings(newRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [bookmarkedSlugs]);

  const allBookmarkedComics = useMemo(() => {
    const data = comicsData as unknown as Comic[];
    return data
      .filter((c) => bookmarkedSlugs.includes(String(c.slug)))
      .sort(
        (a, b) =>
          bookmarkedSlugs.indexOf(String(a.slug)) -
          bookmarkedSlugs.indexOf(String(b.slug)),
      );
  }, [bookmarkedSlugs]);

  const totalPages = Math.ceil(allBookmarkedComics.length / ITEMS_PER_PAGE);
  const paginatedComics = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allBookmarkedComics.slice(start, start + ITEMS_PER_PAGE);
  }, [allBookmarkedComics, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={`${i < rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-zinc-500 animate-pulse font-medium">
              Synchronizing library...
            </p>
          </div>
        ) : allBookmarkedComics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
            <BookmarkIcon size={64} className="text-zinc-800 mb-6" />
            <h2 className="text-xl font-bold text-zinc-300">
              Your library is empty
            </h2>
            <p className="text-zinc-500 max-w-xs mt-2 mb-8">
              Start adding your favorite comics to see them here.
            </p>
            <Link
              href="/komify"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95"
            >
              Explore Comics
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {paginatedComics.map((comic) => {
                const displayTitle = Array.isArray(comic.title)
                  ? comic.title[0]
                  : comic.title;

                return (
                  <Link
                    key={comic.slug}
                    href={`/komify/${comic.slug}`}
                    className="group flex flex-col transition-all duration-300"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl group-hover:border-amber-500/50">
                      <Image
                        src={comic.cover || "/placeholder-cover.jpg"}
                        alt={displayTitle}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>

                    <div className="mt-4 flex flex-col gap-2 px-1">
                      <h2 className="font-bold text-sm leading-tight line-clamp-2 text-zinc-100 group-hover:text-amber-400 transition-colors duration-300">
                        {displayTitle}
                      </h2>
                      <div className="flex items-center justify-between">
                        {renderStars(ratings[comic.slug] || 0)}
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                          ID: {comic.slug}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 pt-10 border-t border-zinc-800/50">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
