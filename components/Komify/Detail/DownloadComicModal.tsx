"use client";

import { useState } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";

interface Chapter {
  number: string;
  title: string;
}

interface DownloadComicModalProps {
  open: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onDownloadBatch: () => void;
  onDownloadChapters: (chapters: string[]) => void;
}

export default function DownloadComicModal({
  open,
  onClose,
  chapters,
  onDownloadBatch,
  onDownloadChapters,
}: DownloadComicModalProps) {
  const [mode, setMode] = useState<"batch" | "chapter">("batch");
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  if (!open) return null;

  const toggleChapter = (num: string) => {
    setSelectedChapters((prev) =>
      prev.includes(num) ? prev.filter((c) => c !== num) : [...prev, num]
    );
  };

  const handleDownload = () => {
    if (mode === "batch") {
      onDownloadBatch();
      onClose();
      return;
    }

    if (selectedChapters.length === 0) return;
    onDownloadChapters(selectedChapters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-1">
          Download Comic
        </h2>
        <p className="text-sm text-slate-400 mb-4">Pilih metode download</p>

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="downloadMode"
              value="batch"
              checked={mode === "batch"}
              onChange={() => setMode("batch")}
            />
            <span className="text-sm">Download Batch (Semua Chapter)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="downloadMode"
              value="chapter"
              checked={mode === "chapter"}
              onChange={() => setMode("chapter")}
            />
            <span className="text-sm">Download Per Chapter</span>
          </label>
        </div>

        {mode === "chapter" && (
          <div className="mb-4 max-h-52 overflow-y-auto rounded-lg border border-slate-700 p-3 space-y-2">
            {chapters.map((ch) => (
              <label
                key={ch.number}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedChapters.includes(ch.number)}
                  onChange={() => toggleChapter(ch.number)}
                />
                <span>
                  Chapter {ch.number} — {ch.title}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-white"
          >
            Batal
          </button>

          <PrimaryButton
            size="sm"
            disabled={mode === "chapter" && selectedChapters.length === 0}
            onClick={handleDownload}
          >
            Download
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
