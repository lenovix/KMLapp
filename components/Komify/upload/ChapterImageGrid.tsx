"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ChapterImageGridProps {
  files: File[];
  onDragEnd: (result: any) => void;
}

export default function ChapterImageGrid({
  files,
  onDragEnd,
}: ChapterImageGridProps) {
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));

  return (
    <div className="p-4 overflow-y-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapter-images">
          {(provided) => (
            <div
              className="grid grid-cols-5 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {imageFiles.map((file, idx) => (
                <Draggable key={idx} draggableId={`image-${idx}`} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative group aspect-square overflow-hidden rounded-lg shadow hover:shadow-lg transition cursor-move select-none bg-gray-100"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Page ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-80">
                        Page {idx + 1}
                      </span>

                      <div className="absolute inset-0 rounded-lg border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
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
