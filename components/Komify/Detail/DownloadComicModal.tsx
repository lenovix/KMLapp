"use client";

import { useState } from "react";
import { Download, Check, Layers, ListChecks, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const toggleChapter = (num: string) => {
    setSelectedChapters((prev) =>
      prev.includes(num) ? prev.filter((c) => c !== num) : [...prev, num],
    );
  };

  const handleDownload = () => {
    if (mode === "batch") {
      onDownloadBatch();
    } else {
      if (selectedChapters.length === 0) return;
      onDownloadChapters(selectedChapters);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <div className="bg-blue-600/10 p-6 flex items-center justify-between border-b border-blue-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-900/20">
                  <Download size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">
                    Download Center
                  </h2>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                    Offline Reading
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-3 mb-6 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
                <button
                  onClick={() => setMode("batch")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === "batch"
                      ? "bg-zinc-800 text-blue-400 shadow-inner"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Layers size={14} /> Batch
                </button>
                <button
                  onClick={() => setMode("chapter")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === "chapter"
                      ? "bg-zinc-800 text-blue-400 shadow-inner"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <ListChecks size={14} /> Chapter
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                  {mode === "batch"
                    ? "Semua chapter akan diproses menjadi satu file ZIP untuk kamu baca kapan saja."
                    : "Pilih chapter spesifik yang ingin kamu simpan secara offline."}
                </p>
              </div>

              {mode === "chapter" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mb-8 space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar"
                >
                  {chapters.map((ch) => {
                    const isSelected = selectedChapters.includes(ch.number);
                    return (
                      <div
                        key={ch.number}
                        onClick={() => toggleChapter(ch.number)}
                        className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-blue-600/10 border-blue-500/30"
                            : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-blue-400" : "text-zinc-500"}`}
                          >
                            Chapter {ch.number}
                          </span>
                          <span className="text-sm text-zinc-200 font-bold truncate max-w-[200px]">
                            {ch.title}
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-zinc-700 group-hover:border-zinc-500"
                          }`}
                        >
                          {isSelected && <Check size={14} strokeWidth={4} />}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              <div className="flex flex-col gap-3">
                <PrimaryButton
                  onClick={handleDownload}
                  disabled={mode === "chapter" && selectedChapters.length === 0}
                  className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20"
                >
                  {mode === "batch"
                    ? "Download Semua"
                    : `Download ${selectedChapters.length} Chapter`}
                </PrimaryButton>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Kembali
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
