"use client";

import { useState, useEffect } from "react";
import DropdownInput from "@/components/UI/DropdownInput";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { Plus, UploadIcon } from "lucide-react";
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
        <div key={index} className="relative">
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeChapter(index)}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-700"
            >
              ✕
            </button>
          )}
          <div className="border border-gray-400/40 rounded-xl p-4 bg-white/10 space-y-4">
            <div
              key={index}
              className="border border-gray-400/40 rounded-xl p-4 bg-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="md:col-span-1 md:row-span-2 flex items-start">
                  <p className="text-white font-semibold">
                    Chapter {ch.number}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <InputText
                    name="title"
                    placeholder="Title"
                    value={ch.title}
                    onChange={(e) => handleChapterChange(index, e)}
                  />
                </div>
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
                <div className="md:col-span-2">
                  <FileUploadInput
                    multiple
                    accept=".zip,.rar,image/*"
                    onChange={(files) => handleChapterFile(index, files)}
                    countFile={ch.files.length}
                  />
                </div>
                <div className="md:col-span-1 flex items-center">
                  {ch.files.length > 0 && (
                    <PrimaryButton
                      type="button"
                      variant="link"
                      onClick={() => openPreview(index)}
                    >
                      Preview
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
