"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/UI/Alert";
import DialogBox from "@/components/Komify/upload/DialogBox";
import DialogBoxCover from "@/components/Komify/upload/DialogBoxCover";
import HeaderUpload from "@/components/Komify/upload/header";
import ComicDetails from "@/components/Komify/upload/ComicDetails";
import ComicCover from "@/components/Komify/upload/ComicCover";
import ChapterSection from "@/components/Komify/upload/ChapterSection";
import ChapterPreviewModal from "@/components/Komify/upload/ChapterPreviewModal";

interface UploadComicHeaderProps {
  defaultSlug: number;
}

export default function UploadComicPage({
  defaultSlug,
}: UploadComicHeaderProps) {
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    message?: string;
    type: "success" | "warning" | "error" | "onprogress";
    progress?: number;
    duration?: number;
    onClose?: () => void;
  } | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  const [comicData, setComicData] = useState({
    slug: defaultSlug.toString(),
    title: "",
    author: [] as string[],
    artist: [] as string[],
    groups: [] as string[],
    parodies: [] as string[],
    characters: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    uploaded: new Date().toISOString().split("T")[0],
    status: "Ongoing",
    cover: "",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: "",
    desc: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const handleAskUpload = () => {
    setDialogData({
      title: "Upload Komik?",
      desc: "Pastikan data sudah benar sebelum melanjutkan.",
      onConfirm: handleUpload, // lanjut proses upload
      onCancel: () => setDialogOpen(false),
    });
  };

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [chapters, setChapters] = useState([
    { number: "001", title: "", language: "English", files: [] as File[] },
  ]);
  const [previewChapterIndex, setPreviewChapterIndex] = useState<number | null>(
    null
  );

  const handleComicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComicData({ ...comicData, [e.target.name]: e.target.value });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCoverFile(file);
      setComicData({ ...comicData, cover: URL.createObjectURL(file) });
    }
  };

  const handleChapterChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...chapters];
    const key = e.target.name as keyof (typeof updated)[number];
    if (key === "files") {
      return;
    }
    updated[index][key] = e.target.value as never;
    setChapters(updated);
  };

  const handleChapterFile = (index: number, files: FileList | null) => {
    const updated = [...chapters];
    updated[index].files = files ? Array.from(files) : [];
    setChapters(updated);
  };

  const formatChapterNumber = (num: number) => String(num).padStart(3, "0");

  const addChapter = () => {
    const nextNumber = formatChapterNumber(chapters.length + 1);
    setChapters([
      ...chapters,
      { number: nextNumber, title: "", language: "English", files: [] },
    ]);
  };

  const removeChapter = (index: number) => {
    const updated = [...chapters];
    updated.splice(index, 1);
    const renumbered = updated.map((ch, i) => ({
      ...ch,
      number: formatChapterNumber(i + 1),
    }));
    setChapters(renumbered);
  };

  const validateBeforeUpload = () => {
    if (!comicData.title) {
      setAlertData({
        title: "Judul Komik Kosong",
        message: "Judul komik wajib diisi sebelum mengunggah.",
        type: "error",
      });
      return false;
    }

    if (!comicData.cover) {
      setAlertData({
        title: "Cover Belum Diunggah",
        type: "error",
      });
      return false;
    }

    if (!chapters.length || !chapters[0].title) {
      setAlertData({
        title: "Judul Chapter Kosong",
        type: "error",
      });
      return false;
    }

    for (const ch of chapters) {
      if (!ch.number || !ch.title || !ch.language) {
        setAlertData({
          title: "Data Chapter Tidak Lengkap",
          message: "Setiap chapter wajib memiliki nomor, judul, dan bahasa.",
          type: "error",
        });
        return false;
      }

      if (!ch.files || ch.files.length === 0) {
        setAlertData({
          title: `File Chapter ${ch.number} Kosong`,
          type: "error",
        });
        return false;
      }
    }

    return true;
  };

  const handleOpenDialog = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const isValid = validateBeforeUpload();
    if (!isValid) return;

    setDialogData({
      title: "Upload Komik?",
      desc: "Pastikan semua data sudah benar sebelum melanjutkan.",
      onConfirm: handleUpload,
      onCancel: () => setDialogOpen(false),
    });

    setAlertData(null);
    setDialogOpen(true);
  };

  const handleUpload = async () => {
    setDialogOpen(false);

    const formData = new FormData();
    Object.entries(comicData).forEach(([key, value]) => {
      if (key === "cover") return;
      formData.append(
        key,
        Array.isArray(value) ? JSON.stringify(value) : value
      );
    });

    if (coverFile) formData.append("cover", coverFile);

    formData.append(
      "chapters",
      JSON.stringify(
        chapters.map((ch) => ({
          number: ch.number,
          title: ch.title,
          language: ch.language,
          uploadChapter: comicData.uploaded,
        }))
      )
    );

    chapters.forEach((ch) => {
      if (ch.files && ch.files.length > 0) {
        ch.files.forEach((file) => {
          formData.append(`chapter-${ch.number}`, file);
        });
      }
    });

    try {
      setAlertData({
        type: "onprogress",
        title: "Uploading...",
        message: "Please wait",
        progress: 0,
        duration: 0,
        onClose: undefined,
      });

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/komify/upload");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
          setAlertData((prev) =>
            prev ? { ...prev, progress: percent } : null
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setAlertData({
            type: "success",
            title: "Upload Berhasil",
            message: "Data komik berhasil diunggah.",
            duration: 5000,
          });

          setTimeout(() => {
            router.push("/komify");
          }, 5000);
        } else {
          let errMessage = "Terjadi kesalahan saat memproses upload.";
          try {
            const err = JSON.parse(xhr.responseText);
            errMessage = err.message || errMessage;
          } catch {}

          setTimeout(() => {
            setAlertData({
              type: "error",
              title: "Gagal Mengunggah",
              message: errMessage,
            });
          }, 0); // Memastikan setState dipanggil setelah render selesai
        }
      };

      xhr.onerror = () => {
        setAlertData({
          title: "Kesalahan Jaringan",
          message:
            "Tidak dapat terhubung ke server. Periksa koneksi dan coba lagi.",
          type: "error",
        });
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Network error:", error);
      setAlertData({
        title: "Kesalahan Jaringan",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi dan coba lagi.",
        type: "error",
      });
    }
  };

  const [originalFiles, setOriginalFiles] = useState<File[]>([]);

  const openPreview = (index: number) => {
    setPreviewChapterIndex(index);

    const chapter = chapters[index];
    if (chapter && Array.isArray(chapter.files)) {
      setOriginalFiles([...chapter.files]);
    }
  };

  const closePreview = () => {
    setPreviewChapterIndex(null);
    setOriginalFiles([]);
  };

  const savePreviewOrder = () => {
    closePreview();
  };

  const cancelPreviewOrder = () => {
    if (previewChapterIndex === null) return;

    setChapters((prev) =>
      prev.map((ch, idx) =>
        idx === previewChapterIndex ? { ...ch, files: originalFiles } : ch
      )
    );

    closePreview();
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || previewChapterIndex === null) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const chapter = chapters[previewChapterIndex];
    if (!chapter || !Array.isArray(chapter.files)) return;

    const reorderedFiles = Array.from(chapter.files);

    if (
      sourceIndex < 0 ||
      sourceIndex >= reorderedFiles.length ||
      destIndex < 0 ||
      destIndex >= reorderedFiles.length
    ) {
      return;
    }

    const [movedItem] = reorderedFiles.splice(sourceIndex, 1);
    reorderedFiles.splice(destIndex, 0, movedItem);

    setChapters((prev) =>
      prev.map((ch, idx) =>
        idx === previewChapterIndex ? { ...ch, files: reorderedFiles } : ch
      )
    );
  };

  const [shouldRedirect, setShouldRedirect] = useState(false);
  useEffect(() => {
    if (shouldRedirect) {
      router.push("/komify");
    }
  }, [shouldRedirect, router]);
  return (
    <>
      <HeaderUpload defaulftSlug={comicData.slug} />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* FORM */}
        <form onSubmit={handleOpenDialog} className="space-y-6 overflow-hidden">
          {/* ========================== */}
          {/* DETAIL + COVER SECTION     */}
          {/* ========================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DETAIL (kiri) */}
            <ComicDetails comicData={comicData} onChange={handleComicChange} />

            {/* COVER + BUTTON (kanan) */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4 flex flex-col">
              {/* Submit Button */}
              <button
                onClick={handleOpenDialog}
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
              >
                Simpan Komik
              </button>

              {/* BOX COVER */}
              <ComicCover
                cover={comicData.cover}
                onClick={() => setCoverDialogOpen(true)}
                onDelete={() => setComicData({ ...comicData, cover: "" })}
              />
            </div>
          </div>

          {/* ========================== */}
          {/* CHAPTER SECTION (BOTTOM)   */}
          {/* ========================== */}
          <ChapterSection
            chapters={chapters}
            addChapter={addChapter}
            removeChapter={removeChapter}
            handleChapterChange={handleChapterChange}
            handleChapterFile={handleChapterFile}
            openPreview={openPreview}
          />
        </form>
      </main>

      {/* Alert */}
      {alertData && (
        <Alert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          progress={alertData.progress}
          duration={alertData.duration}
          onClose={() => setAlertData(null)}
        />
      )}
      {
        <DialogBox
          open={dialogOpen}
          title={dialogData.title}
          desc={dialogData.desc}
          onConfirm={dialogData.onConfirm}
          onCancel={dialogData.onCancel}
        />
      }
      {
        <DialogBoxCover
          open={coverDialogOpen}
          onClose={() => setCoverDialogOpen(false)}
          onSave={(file) => {
            setCoverDialogOpen(false);
            setCoverFile(file);
            setComicData({ ...comicData, cover: URL.createObjectURL(file) });
          }}
        />
      }
      {previewChapterIndex !== null && (
        <ChapterPreviewModal
          visible={true}
          chapter={{
            title: chapters[previewChapterIndex].title,
            number: parseInt(chapters[previewChapterIndex].number, 10),
            files: chapters[previewChapterIndex].files,
          }}
          onSave={savePreviewOrder}
          onCancel={cancelPreviewOrder}
          onDragEnd={handleDragEnd}
        />
      )}
    </>
  );
}
