"use client";

import { useState, useEffect } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";
import {
  Plus,
  Trash2,
  BookOpen,
  Globe,
  ShieldCheck,
  Eye,
  Layers,
} from "lucide-react";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
      .then(setLanguages)
      .catch(() => setLanguages(["English", "Indonesia", "Japanese"]));

    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then(setCencoredList)
      .catch(() => setCencoredList(["Cencored", "Uncencored"]));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Content Management
            </h2>
            <p className="text-[10px] text-zinc-500 font-medium">
              {chapters.length} Chapters total
            </p>
          </div>
        </div>
        <PrimaryButton
          type="button"
          onClick={addChapter}
          className="bg-blue-600 hover:bg-blue-500 text-xs py-2 px-4 rounded-xl"
          icon={<Plus size={16} />}
        >
          Add New Chapter
        </PrimaryButton>
      </div>

      <div className="space-y-4">
        {chapters.map((ch, index) => (
          <div
            key={index}
            className="group relative rounded-3xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-400 group-hover:text-blue-400 transition-colors">
                    {ch.number}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-200 tracking-tight">
                    Editing Chapter {ch.number}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => removeChapter(index)}
                  className="p-2 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Remove chapter"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-12 space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase ml-1">
                    <BookOpen size={12} /> Chapter Title
                  </label>
                  <InputText
                    name="title"
                    placeholder="Enter chapter specific title (optional)"
                    value={ch.title}
                    onChange={(e) => handleChapterChange(index, e)}
                    className="w-full bg-zinc-950/50 border-zinc-800 text-sm focus:ring-blue-500/30 placeholder:text-zinc-700"
                  />
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase ml-1">
                    <ShieldCheck size={12} /> Status
                  </label>
                  <select
                    name="cencored"
                    value={ch.cencored}
                    onChange={(e) => handleChapterChange(index, e)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
                  >
                    {cencoredList.map((item) => (
                      <option key={item} value={item} className="bg-zinc-900">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase ml-1">
                    <Globe size={12} /> Language
                  </label>
                  <select
                    name="language"
                    value={ch.language}
                    onChange={(e) => handleChapterChange(index, e)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang} className="bg-zinc-900">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block">
                    Source Files ({ch.files.length})
                  </label>
                  <FileUploadInput
                    multiple
                    accept=".zip,.rar,image/*"
                    onChange={(files) => handleChapterFile(index, files)}
                    countFile={ch.files.length}
                  />
                </div>

                {ch.files.length > 0 && (
                  <div className="md:col-span-12 flex justify-end pt-2 border-t border-zinc-800/50">
                    <button
                      type="button"
                      onClick={() => openPreview(index)}
                      className="flex items-center gap-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors py-1 px-3 rounded-lg hover:bg-blue-500/5"
                    >
                      <Eye size={14} /> PREVIEW & ORGANIZE PAGES
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-600 font-medium">No chapters added yet.</p>
          <button
            onClick={addChapter}
            className="text-blue-500 text-sm font-bold mt-2 hover:underline"
          >
            Click here to add the first one
          </button>
        </div>
      )}
    </div>
  );
}
