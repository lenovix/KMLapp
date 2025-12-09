"use client";

import { useState, useEffect } from "react";
import DropdownInput from "@/components/UI/DropdownInput";

interface Chapter {
  number: string;
  title: string;
  language: string;
  files: File[];
}

interface ChapterSectionProps {
  chapters: Chapter[];
  addChapter: () => void;
  removeChapter: (index: number) => void;
  handleChapterChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleChapterFile: (index: number, files: FileList | null) => void;
  openPreview: (index: number) => void;
}

export default function ChapterSection({
  chapters,
  addChapter,
  removeChapter,
  handleChapterChange,
  handleChapterFile,
  openPreview,
}: ChapterSectionProps) {
  const [languages, setLanguages] = useState<string[]>([]);
  useEffect(() => {
    fetch("/data/config/language.json")
      .then((res) => res.json())
      .then(setLanguages);
  }, []);
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
      {/* Header: Title + Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">📄 Chapters</h2>

        <button
          type="button"
          onClick={addChapter}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          + Add
        </button>
      </div>

      {chapters.map((ch, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-3 bg-white/10 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {/* Chapter Number */}
            <input
              name="number"
              placeholder="Ch. #"
              value={ch.number}
              onChange={(e) => handleChapterChange(index, e)}
              className="border p-2 rounded bg-white/20 text-white placeholder-gray-300"
            />

            {/* Title */}
            <input
              name="title"
              placeholder="Title"
              value={ch.title}
              onChange={(e) => handleChapterChange(index, e)}
              className="border p-2 rounded bg-white/20 text-white placeholder-gray-300"
            />

            {/* Language (Combobox) */}
            <DropdownInput
              name="language"
              listId="chapter-language-list"
              placeholder="Language"
              value={ch.language}
              onChange={(e) => handleChapterChange(index, e)}
              options={languages}
            />

            {/* Upload File */}
            <input
              type="file"
              multiple
              accept=".zip,.rar,image/*"
              onChange={(e) => handleChapterFile(index, e.target.files)}
              className="border p-2 rounded bg-white/20 text-white"
            />

            {/* Delete Chapter */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeChapter(index)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                ✕
              </button>
            )}
          </div>

          {/* Preview Files */}
          {ch.files?.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-300">
                {ch.files.length} file dipilih
              </p>
              <button
                type="button"
                onClick={() => openPreview(index)}
                className="text-sm text-blue-300 hover:underline"
              >
                Preview
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
