"use client";

import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Pencil,
  Trash,
  GripVertical,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

dayjs.extend(relativeTime);

const LANGUAGE_FLAG_MAP: Record<string, { label: string; flag: string }> = {
  English: { label: "English", flag: "🇺🇸" },
  Japanese: { label: "Japanese", flag: "🇯🇵" },
  Chinese: { label: "Chinese", flag: "🇨🇳" },
  Indonesia: { label: "Indo", flag: "🇮🇩" },
  Korean: { label: "Korean", flag: "🇰🇷" },
};

const getLanguageMeta = (lang?: string) =>
  LANGUAGE_FLAG_MAP[lang ?? ""] ?? {
    label: lang ?? "Unknown",
    flag: "🏳️",
  };

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
  const getDragId = (ch: any, index: number) =>
    ch._id ?? `chapter-${ch.number}-${index}`;

  if (!chapters || chapters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-800 rounded-[32px] text-zinc-500">
        <ImageIcon size={48} className="mb-4 opacity-20" />
        <p className="font-bold uppercase tracking-widest text-xs">
          No chapters found
        </p>
      </div>
    );
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setChapters(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
              const pageCount = Array.isArray(ch.pages) ? ch.pages.length : 0;

              return (
                <Draggable
                  key={getDragId(ch, index)}
                  draggableId={getDragId(ch, index)}
                  index={index}
                  isDragDisabled={!isOrdering}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`
                        relative group flex items-stretch bg-zinc-900 border transition-all duration-300 rounded-2xl overflow-hidden
                        ${
                          snapshot.isDragging
                            ? "border-blue-500 shadow-2xl scale-[1.02] z-50 bg-zinc-800"
                            : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                        }
                      `}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className={`
                          flex items-center justify-center w-12 shrink-0 border-r border-zinc-800/50
                          ${isOrdering ? "bg-blue-500/5 text-blue-500 cursor-grab active:cursor-grabbing" : "text-zinc-700 opacity-0 group-hover:opacity-100"}
                          transition-all duration-300
                        `}
                      >
                        <GripVertical size={20} />
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
                        <Link
                          href={`/komify/${slug}/read/${ch.number}`}
                          className="flex-1 min-w-0"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xl font-black text-white tracking-tighter">
                              CH {ch.number}
                            </span>
                            <div className="h-4 w-[1px] bg-zinc-800" />
                            <h4 className="text-sm font-bold text-zinc-400 truncate group-hover:text-zinc-200 transition-colors">
                              {ch.title || "Untitled Chapter"}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar
                                size={12}
                                className="text-blue-500/50"
                              />
                              {dayjs(ch.uploadChapter).fromNow()}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <ImageIcon
                                size={12}
                                className="text-purple-500/50"
                              />
                              {pageCount} Pages
                            </span>
                          </div>
                        </Link>

                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-black text-zinc-400 flex items-center gap-1.5">
                              <span>{langMeta.flag}</span>
                              {langMeta.label}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${cMeta.className}`}
                            >
                              {cMeta.label.toUpperCase()}
                            </span>
                          </div>

                          <div className="h-8 w-[1px] bg-zinc-800 hidden md:block mx-2" />

                          <div className="flex items-center gap-1">
                            <Link
                              href={`/komify/edit-chapter?slug=${slug}&chapter=${ch.number}`}
                              className="p-2.5 rounded-xl text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all group/btn"
                              title="Edit Chapter"
                            >
                              <Pencil size={18} />
                            </Link>
                            <button
                              onClick={() =>
                                onDeleteChapter && onDeleteChapter(ch.number)
                              }
                              className="p-2.5 rounded-xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all group/btn"
                              title="Delete Chapter"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {isOrdering && !snapshot.isDragging && (
                        <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-500/10 rounded-2xl animate-pulse" />
                      )}
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
  );
}
