"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Trash } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Header from "@/components/Komify/Detail/header";
import CommentSection from "@/components/Komify/Detail/CommentSection";
import comics from "@/data/komify/comics.json";
import DialogBox from "@/components/UI/DialogBox";
import ComicTags from "@/components/Komify/Detail/ComicTags";
import ComicMetadata from "@/components/Komify/Detail/ComicMetadata";
import ChaptersHeader from "@/components/Komify/Detail/ChaptersHeader";
import ChaptersList from "@/components/Komify/Detail/ChaptersList";
import ComicActions from "@/components/Komify/Detail/ComicActions";
import PrimaryButton from "@/components/UI/PrimaryButton";
import Alert from "@/components/UI/Alert";
import CoverViewer from "@/components/UI/CoverViewer";

dayjs.extend(relativeTime);

export default function ComicDetail() {
  const { slug } = useParams();
  const router = useRouter();

  const comic = useMemo(
    () => comics.find((c) => String(c.slug) === String(slug)),
    [slug]
  );

  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const [coverOpen, setCoverOpen] = useState(false);
  const [deleteComicOpen, setDeleteComicOpen] = useState(false);
  const [deleteChapterOpen, setDeleteChapterOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);

  const [alert, setAlert] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const coverSrc = useMemo(() => {
  if (!comic?.cover) return "/placeholder-cover.jpg";
  return `/komify/${comic.slug}/cover.jpg`;
}, [comic?.cover, comic?.slug]);

const [imgSrc, setImgSrc] = useState(coverSrc);
const [tryIndex, setTryIndex] = useState(0);

const extensions = [".jpg", ".png", ".webp"];

useEffect(() => {
  setImgSrc(coverSrc);
  setTryIndex(0);
}, [coverSrc]);

const handleImageError = useCallback(() => {
  if (!comic?.slug) return;

  const nextIndex = tryIndex + 1;
  if (nextIndex < extensions.length) {
    setImgSrc(`/komify/${comic.slug}/cover${extensions[nextIndex]}`);
    setTryIndex(nextIndex);
  } else {
    // Semua ekstensi sudah dicoba, fallback ke placeholder
    setImgSrc("/placeholder-cover.jpg");
  }
}, [tryIndex, comic?.slug]);

  useEffect(() => {
    if (!comic) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/komify/user-data?slug=${comic.slug}`);
        const data = await res.json();
        setBookmarked(data.bookmarked ?? false);
        setUserRating(data.rating ?? 0);
        setAvgRating(data.rating ?? 0);
      } catch {
        setBookmarked(false);
        setUserRating(0);
        setAvgRating(0);
      }
    };

    fetchUserData();
  }, [comic]);

  const handleBookmark = useCallback(async () => {
    if (!comic) return;

    const res = await fetch("/api/komify/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: comic.slug }),
    });

    const data = await res.json();
    setBookmarked(data.bookmarked);
  }, [comic]);

  const handleRating = useCallback(
    async (rating: number) => {
      if (!comic) return;

      const res = await fetch("/api/komify/ratings", {
        method: "POST",
        body: JSON.stringify({ slug: comic.slug, rating }),
      });

      if (res.ok) {
        setUserRating(rating);
        setAvgRating(rating);
      }
    },
    [comic]
  );

  const handleDeleteComic = useCallback(async () => {
    if (!comic) return;

    setDeleting(true);
    const res = await fetch("/api/komify/deleteComic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: comic.slug }),
    });

    if (res.ok) router.push("/komify");
    else setAlert("Gagal menghapus komik");

    setDeleting(false);
  }, [comic, router]);

  const confirmDeleteChapter = useCallback(async () => {
    if (!comic || chapterToDelete === null) return;

    const res = await fetch("/api/komify/deleteChapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: comic.slug,
        chapter: chapterToDelete,
      }),
    });

    if (res.ok) router.refresh();
    else setAlert("Gagal menghapus chapter");

    setDeleteChapterOpen(false);
    setChapterToDelete(null);
  }, [comic, chapterToDelete, router]);

  if (!comic) return <p className="p-6">Loading...</p>;

  return (
    <>
      <Header defaulftSlug={comic.title} />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="relative flex flex-col md:flex-row gap-8 mb-10 bg-slate-900/70 border border-slate-700 rounded-2xl p-6">
          <div className="absolute top-4 right-4 flex gap-2">
            <PrimaryButton
              size="sm"
              icon={<Edit />}
              onClick={() =>
                router.push(`/komify/edit-comic?slug=${comic.slug}`)
              }
            >
              Edit
            </PrimaryButton>

            <PrimaryButton
              size="sm"
              className="bg-red-600"
              icon={<Trash />}
              onClick={() => setDeleteComicOpen(true)}
            >
              {deleting ? "Menghapus..." : "Delete"}
            </PrimaryButton>
          </div>

          <img
            src={imgSrc}
            alt={comic.title}
            onError={handleImageError}
            onClick={() => setCoverOpen(true)}
            className="w-56 rounded-xl cursor-zoom-in"
          />

          <div className="flex-1">
            <ComicMetadata comic={comic} />
            <ComicTags tags={comic.tags} />
            <ComicActions
              bookmarked={bookmarked}
              onBookmark={handleBookmark}
              userRating={userRating}
              onRate={handleRating}
              avgRating={avgRating}
            />
          </div>
        </div>

        <ChaptersHeader slug={Number(comic.slug)} />
        <ChaptersList
          slug={Number(comic.slug)}
          chapters={comic.chapters}
          onDeleteChapter={(n) => {
            setChapterToDelete(n);
            setDeleteChapterOpen(true);
          }}
        />

        <CommentSection slug={String(comic.slug)} />
      </main>

      <DialogBox
        open={deleteComicOpen}
        title="Hapus Komik?"
        desc="Komik ini akan dihapus permanen."
        type="danger"
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleDeleteComic}
        onCancel={() => setDeleteComicOpen(false)}
      />

      <DialogBox
        open={deleteChapterOpen}
        title="Hapus Chapter?"
        desc={`Chapter ${chapterToDelete} akan dihapus.`}
        type="danger"
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={confirmDeleteChapter}
        onCancel={() => setDeleteChapterOpen(false)}
      />

      {alert && (
        <Alert
          type="error"
          title="Error"
          message={alert}
          onClose={() => setAlert(null)}
        />
      )}

      <CoverViewer
        open={coverOpen}
        src={imgSrc}
        alt={comic.title}
        onClose={() => setCoverOpen(false)}
      />
    </>
  );
}
