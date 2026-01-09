"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Edit, Trash, Flag, Download } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Header from "@/components/Komify/Detail/header";
import CommentSection from "@/components/Komify/Detail/CommentSection";
import comicsData from "@/data/komify/comics.json";
import DialogBox from "@/components/UI/DialogBox";

const comics = comicsData as unknown as ComicData[];
import ComicTags from "@/components/Komify/Detail/ComicTags";
import ComicMetadata from "@/components/Komify/Detail/ComicMetadata";
import ComicActions from "@/components/Komify/Detail/ComicActions";
import ChaptersHeader from "@/components/Komify/Detail/ChaptersHeader";
import ChaptersList from "@/components/Komify/Detail/ChaptersList";

import Alert from "@/components/UI/Alert";
import PrimaryButton from "@/components/UI/PrimaryButton";
import CoverViewer from "@/components/UI/CoverViewer";
import ReportComicModal from "@/components/Komify/Detail/ReportComicModal";
import DownloadComicModal from "@/components/Komify/Detail/DownloadComicModal";

dayjs.extend(relativeTime);

interface ComicChapter {
  number: string;
  title: string;
}

interface ComicData {
  slug: number;
  title: string;
  authors: string[];
  artist: string[];
  groups: string[];
  parodies: string[];
  characters: string[];
  categories: string[];
  tags: string[];
  uploaded: string;
  status: "Ongoing" | "Completed" | "Hiatus";
  cover: string;
  chapters?: ComicChapter[];
}

export default function ComicDetail() {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { slug } = useParams();
  const router = useRouter();

  const comic = useMemo(
    () => comics.find((c: ComicData) => String(c.slug) === String(slug)),
    [slug]
  );

  if (!comic) return <p className="p-6">Loading...</p>;

  const normalizeChapters = (chs: any[]) =>
    chs.map((ch, i) => ({
      ...ch,
      _id: ch._id ?? `chapter-${ch.number}-${i}`,
    }));

  const [chapters, setChapters] = useState(
    normalizeChapters(comic.chapters ?? [])
  );
  const [originalChapters, setOriginalChapters] = useState(
    normalizeChapters(comic.chapters ?? [])
  );
  const [isOrdering, setIsOrdering] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const [coverOpen, setCoverOpen] = useState(false);
  const [deleteComicOpen, setDeleteComicOpen] = useState(false);
  const [deleteChapterOpen, setDeleteChapterOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<number | null>(null);

  const [alert, setAlert] = useState<string | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleToggleOrder = () => {
    setOriginalChapters(chapters);
    setIsOrdering(true);
  };

  const handleCancelOrder = () => {
    setChapters(normalizeChapters(originalChapters));
    setIsOrdering(false);
  };

  const handleSaveOrder = async () => {
    const cleanedChapters = chapters.map(({ _id, ...ch }) => ch);

    await fetch("/api/komify/orderingChapter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: comic.slug,
        chapters: cleanedChapters,
      }),
    });

    setIsOrdering(false);
    setAlertSuccess("Urutan chapter berhasil disimpan");
  };

  const handleBatchDownload = () => {
    window.location.href = `/api/komify/download-batch?slug=${comic.slug}`;
    setAlertSuccess("Menyiapkan file download...");
  };

  const handleDownloadSelectedChapters = async (chapters: string[]) => {
    setAlertSuccess("Menyiapkan file download...");

    const res = await fetch("/api/komify/download-chapters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: comic.slug,
        chapters,
      }),
    });

    if (!res.ok) {
      setAlert("Gagal menyiapkan download");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    const date = new Date().toISOString().split("T")[0];
    a.download = `${date}_${comic.slug}_chapters_${chapters.join("-")}.zip`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header defaultSlug={comic.title} />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="relative mb-10 rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <img
              src={comic.cover}
              alt={comic.title}
              onClick={() => setCoverOpen(true)}
              className="
                w-full
                max-w-[220px]
                mx-auto
                md:mx-0
                aspect-3/4
                object-cover
                object-top
                rounded-xl
                cursor-zoom-in
                shadow-lg
              "
            />

            <div className="flex-1 space-y-4">
              <ComicMetadata comic={comic} />
              <ComicTags tags={comic.tags} />
              <ComicActions
                bookmarked={bookmarked}
                onBookmark={handleBookmark}
                userRating={userRating}
                onRate={handleRating}
                avgRating={avgRating}
              />
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <PrimaryButton
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  icon={<Download />}
                  onClick={() => setDownloadOpen(true)}
                >
                  Download
                </PrimaryButton>

                <div className="flex flex-wrap gap-2">
                  <PrimaryButton
                    size="sm"
                    className="bg-yellow-600"
                    icon={<Flag />}
                    onClick={() => setReportOpen(true)}
                  >
                    Report
                  </PrimaryButton>

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
              </div>
            </div>
          </div>
        </div>

        <ChaptersHeader
          slug={Number(comic.slug)}
          isOrdering={isOrdering}
          onToggleOrder={handleToggleOrder}
          onSaveOrder={handleSaveOrder}
          onCancelOrder={handleCancelOrder}
        />
        <ChaptersList
          slug={Number(comic.slug)}
          chapters={comic.chapters ?? []}
          setChapters={setChapters}
          isOrdering={isOrdering}
          onDeleteChapter={(n) => {
            setChapterToDelete(n);
            setDeleteChapterOpen(true);
          }}
        />

        <CommentSection slug={String(comic.slug)} />
      </main>

      {
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
      }
      {
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
      }

      {alert && (
        <Alert
          type="error"
          title="Error"
          message={alert}
          onClose={() => setAlert(null)}
        />
      )}
      {alertSuccess && (
        <Alert
          type="success"
          title="Success"
          message={alertSuccess}
          onClose={() => setAlertSuccess(null)}
        />
      )}

      <CoverViewer
        open={coverOpen}
        src={comic.cover}
        alt={comic.title}
        onClose={() => setCoverOpen(false)}
      />
      {reportOpen && (
        <ReportComicModal comic={comic} onClose={() => setReportOpen(false)} />
      )}
      
      <DownloadComicModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        chapters={comic.chapters ?? []}
        onDownloadBatch={handleBatchDownload}
        onDownloadChapters={handleDownloadSelectedChapters}
      />
    </>
  );
}
