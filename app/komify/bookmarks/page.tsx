"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Komify/bookmarks/header";
import comics from "@/data/komify/comics.json";

export default function BookmarksPage() {
  const [bookmarked, setBookmarked] = useState<string[]>([]);
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

  const bookmarkedComics = comics
    .filter((c) => bookmarked.includes(String(c.slug)))
    // urutkan sesuai urutan bookmarks terbaru → terlama
    .sort(
      (a, b) =>
        bookmarked.indexOf(String(a.slug)) - bookmarked.indexOf(String(b.slug))
    );

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
                  <div className="text-xs text-gray-400">ID: #{comic.slug}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
