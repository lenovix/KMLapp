"use client";

import { useState, useEffect } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";
import {
  Plus,
  Trash2,
  BookOpen,
  Globe,
  ShieldCheck,
  Eye,
  Layers,
  GripVertical,
} from "lucide-react";
import FileUploadInput from "@/components/UI/FileUploadInput";
import InputText from "@/components/UI/InputText";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Chapter {
  number: string;
  title: string;
  language: string;
  cencored: string;
  files: File[];
}

interface ChapterSectionProps {
  chapters: Chapter[];
  addChapter: () => void;
  removeChapter: (index: number) => void;
  reorderChapters: (newChapters: Chapter[]) => void;
  handleChapterChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleChapterFile: (index: number, files: FileList | null) => void;
  openPreview: (index: number) => void;
}

interface ChapterItemProps {
  ch: Chapter;
  index: number;
  removeChapter?: (index: number) => void;
  handleChapterChange?: any;
  handleChapterFile?: any;
  openPreview?: any;
  languages: string[];
  cencoredList: string[];
  isOverlay?: boolean;
}

function ChapterCard({
  ch,
  index,
  removeChapter,
  handleChapterChange,
  handleChapterFile,
  openPreview,
  languages,
  cencoredList,
  isOverlay,
  dragProps = {},
  listeners = {},
}: ChapterItemProps & { dragProps?: any; listeners?: any }) {
  return (
    <div
      className={`group relative rounded-tr-3xl rounded-br-3xl border transition-all duration-500 ease-out backdrop-blur-sm ${
        isOverlay
          ? "border-blue-500/50 bg-zinc-900/90 shadow-[0_20px_50px_rgba(59,130,246,0.15)] scale-[1.03] z-50 cursor-grabbing ring-1 ring-blue-500/20"
          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/60 shadow-lg"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${
          isOverlay
            ? "bg-blue-500 shadow-[2px_0_10px_rgba(59,130,246,0.5)]"
            : "bg-zinc-700 group-hover:bg-blue-500/80"
        }`}
      />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              {...dragProps}
              {...listeners}
              className="flex items-center justify-center p-2 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-tighter">
                  CH {ch.number}
                </span>
                <h3 className="text-sm font-bold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                  {ch.title || `Chapter ${ch.number}`}
                </h3>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                ID CHAPTER: {index + 1}
              </p>
            </div>
          </div>

          {!isOverlay && (
            <button
              type="button"
              onClick={() => removeChapter?.(index)}
              className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Delete Chapter"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12 space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
              <BookOpen size={12} className="text-blue-500" /> Chapter Title
            </label>
            <InputText
              name="title"
              placeholder="e.g. The Beginning of the End"
              value={ch.title}
              onChange={(e) => handleChapterChange(index, e)}
              disabled={isOverlay}
              className="w-full bg-zinc-950/40 border-zinc-800/80 text-sm py-2.5 focus:bg-zinc-950/80 transition-all rounded-xl text-white placeholder:text-zinc-700"
            />
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
              <ShieldCheck size={12} className="text-blue-500" /> Content Type
            </label>
            <select
              name="cencored"
              value={ch.cencored}
              onChange={(e) => handleChapterChange(index, e)}
              disabled={isOverlay}
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              {cencoredList.map((item) => (
                <option key={item} value={item} className="bg-zinc-900">
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
              <Globe size={12} className="text-blue-500" /> Translation
            </label>
            <select
              name="language"
              value={ch.language}
              onChange={(e) => handleChapterChange(index, e)}
              disabled={isOverlay}
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-zinc-900">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Source Files
            </label>
            <FileUploadInput
              multiple
              accept=".zip,.rar,image/*"
              onChange={(files) => handleChapterFile(index, files)}
              countFile={ch.files.length}
            />
          </div>

          {ch.files.length > 0 && (
            <div className="md:col-span-12 flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                  {ch.files.length} Image Pages Loaded
                </span>
              </div>
              <button
                type="button"
                onClick={() => openPreview(index)}
                className="group/btn flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-white bg-blue-500/5 hover:bg-blue-500 transition-all duration-300 py-2 px-4 rounded-xl border border-blue-500/20 hover:border-blue-500 shadow-lg shadow-blue-500/5"
              >
                <Eye
                  size={14}
                  className="group-hover/btn:scale-110 transition-transform"
                />
                PREVIEW & ORGANIZE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SortableChapterItem(props: ChapterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.ch.number });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ChapterCard {...props} dragProps={attributes} listeners={listeners} />
    </div>
  );
}

export default function ChapterSection({
  chapters,
  addChapter,
  removeChapter,
  reorderChapters,
  handleChapterChange,
  handleChapterFile,
  openPreview,
}: ChapterSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [cencoredList, setCencoredList] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch("/data/config/language.json")
      .then((res) => res.json())
      .then(setLanguages)
      .catch(() => setLanguages(["English", "Indonesia", "Japanese"]));

    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then(setCencoredList)
      .catch(() => setCencoredList(["Cencored", "Uncencored"]));
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = chapters.findIndex((ch) => ch.number === active.id);
      const newIndex = chapters.findIndex((ch) => ch.number === over.id);

      const newOrder = arrayMove(chapters, oldIndex, newIndex);
      const renumbered = newOrder.map((ch, i) => ({
        ...ch,
        number: String(i + 1).padStart(3, "0"),
      }));

      reorderChapters(renumbered);
    }
    setActiveId(null);
  };

  const activeChapter = chapters.find((ch) => ch.number === activeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Content Management
            </h2>
            <p className="text-[10px] text-zinc-500 font-medium">
              {chapters.length} Chapters total
            </p>
          </div>
        </div>
        <PrimaryButton
          type="button"
          onClick={addChapter}
          className="bg-blue-600 hover:bg-blue-500 text-xs py-2 px-4 rounded-xl"
          icon={<Plus size={16} />}
        >
          Add New Chapter
        </PrimaryButton>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="space-y-4">
          <SortableContext
            items={chapters.map((ch) => ch.number)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((ch, index) => (
              <SortableChapterItem
                key={ch.number}
                index={index}
                ch={ch}
                removeChapter={removeChapter}
                handleChapterChange={handleChapterChange}
                handleChapterFile={handleChapterFile}
                openPreview={openPreview}
                languages={languages}
                cencoredList={cencoredList}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay adjustScale={true} style={{ translate: -650 }}>
          {activeId && activeChapter ? (
            <ChapterCard
              ch={activeChapter}
              index={chapters.indexOf(activeChapter)}
              languages={languages}
              cencoredList={cencoredList}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {chapters.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-600 font-medium">No chapters added yet.</p>
          <button
            onClick={addChapter}
            className="text-blue-500 text-sm font-bold mt-2 hover:underline"
          >
            Click here to add the first one
          </button>
        </div>
      )}
    </div>
  );
}
