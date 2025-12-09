"use client";

import { useState, useEffect } from "react";
import DropdownInput from "@/components/UI/DropdownInput";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { Plus } from "lucide-react";
import FileUploadInput from "@/components/UI/FileUploadInput";
import InputText from "@/components/UI/InputText";

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">📄 Chapters</h2>
        <PrimaryButton
          type="button"
          variant="primary"
          size="md"
          icon={<Plus size={14} />}
          onClick={addChapter}
        >
          Add
        </PrimaryButton>
      </div>

      {chapters.map((ch, index) => (
        <div
          key={index}
          className="border border-gray-400/40 rounded-xl p-4 bg-white/10 space-y-4"
        >
          {/* Row 1: Chapter Number + Title */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
            {/* Chapter Number */}
            <p className="text-white font-semibold md:col-span-1">
              Chapter {ch.number}
            </p>

            {/* Title */}
            <div className="md:col-span-5">
              <InputText
                name="title"
                placeholder="Title"
                value={ch.title}
                onChange={(e) => handleChapterChange(index, e)}
              />
            </div>
          </div>

          {/* Row 2: Language + Upload File + Delete Button */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
            {/* Language */}
            <div className="md:col-span-2">
              <DropdownInput
                name="language"
                listId="chapter-language-list"
                placeholder="Language"
                value={ch.language}
                onChange={(e) => handleChapterChange(index, e)}
                options={languages}
              />
            </div>

            {/* Upload File */}
            <div className="md:col-span-3">
              <FileUploadInput
                multiple
                accept=".zip,.rar,image/*"
                onChange={(files) => handleChapterFile(index, files)}
              />
            </div>

            {/* Delete Chapter */}
            <div className="md:col-span-1 flex md:justify-end">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeChapter(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded w-full md:w-auto"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Preview Files */}
          {ch.files?.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-500/30">
              <p className="text-sm text-gray-300">
                {ch.files.length} file dipilih
              </p>
              <PrimaryButton
                type="button"
                variant="link"
                onClick={() => openPreview(index)}
              >
                Preview
              </PrimaryButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
