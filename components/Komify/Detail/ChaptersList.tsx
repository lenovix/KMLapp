"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  Loader2,
} from "lucide-react";
import PrimaryButton from "@/components/UI/PrimaryButton";

dayjs.extend(relativeTime);

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

function SortablePage({ page, idx, onDeletePage }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-3/4 rounded-xl overflow-hidden border-2 transition-all group ${
        isDragging
          ? "opacity-30 border-blue-500"
          : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <img
          src={page.fullUrl}
          alt=""
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeletePage(page.filename);
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
      >
        <Trash size={14} />
      </button>
      <div className="absolute bottom-2 left-2 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black text-white">
        {idx + 1}
      </div>
    </div>
  );
}

function SortableChapter({
  ch,
  slug,
  isOrdering,
  openEditModal,
  openPagesModal,
  onDeleteChapter,
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `ch-${ch.number}`,
    disabled: !isOrdering,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const langMeta = getLanguageMeta(ch.language);
  const cMeta = getCencoredMeta(ch.cencored);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group flex items-stretch bg-zinc-900 border transition-all rounded-2xl overflow-hidden ${
        isDragging
          ? "border-blue-500 shadow-2xl z-50 bg-zinc-800 opacity-50"
          : "border-zinc-800"
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`flex items-center justify-center w-12 shrink-0 border-r border-zinc-800/50 ${
          isOrdering
            ? "bg-blue-500/10 text-blue-500 cursor-grab"
            : "text-zinc-700 opacity-0"
        }`}
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/komify/${slug}/read/${ch.number}`}
            className="flex items-center gap-3 mb-2 w-fit group/title"
          >
            <span className="text-xl font-black text-white group-hover/title:text-blue-400 transition-colors">
              CH {ch.number}
            </span>
            <h4 className="text-sm font-bold text-zinc-400 truncate max-w-xs">
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
              className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase ${cMeta.className}`}
            >
              {cMeta.label}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />{" "}
                {dayjs(ch.updatedAt || ch.uploadChapter).fromNow()}
              </span>
              <span className="flex items-center gap-1">
                <ImageIcon size={12} /> {ch.pages?.length || 0} Pgs
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(ch)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white transition-all text-[10px] font-black uppercase"
          >
            <Settings2 size={16} className="text-blue-400" />{" "}
            <span className="hidden sm:inline">Info</span>
          </button>
          <button
            onClick={() => openPagesModal(ch)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-[10px] font-black uppercase"
          >
            <Pencil size={16} /> <span className="hidden sm:inline">Pages</span>
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
  );
}

const LANGUAGE_FLAG_MAP: Record<string, { label: string; flag: string }> = {
  English: { label: "English", flag: "🇺🇸" },
  Japanese: { label: "Japanese", flag: "🇯🇵" },
  Indonesian: { label: "Indo", flag: "🇮🇩" },
};
const getLanguageMeta = (lang?: string) =>
  LANGUAGE_FLAG_MAP[lang ?? ""] ?? { label: lang ?? "Unknown", flag: "🏳️" };
const getCencoredMeta = (val?: string) =>
  val?.toLowerCase() === "uncensored"
    ? {
        label: "Uncensored",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      }
    : {
        label: "Censored",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      };

