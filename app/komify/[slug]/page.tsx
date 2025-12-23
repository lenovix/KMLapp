"use client";

import { useEffect, useState } from "react";
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
  const [coverViewerOpen, setCoverViewerOpen] = useState(false);
  const [openDeleteChapterDialog, setOpenDeleteChapterDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [version, setVersion] = useState("");
  const [imgSrc, setImgSrc] = useState<string | null>(null); 
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const comic = comics.find((c) => String(c.slug) === String(slug));
  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRatingState] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (comic) {
      const initialSrc = comic.cover
        ? `/komify/${slug}/cover.jpg?v=${Date.now()}`
        : "/placeholder-cover.jpg";
      setImgSrc(initialSrc);
    }
  }, [comic, slug]);

  const handleImageError = () => {
    if (imgSrc?.includes(".jpg")) {
      setImgSrc(`/komify/${slug}/cover.png${version}`);
    } else if (imgSrc?.includes(".png")) {
      setImgSrc(`/komify/${slug}/cover.webp${version}`);
    } else if (imgSrc?.includes(".webp")) {
      setImgSrc(`/komify/${slug}/cover.jpeg${version}`);
    } else {
      setImgSrc("/placeholder-cover.jpg");
    }
  };

  useEffect(() => {
    setVersion(`?v=${Date.now()}`);
  }, []);

  useEffect(() => {
    if (!comic?.slug) return;
    fetch(`/api/komify/bookmarks?slug=${String(comic.slug)}`)
      .then((res) => res.json())
      .then((data) => setBookmarked(data.bookmarked))
      .catch(() => setBookmarked(false));
    fetch(`/api/komify/ratings?slug=${comic.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setUserRatingState(data.rating || 0);
        setAvgRating(data.rating || 0);
      })
      .catch(() => {
        setUserRatingState(0);
        setAvgRating(0);
      });
  }, [comic?.slug]);

  const handleBookmark = async () => {
    if (!comic) return;

    const res = await fetch("/api/komify/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: String(comic.slug) }),
    });

    const data = await res.json();
    setBookmarked(data.bookmarked);
  };

  const handleRating = async (rating: number) => {
    if (!comic) return;
    const res = await fetch("/api/komify/ratings", {
      method: "POST",
      body: JSON.stringify({
        slug: comic.slug,
        rating,
      }),
    });
    if (res.ok) {
      setUserRatingState(rating);
      setAvgRating(rating);
    }
  };

  const handleDelete = async () => {
    if (!comic) return;
    setDeleting(true);
    const res = await fetch("/api/komify/deleteComic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: comic.slug }),
    });
    if (res.ok) {
      router.push("/komify");
    } else {
      setAlertMessage("Gagal menghapus komik!");
      setShowAlert(true);
    }
    setDeleting(false);
  };

  const handleDeleteChapter = (chapterNumber: number) => {
    setChapterToDelete(chapterNumber);
    setOpenDeleteChapterDialog(true);
  };

  const confirmDeleteChapter = async () => {
    if (!comic || chapterToDelete === null) return;

    const res = await fetch("/api/komify/deleteChapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: comic.slug,
        chapter: chapterToDelete,
      }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setAlertMessage("Gagal menghapus chapter!");
      setShowAlert(true);
    }

    setOpenDeleteChapterDialog(false);
    setChapterToDelete(null);
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
          {/* ACTION BUTTONS (Edit & Delete) */}
          <div className="absolute top-4 right-4 flex gap-3">
            <PrimaryButton
              onClick={() =>
                router.push(`/komify/edit-comic?slug=${comic.slug}`)
              }
              icon={<Edit />}
              iconPosition="left"
              variant="primary"
              rounded="xl"
              size="sm"
              className="shadow"
            >
              Edit
            </PrimaryButton>

            <PrimaryButton
              onClick={() => setOpenDeleteDialog(true)}
              icon={<Trash />}
              iconPosition="left"
              rounded="xl"
              size="sm"
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 shadow"
            >
              {deleting ? "Menghapus..." : "Delete"}
            </PrimaryButton>
          </div>

          {/* COVER */}
          <img
            src={imgSrc? imgSrc : "/placeholder-cover.jpg"}
            alt={comic.title}
            onError={handleImageError}
            onClick={() => setCoverViewerOpen(true)}
            className="
              w-56 h-auto rounded-xl object-cover
              border border-slate-700 shadow-lg
              cursor-zoom-in hover:opacity-90 transition"
          />

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex flex-col">
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
          onDeleteChapter={handleDeleteChapter}
        />
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
      {showAlert && (
        <Alert
          type="error"
          title="Error"
          message={alertMessage}
          onClose={() => setShowAlert(false)}
          duration={5000}
        />
      )}
      {
        <DialogBox
          open={openDeleteChapterDialog}
          title="Hapus Chapter?"
          desc={`Chapter ${chapterToDelete} akan dihapus permanen. Lanjutkan?`}
          type="danger"
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={confirmDeleteChapter}
          onCancel={() => setOpenDeleteChapterDialog(false)}
        />
      }
      {
        <CoverViewer
          open={coverViewerOpen}
          src={imgSrc ? imgSrc : "/placeholder-cover.jpg"}
          alt={comic.title}
          onClose={() => setCoverViewerOpen(false)}
        />
      }
    </>
  );
}
