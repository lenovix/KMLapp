"use client";

import { useEffect, useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash } from "lucide-react";

interface ChapterImageGridProps {
  files: File[];
  onReorder: (files: File[]) => void;
  onDelete: (index: number) => void;
}

function SortableImage({
  id,
  url,
  index,
  onDelete,
  isOverlay = false,
}: {
  id: string;
  url: string;
  index: number;
  onDelete?: (idx: number) => void;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group aspect-3/4 overflow-hidden rounded-2xl transition-shadow select-none bg-slate-100 dark:bg-slate-800 border-2 
        ${
          isOverlay
            ? "shadow-2xl scale-105 border-blue-500 z-50 ring-4 ring-blue-500/20"
            : "shadow-sm border-transparent hover:border-slate-300 dark:hover:border-slate-600"
        }
      `}
    >
      {!isOverlay && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete?.(index)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-600 shadow-lg"
        >
          <Trash className="w-3.5 h-3.5" />
        </button>
      )}
      <img
        src={url}
        alt={`Page ${index + 1}`}
        className="w-full h-full object-cover pointer-events-none"
      />

      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white z-10">
        <span className="text-[10px] font-bold tracking-tight">
          {index + 1}
        </span>
      </div>

      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-lg text-slate-600 dark:text-slate-300">
          <GripVertical className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function ChapterImageGrid({
  files,
  onReorder,
  onDelete,
}: ChapterImageGridProps) {
  const imageFiles = useMemo(
    () => files.filter((f) => f.type.startsWith("image/")),
    [files]
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ id: string; url: string }[]>([]);

  useEffect(() => {
    const newPreviews = imageFiles.map((file) => ({
      id: `${file.name}-${file.size}`,
      url: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [imageFiles]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = previews.findIndex((item) => item.id === active.id);
      const newIndex = previews.findIndex((item) => item.id === over.id);

      const reorderedFiles = arrayMove(imageFiles, oldIndex, newIndex);
      onReorder(reorderedFiles);
    }
  };

  const activeItem = previews.find((p) => p.id === activeId);

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={previews.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-2">
            {previews.map((item, idx) => (
              <SortableImage
                key={item.id}
                id={item.id}
                url={item.url}
                index={idx}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay adjustScale={true}>
          {activeItem ? (
            <SortableImage
              id={activeItem.id}
              url={activeItem.url}
              index={previews.findIndex((p) => p.id === activeId)}
              onDelete={onDelete}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
