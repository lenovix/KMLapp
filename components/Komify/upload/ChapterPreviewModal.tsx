"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ChapterPreviewModalProps {
  visible: boolean;
  chapter: { number: number; files: File[] };
  onClose: () => void;
  onCancel: () => void;
  onDragEnd: (result: any) => void;
  onSave: () => void; // ✅ tambahkan
}

export default function ChapterPreviewModal({
  visible,
  chapter,
  onClose,
  onCancel,
  onDragEnd,
  onSave,
}: ChapterPreviewModalProps) {
  if (!visible || !chapter) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">
            Preview Chapter {chapter.number}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Body (Scrollable Area) */}
        <div className="p-4 overflow-y-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapter-images">
              {(provided) => (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
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
                            className="relative group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Page ${idx + 1}`}
                              className="w-full h-auto rounded-lg shadow hover:shadow-lg transition cursor-move select-none"
                            />

                            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-80">
                              Page {idx + 1}
                            </span>

                            {/* Hover highlight */}
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

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          {/* Cancel */}
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition shadow-sm"
          >
            Cancel
          </button>

          {/* Save */}
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
