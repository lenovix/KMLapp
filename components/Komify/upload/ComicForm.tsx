"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import ComicCover from "@/components/Komify/upload/ComicCover";
import ChapterSection from "@/components/Komify/upload/ChapterSection";
import PrimaryButton from "@/components/UI/PrimaryButton";
import FixParagraphModal from "@/components/Komify/Detail/FixParagraphModal";

export interface ComicData {
  slug: number;
  title: string;
  authors: string;
  artist: string;
  groups: string;
  parodies: string;
  characters: string;
  categories: string;
  tags: string;
  uploaded: string;
  status: "Ongoing" | "Completed" | "Hiatus";
  cover: string;
}

export interface ChapterData {
  number: string;
  title: string;
  language: string;
  cencored: string;
  files: File[];
}

interface ComicFormProps {
  comicData: ComicData;
  setComicData: React.Dispatch<React.SetStateAction<ComicData>>;
  chapters: ChapterData[];
  addChapter: () => void;
  removeChapter: (index: number) => void;
  handleChapterChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;

  handleChapterFile: (index: number, files: FileList | null) => void;
  openPreview: (index: number) => void;
  handleOpenDialog: (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;

  setCoverDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleComicChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function ComicForm({
  comicData,
  setComicData,
  chapters,
  addChapter,
  removeChapter,
  handleChapterChange,
  handleChapterFile,
  openPreview,
  handleOpenDialog,
  setCoverDialogOpen,
  handleComicChange,
}: ComicFormProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [fixOpen, setFixOpen] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/komify/categories.json")
      .then((res) => res.json())
      .then((data: string[]) => {
        setCategories((prev) => {
          const merged = new Set([...prev, ...data]);
          return Array.from(merged);
        });
      })
      .catch(console.error);
  }, []);

  const applyFixResult = (value: string) => {
    if (!activeField) return;

    setComicData((prev) => ({
      ...prev,
      [activeField]: value,
    }));

    setFixOpen(false);
    setActiveField(null);
  };
  return (
    <>
      <form onSubmit={handleOpenDialog} className="space-y-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
            <div className="grid gap-4">
              {[
                { name: "title", placeholder: "Title", fix: false },
                { name: "parodies", placeholder: "Parodies", fix: true },
                { name: "characters", placeholder: "Characters", fix: true },
                { name: "tags", placeholder: "Tags", fix: true },
                { name: "artist", placeholder: "Artist", fix: true },
                { name: "groups", placeholder: "Groups", fix: true },
                { name: "authors", placeholder: "Authors", fix: true },
              ].map((field) => (
                <div key={field.name} className="flex items-start gap-2">
                  <input
                    name={field.name}
                    placeholder={field.placeholder}
                    value={(comicData as any)[field.name]}
                    onChange={handleComicChange}
                    className="flex-1 border p-2 rounded bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {field.fix && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveField(field.name);
                        setFixOpen(true);
                      }}
                      title="Fix format"
                      className="
                        px-3
                        py-2
                        rounded-lg
                        text-xs
                        border
                        border-slate-600
                        bg-slate-800
                        text-slate-300
                        hover:bg-slate-700
                        hover:text-white
                        transition
                      "
                    >
                      Fix
                    </button>
                  )}
                </div>
              ))}

              <select
                name="categories"
                value={comicData.categories}
                onChange={handleComicChange}
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white"
                required
              >
                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-800 text-white"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4 flex flex-col">
            <PrimaryButton
              type="submit"
              onClick={handleOpenDialog}
              icon={<Upload size={18} />}
              iconPosition="left"
            >
              Upload Comic
            </PrimaryButton>
            <ComicCover
              cover={comicData.cover}
              onClick={() => setCoverDialogOpen(true)}
              onDelete={() => setComicData({ ...comicData, cover: "" })}
            />
          </div>
        </div>
        <ChapterSection
          chapters={chapters}
          addChapter={addChapter}
          removeChapter={removeChapter}
          handleChapterChange={handleChapterChange}
          handleChapterFile={handleChapterFile}
          openPreview={openPreview}
        />
      </form>
      {
        <FixParagraphModal
          open={fixOpen}
          value={activeField ? (comicData as any)[activeField] : ""}
          onApply={applyFixResult}
          onClose={() => {
            setFixOpen(false);
            setActiveField(null);
          }}
        />
      }
    </>
  );
}
