"use client";

import { useState, useEffect } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { Plus } from "lucide-react";
import FileUploadInput from "@/components/UI/FileUploadInput";
import InputText from "@/components/UI/InputText";

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
  handleChapterChange: (
    index: number,
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
  const [cencoredList, setCencoredList] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/config/language.json")
      .then((res) => res.json())
      .then(setLanguages);

    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then(setCencoredList);
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
          className="
            relative
            rounded-xl
            border border-white/15
            bg-white/10
            p-4
            space-y-4
          "
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-blue-400">
              Chapter {ch.number}
            </h3>

            <button
              type="button"
              onClick={() => removeChapter(index)}
              className="
                flex items-center justify-center
                w-8 h-8
                rounded-full
                bg-red-600/80
                text-white
                hover:bg-red-600
                transition
              "
              title="Remove chapter"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-6">
              <label className="block text-xs text-gray-400 mb-1">
                Chapter Title
              </label>
              <InputText
                name="title"
                placeholder="Chapter title"
                value={ch.title}
                onChange={(e) => handleChapterChange(index, e)}
                className="
                  w-full
                  border border-white/10
                  bg-white/10
                  text-white
                  placeholder-gray-400
                  rounded-lg
                  px-3 py-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Cencored Status
              </label>
              <select
                name="cencored"
                value={ch.cencored}
                onChange={(e) => handleChapterChange(index, e)}
                className="
                  w-full
                  rounded-lg
                  border border-white/10
                  bg-white/10
                  px-3 py-2
                  text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                required
              >
                {cencoredList.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-800 text-white"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Language
              </label>
              <select
                name="language"
                value={ch.language}
                onChange={(e) => handleChapterChange(index, e)}
                className="
                  w-full
                  rounded-lg
                  border border-white/10
                  bg-white/10
                  px-3 py-2
                  text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                required
              >
                {languages.map((lang) => (
                  <option
                    key={lang}
                    value={lang}
                    className="bg-slate-800 text-white"
                  >
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">
                Chapter Files
              </label>
              <FileUploadInput
                multiple
                accept=".zip,.rar,image/*"
                onChange={(files) => handleChapterFile(index, files)}
                countFile={ch.files.length}
              />
            </div>

            {ch.files.length > 0 && (
              <div className="md:col-span-6 flex justify-end">
                <PrimaryButton
                  type="button"
                  variant="link"
                  onClick={() => openPreview(index)}
                >
                  Preview Files
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
