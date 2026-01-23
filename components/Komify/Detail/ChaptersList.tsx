"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Pencil,
  Trash,
  GripVertical,
  Image as ImageIcon,
  Calendar,
  Settings2,
  X,
  Save,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import PrimaryButton from "@/components/UI/PrimaryButton";

dayjs.extend(relativeTime);

const LANGUAGE_FLAG_MAP: Record<string, { label: string; flag: string }> = {
  English: { label: "English", flag: "🇺🇸" },
  Japanese: { label: "Japanese", flag: "🇯🇵" },
  Chinese: { label: "Chinese", flag: "🇨🇳" },
  Indonesian: { label: "Indo", flag: "🇮🇩" },
  Korean: { label: "Korean", flag: "🇰🇷" },
};

const getLanguageMeta = (lang?: string) =>
  LANGUAGE_FLAG_MAP[lang ?? ""] ?? { label: lang ?? "Unknown", flag: "🏳️" };

const getCencoredMeta = (value?: string) => {
  if (value?.toLowerCase() === "uncensored") {
    return {
      label: "Uncensored",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  }
  return {
    label: "Censored",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
};

export default function ChaptersList({
  slug,
  chapters,
  onDeleteChapter,
  setChapters,
  isOrdering,
}: {
  slug: number;
  chapters: any[];
  onDeleteChapter?: (chapterNumber: number) => void;
  setChapters: (chapters: any[]) => void;
  isOrdering: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [editingPages, setEditingPages] = useState<any[]>([]);

  const [languages, setLanguages] = useState<string[]>([]);
  const [censoredList, setCensoredList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const openPagesModal = async (ch: any) => {
    setEditingChapter(ch);
    setIsLoadingPages(true);
    setIsPagesModalOpen(true);

    try {
      const res = await fetch(
        `/api/komify/orderingPages?slug=${slug}&chapter=${ch.number}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data chapter");

      const data = await res.json();
      setEditingPages(data.pages || []);
    } catch (error) {
      alert("Gagal memuat gambar");
      setIsPagesModalOpen(false);
    } finally {
      setIsLoadingPages(false);
    }
  };

  useEffect(() => {
    fetch("/data/config/language.json")
      .then((res) => res.json())
      .then(setLanguages);
    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then(setCensoredList);
  }, []);

  const openEditModal = (ch: any) => {
    setEditingChapter({ ...ch });
    setIsModalOpen(true);
  };

  const handleUpdateChapterInfo = async () => {
    if (!editingChapter) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("slug", String(slug));
      formData.append("chapter", String(editingChapter.number));
      formData.append("title", editingChapter.title || "");
      formData.append("language", editingChapter.language || "");
      formData.append("cencored", editingChapter.cencored || "");

      const res = await fetch("/api/komify/editChapter", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed");

      setChapters(
        chapters.map((c) =>
          c.number === editingChapter.number
            ? { ...editingChapter, updatedAt: new Date().toISOString() }
            : c
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan info");
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEndPages = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(editingPages);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setEditingPages(items);
  };

  const handleSavePagesOrder = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/komify/orderingPages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug,
          chapterNumber: editingChapter.number,
          pages: editingPages,
        }),
      });

      if (!res.ok) throw new Error("Failed to save pages order");

      const updatedChapters = chapters.map((ch) =>
        ch.number === editingChapter.number
          ? { ...ch, pages: editingPages }
          : ch
      );

      setChapters(updatedChapters);
      setIsPagesModalOpen(false);
      alert("Urutan gambar berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan urutan gambar");
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEndChapters = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index)
      return;
    const items = Array.from(chapters);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setChapters(items);
  };

  const handleDeletePage = async (filename: string) => {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      const res = await fetch(
        `/api/komify/orderingPages?slug=${slug}&chapter=${editingChapter.number}&filename=${filename}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setEditingPages((prev) => prev.filter((p) => p.filename !== filename));
      }
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  const handleDeleteAllPages = async () => {
    if (
      !confirm(
        "Hapus SEMUA gambar di chapter ini? Tindakan ini tidak bisa dibatalkan."
      )
    )
      return;
    try {
      const res = await fetch(
        `/api/komify/orderingPages?slug=${slug}&chapter=${editingChapter.number}&all=true`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setEditingPages([]);
      }
    } catch (error) {
      alert("Gagal menghapus semua");
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append("slug", String(slug));
    formData.append("chapter", editingChapter.number);
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/komify/uploadPages", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        openPagesModal(editingChapter);
      }
    } catch (error) {
      alert("Gagal upload");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEndChapters}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-full mx-auto space-y-3"
            >
              {chapters.map((ch, index) => {
                const langMeta = getLanguageMeta(ch.language);
                const cMeta = getCencoredMeta(ch.cencored);
                return (
                  <Draggable
                    key={`ch-${ch.number}`}
                    draggableId={`ch-${ch.number}`}
                    index={index}
                    isDragDisabled={!isOrdering}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative group flex items-stretch bg-zinc-900 border transition-all duration-300 rounded-2xl overflow-hidden ${
                          snapshot.isDragging
                            ? "border-blue-500 shadow-2xl scale-[1.02] z-50 bg-zinc-800"
                            : "border-zinc-800"
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className={`flex items-center justify-center w-12 shrink-0 border-r border-zinc-800/50 ${
                            isOrdering
                              ? "bg-blue-500/5 text-blue-500"
                              : "text-zinc-700 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <GripVertical size={20} />
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/komify/${slug}/read/${ch.number}`}
                              className="flex items-center gap-3 mb-2 group/title w-fit"
                            >
                              <span className="text-xl font-black text-white tracking-tighter group-hover/title:text-blue-400 transition-colors">
                                CH {ch.number}
                              </span>
                              <h4 className="text-sm font-bold text-zinc-400 truncate max-w-50 md:max-w-xs group-hover/title:text-zinc-200">
                                {ch.title || "Untitled Chapter"}
                              </h4>
                            </Link>

                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50">
                                <span className="text-xs">{langMeta.flag}</span>
                                <span className="text-[10px] font-black uppercase text-zinc-300">
                                  {langMeta.label}
                                </span>
                              </div>

                              <div
                                className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${cMeta.className}`}
                              >
                                {cMeta.label}
                              </div>

                              <div className="flex items-center gap-4 text-[10px] font-black uppercase text-zinc-500 ml-1">
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={12} />
                                  {dayjs(
                                    ch.updatedAt ?? ch.uploadChapter
                                  ).fromNow()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <ImageIcon size={12} />
                                  {ch.pages?.length || 0} Pages
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(ch)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                              <Settings2 size={16} className="text-blue-400" />{" "}
                              <span className="hidden sm:inline">Info</span>
                            </button>

                            <button
                              onClick={() => openPagesModal(ch)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                              <Pencil size={16} />{" "}
                              <span className="hidden sm:inline">Pages</span>
                            </button>

                            <button
                              onClick={() => onDeleteChapter?.(ch.number)}
                              className="p-2.5 rounded-xl text-zinc-600 hover:text-rose-500 transition-all"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && editingChapter && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 text-white">
              <h3 className="font-black uppercase tracking-widest text-sm">
                Edit Chapter Info
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                Chapter Title
              </label>
              <input
                placeholder="Masukkan judul chapter..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
                value={editingChapter.title}
                onChange={(e) =>
                  setEditingChapter({
                    ...editingChapter,
                    title: e.target.value,
                  })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                    Language
                  </label>
                  <select
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white appearance-none cursor-pointer focus:border-blue-500 outline-none"
                    value={editingChapter.language}
                    onChange={(e) =>
                      setEditingChapter({
                        ...editingChapter,
                        language: e.target.value,
                      })
                    }
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {getLanguageMeta(l).flag} {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1">
                    Censorship
                  </label>
                  <select
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white appearance-none cursor-pointer focus:border-blue-500 outline-none"
                    value={editingChapter.cencored}
                    onChange={(e) =>
                      setEditingChapter({
                        ...editingChapter,
                        cencored: e.target.value,
                      })
                    }
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
            <div className="p-6 bg-zinc-950/50 flex gap-3">
              <PrimaryButton
                className="flex-1"
                onClick={handleUpdateChapterInfo}
                disabled={isSaving}
              >
                Simpan Info
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {isPagesModalOpen && editingChapter && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-4xl h-[80vh] rounded-4xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="font-black uppercase tracking-widest text-sm text-white">
                  Reorder Pages
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">
                  CH {editingChapter.number} • {editingPages.length} Images
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteAllPages}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase transition-all"
                >
                  Delete All
                </button>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[10px] font-black uppercase transition-all">
                  Add Images
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleAddImages}
                    accept="image/*"
                  />
                </label>
                <button
                  onClick={() => setIsPagesModalOpen(false)}
                  className="p-2 text-zinc-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isLoadingPages ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-3">
                  <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <p className="text-xs font-black uppercase tracking-widest">
                    Loading Pages...
                  </p>
                </div>
              ) : editingPages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                  <ImageIcon size={40} className="mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase">
                    No images in this chapter
                  </p>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEndPages}>
                  <Droppable droppableId="modal-pages" direction="horizontal">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      >
                        {editingPages.map((page, idx) => (
                          <Draggable
                            key={page.id}
                            draggableId={page.id}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`relative aspect-3/4 rounded-xl overflow-hidden border-2 transition-all group ${
                                  snapshot.isDragging
                                    ? "border-blue-500 z-50 scale-105 shadow-2xl"
                                    : "border-zinc-800"
                                }`}
                              >
                                <img
                                  src={page.fullUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePage(page.filename);
                                  }}
                                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash size={14} />
                                </button>

                                <div className="absolute bottom-2 left-2 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black text-white">
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
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-950/50 flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">
                * Drag and drop images to reorder
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPagesModalOpen(false)}
                  className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePagesOrder}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Save size={14} />
                  {isSaving ? "Saving..." : "Save Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
