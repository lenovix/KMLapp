"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Komify/bookmarks/header";
import comics from "@/data/komify/comics.json";

interface Ratings {
  [slug: string]: number;
}

export default function BookmarksPage() {
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Ratings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/komify/bookmarks");
        const data = await res.json();
        // Urutkan dari bookmark terbaru
        const bookmarksOrdered = data.bookmarks.slice().reverse();
        setBookmarked(bookmarksOrdered);
      } catch (err) {
        setBookmarked([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, []);

  useEffect(() => {
    // Fetch rating tiap komik
    async function fetchRatings() {
      const newRatings: Ratings = {};
      for (const slug of bookmarked) {
        try {
          const res = await fetch(`/api/komify/ratings?slug=${slug}`);
          const data = await res.json();
          newRatings[slug] = data.rating || 0;
        } catch {
          newRatings[slug] = 0;
        }
      }
      setRatings(newRatings);
      setLoading(false);
    }

    if (bookmarked.length > 0) {
      fetchRatings();
    } else {
      setLoading(false);
    }
  }, [bookmarked]);


  const bookmarkedComics = comics
    .filter((c) => bookmarked.includes(String(c.slug)))
    .sort(
      (a, b) =>
        bookmarked.indexOf(String(a.slug)) - bookmarked.indexOf(String(b.slug))
    );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-600"}
        >
          ★
        </span>
      );
    }
    return stars;
  };


  return (
    <>
      <Header />
      <main className="flex flex-col gap-6 p-6 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bookmarkedComics.length === 0 ? (
          <p className="text-gray-500">Belum ada komik yang di-bookmark.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarkedComics.map((comic) => (
              <Link
                key={comic.slug}
                href={`/komify/${comic.slug}`}
                className="block bg-slate-900 border border-slate-700 hover:border-amber-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
              >
                {/* Cover */}
                <div className="relative w-full h-56 md:h-48 lg:h-52">
                  <img
                    src={comic.cover || "/placeholder-cover.jpg"}
                    alt={
                      Array.isArray(comic.title)
                        ? comic.title.join(", ")
                        : comic.title
                    }
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col gap-1">
                  <div className="font-semibold text-lg line-clamp-2">
                    {Array.isArray(comic.title)
                      ? comic.title.join(", ")
                      : comic.title}
                  </div>
                  {/* Rating */}
                  <div className="text-sm">
                    {renderStars(ratings[comic.slug] || 0)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
