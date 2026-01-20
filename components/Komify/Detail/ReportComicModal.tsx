"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, Upload, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";

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
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetch("/data/config/problemList.json")
      .then((res) => res.json())
      .then(setProblems)
      .catch(() => console.error("Gagal memuat daftar masalah"));
  }, []);

  function handleTypeChange(id: string) {
    setType(id);
    const problem = problems.find((p) => p.id === id);
    if (problem) {
      setTitle(problem.title || "");
      setDescription(problem.description || "");
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

    try {
      const res = await fetch("/api/komify/report", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(onClose, 2000);
      }
    } catch (err) {
      console.error("Report failed", err);
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = !type || !title.trim() || !description.trim() || loading;

  return (
    <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl"
      >
        <div className="bg-rose-500/10 p-6 flex items-center justify-between border-b border-rose-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500 rounded-xl text-white">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Laporkan Masalah
              </h2>
              <p className="text-[10px] text-rose-500/80 font-bold uppercase tracking-widest">
                {comic.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-white">Laporan Terkirim!</h3>
            <p className="text-zinc-400 text-sm">
              Terima kasih atas bantuanmu menjaga komunitas ini.
            </p>
          </div>
        ) : (
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">
                  Kategori
                </label>
                <select
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none appearance-none cursor-pointer"
                  onChange={(e) => handleTypeChange(e.target.value)}
                  value={type}
                >
                  <option value="">Pilih Masalah</option>
                  {problems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">
                  Chapter
                </label>
                <select
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 rounded-2xl p-3 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer"
                  value={selectedChapter}
                  onChange={(e) => {
                    setSelectedChapter(e.target.value);
                    setSelectedPage("");
                  }}
                >
                  <option value="">Global (Semua)</option>
                  {comic.chapters?.map((ch: any) => (
                    <option key={ch.number} value={ch.number}>
                      Ch. {ch.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <input
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl p-4 text-sm focus:border-rose-500/50 outline-none transition-all"
                placeholder="Judul laporan singkat (Contoh: Gambar Blur)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl p-4 text-sm focus:border-rose-500/50 outline-none transition-all resize-none"
                rows={3}
                placeholder="Jelaskan detail masalahnya..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-800 rounded-[24px] hover:bg-zinc-800/30 transition-all cursor-pointer group">
              <div className="flex flex-col items-center justify-center pt-2">
                {screenshot ? (
                  <p className="text-emerald-500 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={14} /> {screenshot.name.slice(0, 20)}...
                  </p>
                ) : (
                  <>
                    <Upload
                      size={20}
                      className="text-zinc-600 group-hover:text-rose-500 transition-colors mb-1"
                    />
                    <p className="text-[10px] font-black text-zinc-500 uppercase">
                      Upload Bukti Screenshot
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              />
            </label>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Admin akan segera meninjau
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={submit}
                  disabled={isDisabled}
                  className="px-8 py-3 bg-rose-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-950/20"
                >
                  {loading ? "Mengirim..." : "Kirim Report"}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
