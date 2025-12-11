"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Header from "@/components/Komify/slug/header";
import CommentSection from "@/components/Komify/slug/CommentSection";
import comics from "@/data/komify/comics.json";
import {
  isBookmarked,
  toggleBookmark,
  getRating,
  setRating,
  getAverageRating,
} from "@/lib/BookmarkRatingUtils";

dayjs.extend(relativeTime);

export default function ComicDetail() {
    const [version, setVersion] = useState("");
  const params = useParams();
  const router = useRouter();

  const slug = params.slug;
  const comic = comics.find((c) => String(c.slug) === String(slug));

  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRatingState] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    setVersion(`?v=${Date.now()}`);
  }, []);

  useEffect(() => {
    if (!comic) return;

    setBookmarked(isBookmarked(comic.slug));
    setUserRatingState(getRating(comic.slug));
    setAvgRating(getAverageRating(comic.slug));
  }, [comic]);

  const handleBookmark = () => {
    if (!comic) return;
    toggleBookmark(comic.slug);
    setBookmarked(isBookmarked(comic.slug));
  };

  const handleRating = (rating: number) => {
    if (!comic) return;
    setRating(comic.slug, rating);
    setUserRatingState(rating);
    setAvgRating(getAverageRating(comic.slug));
  };

  const handleDelete = async () => {
    if (!comic) return;

    if (!confirm("Yakin ingin menghapus komik ini beserta semua chapter-nya?"))
      return;

    setDeleting(true);

    const res = await fetch("/api/delete-comic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: comic.slug }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      alert("Gagal menghapus komik!");
    }

    setDeleting(false);
  };

  if (!comic) return <p className="p-6">Loading...</p>;

  return (
    <>
      <Header defaulftSlug={comic.slug} />

      <main className="p-6 max-w-6xl mx-auto">
        {/* Cover + Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 bg-white rounded-xl shadow-lg p-6">
          <img
            src={
              comic.cover
                ? `/komify/${slug}/cover.jpg${version}`
                : "/placeholder-cover.jpg"
            }
            alt={comic.title}
            className="w-56 h-auto rounded-lg shadow-lg border-2 border-gray-200 object-cover"
          />

          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-2 text-blue-800">
              {comic.title}
            </h1>

            {/* Bookmark, Rating, Delete */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.push(`/edit-comic?slug=${comic.slug}`)}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-700"
              >
                ✏️ Edit Comic
              </button>

              <button
                onClick={handleBookmark}
                className={`px-3 py-1 rounded text-white ${
                  bookmarked ? "bg-yellow-500" : "bg-gray-400"
                }`}
              >
                {bookmarked ? "★ Favorit" : "☆ Bookmark"}
              </button>

              {/* ⭐ Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="text-2xl"
                  >
                    {userRating >= star ? "★" : "☆"}
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({avgRating}/5)
                </span>
              </div>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
              >
                {deleting ? "Menghapus..." : "🗑️ Hapus"}
              </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mb-4">
              {comic.tags?.map((tag, i) => (
                <Link
                  key={i}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-black">
              <div>
                <span className="font-semibold">Author:</span>{" "}
                {comic.author?.join(", ")}
              </div>
              <div>
                <span className="font-semibold">Categories:</span>{" "}
                {comic.categories?.join(", ")}
              </div>
              <div>
                <span className="font-semibold">Uploaded:</span>{" "}
                {comic.uploaded}
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-700">📖 Chapters</h2>

          <button
            onClick={() => router.push(`/add-chapter?slug=${comic.slug}`)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
          >
            + Tambah Chapter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {comic.chapters.map((ch) => (
            <Link
              key={ch.number}
              href={`/reader/${comic.slug}/${ch.number}`}
              className="border rounded-lg p-4 bg-white hover:shadow"
            >
              <div className="font-bold text-blue-700 text-lg">
                Chapter {ch.number}
              </div>
              <div className="text-gray-700">{ch.title}</div>
              <div className="text-xs text-gray-500 mt-2">
                {dayjs(ch.uploadChapter).fromNow()}
              </div>
            </Link>
          ))}
        </div>

        <CommentSection slug={String(comic.slug)} />
      </main>
    </>
  );
}
