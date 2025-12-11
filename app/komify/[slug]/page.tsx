"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Header from "@/components/Komify/Detail/header";
import CommentSection from "@/components/Komify/Detail/CommentSection";
import comics from "@/data/komify/comics.json";
import {
  isBookmarked,
  toggleBookmark,
  getRating,
  setRating,
  getAverageRating,
} from "@/lib/BookmarkRatingUtils";
import { Edit, Trash } from "lucide-react";
import DialogBox from "@/components/UI/DialogBox";

dayjs.extend(relativeTime);

export default function ComicDetail() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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
      <Header defaulftSlug={comic.title} />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Cover + Info */}
        <div
          className="relative flex flex-col md:flex-row gap-8 mb-10 
             bg-slate-900/70 border border-slate-700 
             rounded-2xl shadow-xl p-6 backdrop-blur"
        >
          {/* DELETE BUTTON — pojok kanan atas */}
          <button
            onClick={() => router.push(`/edit-comic?slug=${comic.slug}`)}
            className="absolute top-4 right-20 px-4 py-2 rounded-xl bg-blue-600 text-white shadow 
                   hover:bg-blue-700 active:scale-95 transition"
          >
            <Edit />
          </button>
          <button
            onClick={() => setOpenDeleteDialog(true)}
            disabled={deleting}
            className="absolute top-4 right-4 px-4 py-2 
            bg-red-600 text-white rounded-xl shadow 
            hover:bg-red-700 active:scale-95 transition 
            disabled:opacity-50 text-sm"
          >
            {deleting ? "Menghapus..." : <Trash />}
          </button>

          {/* COVER */}
          <img
            src={
              comic.cover
                ? `/komify/${slug}/cover.jpg${version}`
                : "/placeholder-cover.jpg"
            }
            alt={comic.title}
            className="w-56 h-auto rounded-xl object-cover 
               border border-slate-700 shadow-lg"
          />

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex flex-col">
            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mb-5">
              {comic.tags?.map((tag, i) => (
                <Link
                  key={i}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="text-xs bg-blue-900/30 text-blue-300 border border-blue-800 
                     px-2 py-1 rounded-full shadow-sm hover:bg-blue-900/50 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* METADATA */}
            <div
              className="grid grid-cols-1gap-x-10 gap-y-2 
                    text-sm text-slate-300 mb-6"
            >
              <div>
                <span className="font-semibold text-slate-100">Status:</span>{" "}
                {comic.status === "Ongoing" && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md">
                    Ongoing
                  </span>
                )}
                {comic.status === "complete" && (
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded-md">
                    Complete
                  </span>
                )}
              </div>
              {/* Parodies */}
              {Array.isArray(comic.parodies) &&
                comic.parodies.length > 0 &&
                comic.parodies[0] !== "[]" && (
                  <div>
                    <span className="font-semibold text-slate-100">
                      Parodies:
                    </span>{" "}
                    {comic.parodies.join(", ")}
                  </div>
                )}

              {/* Characters */}
              {Array.isArray(comic.characters) &&
                comic.characters.length > 0 &&
                comic.characters[0] !== "[]" && (
                  <div>
                    <span className="font-semibold text-slate-100">
                      Characters:
                    </span>{" "}
                    {comic.characters.join(", ")}
                  </div>
                )}

              {/* Author */}
              {Array.isArray(comic.author) &&
                comic.author.length > 0 &&
                comic.author[0] !== "[]" && (
                  <div>
                    <span className="font-semibold text-slate-100">
                      Author:
                    </span>{" "}
                    {comic.author.join(", ")}
                  </div>
                )}

              {/* Artists */}
              {Array.isArray(comic.artists) &&
                comic.artists.length > 0 &&
                comic.artists[0] !== "[]" && (
                  <div>
                    <span className="font-semibold text-slate-100">
                      Artist:
                    </span>{" "}
                    {comic.artists.join(", ")}
                  </div>
                )}

              {/* Groups */}
              {Array.isArray(comic.groups) &&
                comic.groups.length > 0 &&
                comic.groups[0] !== "[]" && (
                  <div>
                    <span className="font-semibold text-slate-100">
                      Groups:
                    </span>{" "}
                    {comic.groups.join(", ")}
                  </div>
                )}

              {/* Categories */}
              {Array.isArray(comic.categories) &&
                comic.categories.length > 0 &&
                comic.categories[0] !== "[]" && (
                  <div>
                    <span className="font-semibold text-slate-100">
                      Categories:
                    </span>{" "}
                    {comic.categories.join(", ")}
                  </div>
                )}

              <div>
                <span className="font-semibold text-slate-100">Uploaded:</span>{" "}
                {comic.uploaded}
              </div>
            </div>

            {/* BUTTONS — sekarang ada di bawah metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              {/* Bookmark */}
              <button
                onClick={handleBookmark}
                className={`px-4 py-2 rounded-xl shadow text-white transition active:scale-95 ${
                  bookmarked
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-slate-700 hover:bg-slate-600"
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
                    className="text-2xl text-yellow-400 hover:scale-110 transition"
                  >
                    {userRating >= star ? "★" : "☆"}
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-400">
                  ({avgRating}/5)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Chapters
          </h2>

          <button
            onClick={() => router.push(`/add-chapter?slug=${comic.slug}`)}
            className=" px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 active:scale-95 transition"
          >
            + Tambah Chapter
          </button>
        </div>

        {/* Chapter List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {comic.chapters.map((ch) => (
            <Link
              key={ch.number}
              href={`/reader/${comic.slug}/${ch.number}`}
              className="
                    bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-slate-750 transition"
            >
              <div className="text-xl font-semibold text-blue-400 mb-1">
                Chapter {ch.number}
              </div>

              <div className="text-slate-300 text-sm">{ch.title}</div>

              <div className="text-xs text-slate-500 mt-4">
                {dayjs(ch.uploadChapter).fromNow()}
              </div>
            </Link>
          ))}
        </div>
        <CommentSection slug={String(comic.slug)} />
      </main>
      {
        <DialogBox
          open={openDeleteDialog}
          title="Hapus Komik?"
          desc="Komik ini akan dihapus beserta semua chapter di dalamnya. Tindakan ini tidak bisa dibatalkan."
          type="danger"
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={() => {
            setOpenDeleteDialog(false);
            handleDelete();
          }}
          onCancel={() => setOpenDeleteDialog(false)}
        />
      }
    </>
  );
}
