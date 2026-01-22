"use client";

import { useState, useEffect } from "react";
import { Upload, LayoutGrid, BookOpen, Layers } from "lucide-react";
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
        setCategories((prev) => Array.from(new Set([...prev, ...data])));
      })
      .catch(console.error);
  }, []);

  const applyFixResult = (value: string) => {
    if (!activeField) return;
    setComicData((prev) => ({ ...prev, [activeField]: value }));
    setFixOpen(false);
    setActiveField(null);
  };

  return (
    <>
      <form onSubmit={handleOpenDialog} className="space-y-8 max-w-400 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start ">
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-20">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-5">
              <div className="flex items-center gap-2 text-zinc-400">
                <Upload size={18} />
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Publishing
                </h3>
              </div>

              <ComicCover
                cover={comicData.cover}
                onClick={() => setCoverDialogOpen(true)}
                onDelete={() => setComicData({ ...comicData, cover: "" })}
              />

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  onClick={handleOpenDialog}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-lg shadow-blue-900/20"
                  icon={<Upload size={20} />}
                  iconPosition="left"
                >
                  PUBLISH
                </PrimaryButton>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-6 lg:sticky lg:top-20">
            <div className="flex items-center gap-2 text-zinc-200">
              <LayoutGrid size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Comic Info
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "title",
                  label: "Title",
                  placeholder: "Main title",
                  fix: false,
                },
                {
                  name: "artist",
                  label: "Artist",
                  placeholder: "Artist name",
                  fix: true,
                },
                {
                  name: "authors",
                  label: "Author",
                  placeholder: "Author name",
                  fix: true,
                },
                {
                  name: "tags",
                  label: "Tags",
                  placeholder: "Action, Drama...",
                  fix: true,
                },
                {
                  name: "characters",
                  label: "Characters",
                  placeholder: "MC, Side characters",
                  fix: true,
                },
                {
                  name: "parodies",
                  label: "Parodies",
                  placeholder: "Original / Fanfic",
                  fix: true,
                },
                {
                  name: "groups",
                  label: "Groups",
                  placeholder: "Scanlation name",
                  fix: true,
                },
              ].map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    {field.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      name={field.name}
                      placeholder={field.placeholder}
                      value={(comicData as any)[field.name]}
                      onChange={handleComicChange}
                      className="w-full bg-zinc-950/50 border border-zinc-800 p-2.5 rounded-xl text-sm text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-blue-500/30 outline-none"
                    />
                    {field.fix && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveField(field.name);
                          setFixOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-zinc-800 text-[10px] font-bold text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all"
                      >
                        FIX
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Category
                </label>
                <select
                  name="categories"
                  value={comicData.categories}
                  onChange={handleComicChange}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-2.5 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/30"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-zinc-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-zinc-200">
              <Layers size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Chapters List
              </h3>
            </div>

            <ChapterSection
              chapters={chapters}
              addChapter={addChapter}
              removeChapter={removeChapter}
              handleChapterChange={handleChapterChange}
              handleChapterFile={handleChapterFile}
              openPreview={openPreview}
            />
          </div>
        </div>
      </form>

      {fixOpen && (
        <FixParagraphModal
          open={fixOpen}
          value={activeField ? (comicData as any)[activeField] : ""}
          onApply={applyFixResult}
          onClose={() => {
            setFixOpen(false);
            setActiveField(null);
          }}
        />
      )}
    </>
  );
}
