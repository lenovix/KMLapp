"use client";

import ChapterImageGrid from "./ChapterImageGrid";

interface ChapterPreviewModalProps {
  visible: boolean;
  chapter: { number: number; files: File[] };
  onCancel: () => void;
  onDragEnd: (result: any) => void;
  onSave: () => void;
}

export default function ChapterPreviewModal({
  visible,
  chapter,
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
          <h2 className="text-lg font-semibold text-black">
            Preview Chapter {chapter.number}
          </h2>

          <div className="flex items-center gap-3">
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

        {/* Body (Scrollable) */}
        <ChapterImageGrid files={chapter.files} onDragEnd={onDragEnd} />
      </div>
    </div>
  );
}
