"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ChapterPreviewModalProps {
  visible: boolean;
  chapter: { number: number; files: File[] };
  onClose: () => void;
  onDragEnd: (result: any) => void;
}

export default function ChapterPreviewModal({
  visible,
  chapter,
  onClose,
  onDragEnd,
}: ChapterPreviewModalProps) {
  if (!visible || !chapter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          Preview Chapter {chapter.number}
        </h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="chapter-images">
            {(provided) => (
              <div
                className="grid grid-cols-2 gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {chapter.files
                  ?.filter((file) => file.type.startsWith("image/"))
                  .map((file, idx) => (
                    <Draggable
                      key={idx}
                      draggableId={`image-${idx}`}
                      index={idx}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Page ${idx + 1}`}
                            className="w-full h-auto rounded shadow cursor-move"
                          />
                          <span className="absolute top-0 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            Page {idx + 1}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button
          onClick={onClose}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
