"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";

interface Props {
  comic: any;
  onClose: () => void;
}

export default function ReportComicModal({ comic, onClose }: Props) {
  const [problems, setProblems] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [selectedChapter, setselectedChapter] = useState("");
  const [selectedPage, setselectedPage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/config/problemList.json")
      .then((res) => res.json())
      .then(setProblems);
  }, []);

  function handleTypeChange(id: string) {
    setType(id);
    const problem = problems.find((p) => p.id === id);
    if (problem) {
      setTitle(problem.title);
      setDescription(problem.description);
    }
  }

  async function submit() {
    setLoading(true);

    const formData = new FormData();
    formData.append("comicId", String(comic.slug));
    formData.append("type", type);
    formData.append("title", title);
    formData.append("comicTitle", comic.title);
    formData.append("description", description);
    if (screenshot) formData.append("screenshot", screenshot);
    formData.append("chapterNumber", selectedChapter);
    formData.append("pageFilename", selectedPage);

    await fetch("/api/komify/report", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    onClose();
  }

  const isDisabled = !type || !title.trim() || !description.trim();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-zinc-100 rounded-xl p-6 w-full max-w-lg border border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">Report Comic</h2>
        <select
          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mb-3
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="">Pilih jenis masalah</option>
          {problems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mb-3
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedChapter}
          onChange={(e) => {
            setselectedChapter(e.target.value);
            setselectedPage("");
          }}
        >
          <option value="">Pilih Chapter (opsional)</option>
          {comic.chapters?.map((ch: any) => (
            <option key={ch.number} value={ch.number}>
              Chapter {ch.number} - {ch.title}
            </option>
          ))}
        </select>

        {selectedChapter && (
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mb-3
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedPage}
            onChange={(e) => setselectedPage(e.target.value)}
          >
            <option value="">Pilih Halaman (opsional)</option>
            {comic.chapters
              ?.find((ch: any) => ch.number === selectedChapter)
              ?.pages.map((p: any) => (
                <option key={p.id} value={p.filename}>
                  {p.filename}
                </option>
              ))}
          </select>
        )}

        <input
          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mb-3
                   placeholder:text-zinc-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Judul laporan"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 mb-3
                   placeholder:text-zinc-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
          placeholder="Deskripsi masalah"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
          className="mb-4 text-sm text-zinc-300
                   file:bg-zinc-800 file:border file:border-zinc-700
                   file:text-zinc-200 file:rounded file:px-3 file:py-1"
        />

        <div className="flex justify-between items-end gap-2">
          <div className="text-sm text-zinc-400">
            <div>
              <strong className="text-zinc-300">Comic:</strong> {comic.title}
            </div>
            {selectedChapter && (
              <div>
                <strong className="text-zinc-300">Chapter:</strong>{" "}
                {selectedChapter}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <PrimaryButton onClick={onClose} variant="primary">
              Batal
            </PrimaryButton>
            <PrimaryButton onClick={submit} disabled={isDisabled}>
              {loading ? "Mengirim..." : "Kirim Report"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
