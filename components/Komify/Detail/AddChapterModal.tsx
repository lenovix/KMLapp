"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import comicsDataRaw from "@/data/komify/comics.json";
const comicsData = comicsDataRaw as Comic[];
import {
  X,
  Upload,
  GripVertical,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Comic, Chapter } from "@/types/komify";

interface Props {
  slug: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddChapterModal({
  slug,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [cencoredList, setCencoredList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    number: "001",
    title: "",
    language: "",
    cencored: "",
  });

  const [previewPages, setPreviewPages] = useState<
    Array<{ id: string; file: File; url: string }>
  >([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [resCen, resLang] = await Promise.all([
          fetch("/data/config/cencored.json").then((r) => r.json()),
          fetch("/data/config/language.json").then((r) => r.json()),
        ]);
        setCencoredList(resCen);
        setLanguages(resLang);

        if (resLang.length > 0 || resCen.length > 0) {
          setForm((prev) => ({
            ...prev,
            language: prev.language || resLang[0],
            cencored: prev.cencored || resCen[0],
          }));
        }
      } catch (e) {
        console.error("Config load error", e);
      }
    };

    if (open) {
      loadConfig();
      const found = comicsData.find((c: Comic) => c.slug === slug);
      if (found) {
        const nextNum =
          found.chapters && found.chapters.length > 0
            ? String(
                Math.max(
                  ...found.chapters.map(
                    (ch: Chapter) => Number(ch.number) || 0,
                  ),
                ) + 1,
              ).padStart(3, "0")
            : "001";

        setForm((prev) => ({ ...prev, number: nextNum }));
      }
    }
  }, [open, slug]);

  if (!open) return null;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newPreviews = files.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewPages((prev) => [...prev, ...newPreviews]);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(previewPages);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setPreviewPages(items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || previewPages.length === 0) return;
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("slug", String(slug));
      fd.append("number", form.number);
      fd.append("title", form.title);
      fd.append("language", form.language || languages[0]);
      fd.append("cencored", form.cencored || cencoredList[0]);
      previewPages.forEach((p) => fd.append("pages", p.file));

      const res = await fetch("/api/komify/addChapter", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload Failed");

      onSuccess?.();
      onClose();
    } catch (err) {
      alert("Gagal menambah chapter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                Add Chapter {form.number}
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Upload and organize comic pages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Chapter Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter chapter title..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Language
                </label>
                <select
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white outline-none appearance-none cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Censorship
                </label>
                <select
                  value={form.cencored}
                  onChange={(e) =>
                    setForm({ ...form, cencored: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-white outline-none appearance-none cursor-pointer"
                >
                  {cencoredList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Chapter Content
            </label>
            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[24px] p-12 group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-zinc-800 p-4 rounded-full text-zinc-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300 mb-4">
                  <Upload size={32} />
                </div>
                <span className="text-sm font-bold text-zinc-300">
                  Click to upload pages
                </span>
                <span className="text-xs text-zinc-500 mt-1">
                  Multi-selection supported (JPG, PNG, WEBP)
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="hidden"
              />
            </label>
          </div>

          <AnimatePresence>
            {previewPages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Sort Pages ({previewPages.length})
                  </p>
                  <button
                    type="button"
                    onClick={() => setPreviewPages([])}
                    className="text-[10px] font-bold text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="pages" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
                      >
                        {previewPages.map((item, idx) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={idx}
                          >
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`relative group shrink-0 w-32 aspect-[3/4] rounded-2xl overflow-hidden border ${snap.isDragging ? "border-blue-500 shadow-2xl z-50" : "border-zinc-800"}`}
                              >
                                <img
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <GripVertical className="text-white opacity-50" />
                                </div>
                                <div className="absolute top-2 left-2 bg-blue-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-lg shadow-lg text-white">
                                  {idx + 1}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-xs font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || previewPages.length === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 px-8 py-3 rounded-xl text-xs font-black text-white shadow-xl shadow-blue-900/20 transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Publish Chapter
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