export default function ChaptersList({
  slug,
  chapters,
  onDeleteChapter,
  setChapters,
  isOrdering,
}: any) {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [editingPages, setEditingPages] = useState<any[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [censoredList, setCensoredList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setMounted(true);
    fetch("/data/config/language.json")
      .then((res) => res.json())
      .then(setLanguages);
    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then(setCensoredList);
  }, []);

  if (!mounted) {
    return <div className="w-full space-y-3 opacity-0">Loading...</div>;
  }

  const handleDragEndChapters = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = chapters.findIndex(
        (c: any) => `ch-${c.number}` === active.id,
      );
      const newIndex = chapters.findIndex(
        (c: any) => `ch-${c.number}` === over.id,
      );
      setChapters(arrayMove(chapters, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const handleDragEndPages = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = editingPages.findIndex((p) => p.id === active.id);
      const newIndex = editingPages.findIndex((p) => p.id === over.id);
      setEditingPages((prev) => arrayMove(prev, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  const openPagesModal = async (ch: any) => {
    setEditingChapter(ch);
    setIsLoadingPages(true);
    setIsPagesModalOpen(true);
    try {
      const res = await fetch(
        `/api/komify/orderingPages?slug=${slug}&chapter=${ch.number}`,
      );
      const data = await res.json();
      setEditingPages(data.pages || []);
    } catch (error) {
      setIsPagesModalOpen(false);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleUpdateChapterInfo = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("slug", String(slug));
      formData.append("chapter", String(editingChapter.number));
      formData.append("title", editingChapter.title || "");
      formData.append("language", editingChapter.language || "");
      formData.append("cencored", editingChapter.cencored || "");

      await fetch("/api/komify/editChapter", {
        method: "POST",
        body: formData,
      });
      setChapters(
        chapters.map((c: any) =>
          c.number === editingChapter.number
            ? { ...editingChapter, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePagesOrder = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/komify/orderingPages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          chapterNumber: editingChapter.number,
          pages: editingPages,
        }),
      });
      setChapters(
        chapters.map((ch: any) =>
          ch.number === editingChapter.number
            ? { ...ch, pages: editingPages }
            : ch,
        ),
      );
      setIsPagesModalOpen(false);
    } catch (error) {
      alert("Gagal simpan urutan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePage = async (filename: string) => {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      const res = await fetch(
        `/api/komify/orderingPages?slug=${slug}&chapter=${editingChapter.number}&filename=${filename}`,
        { method: "DELETE" },
      );
      if (res.ok)
        setEditingPages((prev) => prev.filter((p) => p.filename !== filename));
    } catch (error) {
      alert("Gagal hapus");
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEndChapters}
      >
        <SortableContext
          items={chapters.map((ch: any) => `ch-${ch.number}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="w-full space-y-3">
            {chapters.map((ch: any) => (
              <SortableChapter
                key={`ch-${ch.number}`}
                ch={ch}
                slug={slug}
                isOrdering={isOrdering}
                openEditModal={(ch: any) => {
                  setEditingChapter({ ...ch });
                  setIsModalOpen(true);
                }}
                openPagesModal={openPagesModal}
                onDeleteChapter={onDeleteChapter}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={dropAnimationConfig} adjustScale={true}>
          {activeId ? (
            <div className="w-full bg-zinc-800 border border-blue-500 rounded-2xl h-24 opacity-80 shadow-2xl" />
          ) : null}
        </DragOverlay>
      </DndContext>

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
              <input
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                value={editingChapter.title}
                onChange={(e) =>
                  setEditingChapter({
                    ...editingChapter,
                    title: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
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
                      {l}
                    </option>
                  ))}
                </select>
                <select
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
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
              <PrimaryButton
                className="w-full"
                onClick={handleUpdateChapterInfo}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Simpan Info"
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {isPagesModalOpen && editingChapter && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-5xl h-[85vh] rounded-4xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="font-black uppercase text-white">
                  Reorder Pages: CH {editingChapter.number}
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">
                  {editingPages.length} Images Loaded
                </p>
              </div>
              <button
                onClick={() => setIsPagesModalOpen(false)}
                className="p-2 text-zinc-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isLoadingPages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={(e) => setActiveId(e.active.id as string)}
                  onDragEnd={handleDragEndPages}
                >
                  <SortableContext
                    items={editingPages.map((p) => p.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {editingPages.map((page, idx) => (
                        <SortablePage
                          key={page.id}
                          page={page}
                          idx={idx}
                          onDeletePage={handleDeletePage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay dropAnimation={dropAnimationConfig}>
                    {activeId ? (
                      <div className="aspect-3/4 w-full bg-blue-600/20 border-2 border-blue-500 rounded-xl animate-pulse" />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-950/50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPagesModalOpen(false)}
                className="px-6 py-2 text-[10px] font-black uppercase text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePagesOrder}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                <Save size={14} /> {isSaving ? "Saving..." : "Save Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
