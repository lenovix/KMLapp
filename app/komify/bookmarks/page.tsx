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

  /** Ambil semua bookmark dari API */
  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/komify/bookmarks");
        const data = await res.json();

        // Pastikan array
        const list = Array.isArray(data.bookmarks) ? data.bookmarks : [];

        // urutkan supaya terbaru di atas
        setBookmarked(list.slice().reverse());
      } catch {
        setBookmarked([]);
      }
    }

    fetchBookmarks();
  }, []);

  /** Ambil rating untuk setiap komik yg di-bookmark */
  useEffect(() => {
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

    if (bookmarked.length > 0) fetchRatings();
    else setLoading(false);
  }, [bookmarked]);

  /** Filter komik berdasarkan bookmark */
  const bookmarkedComics = comics.filter((c) =>
    bookmarked.includes(String(c.slug))
  );

  /** Sort sesuai urutan bookmark */
  bookmarkedComics.sort(
    (a, b) =>
      bookmarked.indexOf(String(a.slug)) - bookmarked.indexOf(String(b.slug))
  );

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-600"}
      >
        ★
      </span>
    ));

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
                <div className="relative w-full h-56 md:h-48 lg:h-52">
                  <img
                    src={comic.cover || "/placeholder-cover.jpg"}
                    alt={comic.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-4 flex flex-col gap-1">
                  <div className="font-semibold text-lg line-clamp-2">
                    {comic.title}
                  </div>

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
