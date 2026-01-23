"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Maximize2 } from "lucide-react";
import { Download, Flag, Edit, Trash } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

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

    try {
      setDeleting(true);

      const res = await fetch("/api/komify/deleteComic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: comic.slug }),
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      router.push("/komify");
    } catch (err) {
      setAlert("Gagal menghapus komik");
    } finally {
      setDeleting(false);
    }
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

  const handleSetChapters = (newChapters: any[]) => {
    setChapters(newChapters);
  };

  useEffect(() => {
    if (comic?.chapters) {
      setChapters(normalizeChapters(comic.chapters));
    }
  }, [comic]);

  return (
    <div className=" bg-zinc-950 text-zinc-100">
      <Header defaultSlug={comic.title} />

      <div className="absolute top-0 w-full h-100 bg-linear-to-b from-blue-600/10 to-transparent pointer-events-none" />

      <main className="relative z-10 p-4 md:p-8 max-w-350 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-4xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-8 p-6 md:p-10">
            <div className="relative group shrink-0 h-fit mx-auto lg:mx-0 w-full max-w-70">
              <div className="absolute -inset-1 bg-linear-to-b from-blue-500 to-purple-600 rounded-[22px] blur opacity-20 group-hover:opacity-60 transition duration-500" />

              <div
                className="relative w-full h-fit rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 cursor-zoom-in group shadow-2xl"
                onClick={() => setCoverOpen(true)}
              >
                <img
                  src={comic.cover}
                  alt={comic.title}
                  className="w-full h-auto object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/10 p-3 rounded-full border border-white/20">
                    <Maximize2 className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 z-20">
                <span
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl border ${
                    comic.status === "Ongoing"
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-emerald-600 text-white border-emerald-400"
                  }`}
                >
                  {comic.status}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="space-y-6">
                <div className="max-w-full overflow-hidden">
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-3 uppercase leading-[0.9] line-clamp-3 wrap-break-word"
                    title={comic.title}
                  >
                    {comic.title}
                  </h1>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 border-y border-zinc-800/50 py-8">
                  <ComicMetadata comic={comic} />
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">
                      Tags & Genres
                    </label>
                    <ComicTags tags={comic.tags} />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                <ComicActions
                  bookmarked={bookmarked}
                  onBookmark={handleBookmark}
                  userRating={userRating}
                  onRate={handleRating}
                  avgRating={avgRating}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <PrimaryButton
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20 px-6 py-5 rounded-2xl group shrink-0"
                      icon={
                        <Download
                          size={18}
                          className="group-hover:translate-y-0.5 transition-transform"
                        />
                      }
                      onClick={() => setDownloadOpen(true)}
                    >
                      DOWNLOAD
                    </PrimaryButton>
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-950/50 p-1.5 rounded-2xl border border-zinc-800/50">
                    <button
                      onClick={() => setReportOpen(true)}
                      className="p-2.5 rounded-xl text-zinc-500 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all"
                      title="Report"
                    >
                      <Flag size={16} />
                    </button>

                    <div className="h-6 w-px bg-zinc-800 mx-1" />

                    <button
                      onClick={() =>
                        router.push(`/komify/edit-comic?slug=${comic.slug}`)
                      }
                      className="p-2.5 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteComicOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all font-bold text-[10px] uppercase tracking-widest"
                    >
                      <Trash size={16} />
                      <span>{deleting ? "Wait..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <ChaptersHeader
            slug={Number(comic.slug)}
            isOrdering={isOrdering}
            onToggleOrder={handleToggleOrder}
            onSaveOrder={handleSaveOrder}
            onCancelOrder={handleCancelOrder}
          />
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-2">
            <ChaptersList
              slug={Number(comic.slug)}
              chapters={chapters}
              setChapters={handleSetChapters}
              isOrdering={isOrdering}
              onDeleteChapter={(n:any) => {
                setChapterToDelete(n);
                setDeleteChapterOpen(true);
              }}
            />
          </div>
        </div>

        <div className="mt-12">
          <CommentSection slug={String(comic.slug)} />
        </div>
      </main>

      <DialogBox
        open={deleteComicOpen}
        title="Delete Comic?"
        desc="This action cannot be undone. All chapters and data will be permanently removed."
        type="danger"
        confirmText="Delete Permanently"
        onConfirm={handleDeleteComic}
        onCancel={() => setDeleteComicOpen(false)}
      />
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
    </div>
  );
}
