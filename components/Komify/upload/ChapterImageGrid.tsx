"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Eye } from "lucide-react";

interface ChapterImageGridProps {
  files: File[];
  onDragEnd: (result: any) => void;
}

export default function ChapterImageGrid({
  files,
  onDragEnd,
}: ChapterImageGridProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  useEffect(() => {
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return (
    <div className="p-2 overflow-y-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="chapter-images"
          direction="horizontal"
          type="grid"
        >
          {(provided, snapshot) => (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4 rounded-3xl transition-colors duration-300 ${
                snapshot.isDraggingOver
                  ? "bg-blue-50/50 dark:bg-blue-900/10"
                  : ""
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {previews.map((url, idx) => (
                <Draggable
                  key={`${url}-${idx}`}
                  draggableId={`image-${idx}`}
                  index={idx}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative group aspect-3/4 overflow-hidden rounded-3xl transition-all duration-300 select-none bg-slate-100 dark:bg-slate-800 border-2 ${
                        snapshot.isDragging
                          ? "shadow-2xl scale-105 border-blue-500 z-50 ring-4 ring-blue-500/20"
                          : "shadow-sm border-transparent hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-lg">
                        <span className="text-[10px] font-black tracking-widest uppercase">
                          P. {idx + 1}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white">
                          <GripVertical className="w-6 h-6" />
                        </div>
                      </div>

                      <div
                        className={`absolute inset-0 rounded-3xl border-2 border-blue-500 transition-opacity pointer-events-none ${
                          snapshot.isDragging ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
