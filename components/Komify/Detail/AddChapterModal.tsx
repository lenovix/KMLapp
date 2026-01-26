"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  X,
  Upload,
  GripVertical,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { Comic, Chapter } from "@/types/komify";
import comicsDataRaw from "@/data/komify/comics.json";

const comicsData = comicsDataRaw.map((comic) => ({
  ...comic,
  tags: comic.tags || [],
})) as Comic[];

interface Props {
  slug: number;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PagePreview {
  id: string;
  file: File;
  url: string;
}

export default function AddChapterModal({
  slug,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [censoredList, setCensoredList] = useState<Chapter["cencored"][]>([]);
  const [loading, setLoading] = useState(false);
  const [previewPages, setPreviewPages] = useState<PagePreview[]>([]);

  const [form, setForm] = useState<{
    number: string;
    title: string;
    language: string;
    cencored: Chapter["cencored"];
  }>({
    number: "001",
    title: "",
    language: "",
    cencored: "Uncencored",
  });

  const cleanupPreviews = useCallback(() => {
    previewPages.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviewPages([]);
  }, [previewPages]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [resCen, resLang] = await Promise.all([
          fetch("/data/config/cencored.json").then((r) => r.json()),
          fetch("/data/config/language.json").then((r) => r.json()),
        ]);

        setCensoredList(resCen);
        setLanguages(resLang);

        const found = comicsData.find((c) => c.slug === slug);
        const nextNum = found?.chapters?.length
          ? String(
              Math.max(...found.chapters.map((ch) => Number(ch.number) || 0)) +
                1
            ).padStart(3, "0")
          : "001";

        setForm((prev) => ({
          ...prev,
          number: nextNum,
          language: resLang[0] || "",
          cencored: resCen[0] || "Uncencored",
        }));
      } catch (e) {
        console.error("Config load error", e);
      }
    };

    if (open) loadConfig();
    return () => {
      if (!open) cleanupPreviews();
    };
  }, [open, slug]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newPreviews = files.map((file, idx) => ({
      id: `file-${Date.now()}-${idx}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewPages((prev) => [...prev, ...newPreviews]);
  };

  const removePage = (id: string) => {
    setPreviewPages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const onDragEnd = (result: DropResult) => {
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
      fd.append("language", form.language);
      fd.append("cencored", form.cencored);
      previewPages.forEach((p) => fd.append("pages", p.file));

      const res = await fetch("/api/komify/addChapter", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Upload Failed");

      onSuccess?.();
      onClose();
      cleanupPreviews();
    } catch (err) {
      alert("Gagal menambah chapter");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                CHAPTER {form.number}{" "}
                <span className="text-zinc-600 ml-2 font-medium text-lg">
                  / New Entry
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                Chapter Title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter title..."
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                  Language
                </label>
                <select
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-white outline-none appearance-none"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
                  Censorship
                </label>
                <select
                  value={form.cencored}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cencored: e.target.value as Chapter["cencored"],
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-white outline-none appearance-none"
                >
                  {censoredList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                Chapter Content
              </label>
              {previewPages.length > 0 && (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-indigo-500 cursor-pointer hover:text-indigo-400 transition-colors">
                    <Plus size={14} /> ADD PAGES
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={cleanupPreviews}
                    className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} /> CLEAR ALL
                  </button>
                </div>
              )}
            </div>

            {previewPages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 bg-zinc-950/30 p-6 rounded-4xl border border-zinc-800/50"
              >
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <AlertCircle size={14} />
                  <p className="text-[10px] font-bold uppercase">
                    Drag cards to reorder sequence
                  </p>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="pages" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex gap-5 overflow-x-auto pb-6 pt-2 custom-scrollbar"
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
                                className={`relative group shrink-0 w-40 aspect-3/4 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                  snap.isDragging
                                    ? "border-indigo-500 scale-105 z-50 shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                                    : "border-zinc-800 hover:border-zinc-700 hover:shadow-xl hover:-translate-y-1"
                                }`}
                              >
                                <img
                                  src={item.url}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  alt={`Page ${idx + 1}`}
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute top-2 left-2 px-2 py-1 min-w-6 h-6 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-black text-white shadow-lg">
                                  {String(idx + 1).padStart(2, "0")}
                                </div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                  <div className="p-2 bg-indigo-600/90 rounded-full text-white shadow-lg backdrop-blur-sm cursor-grab active:cursor-grabbing">
                                    <GripVertical size={16} />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removePage(item.id);
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500 backdrop-blur-md border border-red-500/20 text-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                >
                                  <Trash2 size={12} />
                                </button>

                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <p className="text-[8px] text-zinc-300 truncate font-medium bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                                    {item.file.name}
                                  </p>
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
            ) : (
              <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-4xl p-20 group hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-zinc-800 p-5 rounded-2xl text-zinc-400 group-hover:text-indigo-500 transition-all mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="text-lg font-bold text-zinc-200">
                    Upload Chapter Pages
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Select multiple images to start
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </form>

        <div className="p-8 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end gap-6">
          <button
            onClick={onClose}
            className="text-sm font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || previewPages.length === 0}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 px-10 py-4 rounded-2xl text-sm font-black text-white transition-all flex items-center gap-3 uppercase tracking-widest"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 size={18} />
            )}
            Publish Chapter
          </button>
        </div>
      </motion.div>
    </div>
  );
}
