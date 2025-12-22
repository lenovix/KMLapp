"use client";

import ComicDetails from "@/components/Komify/upload/ComicDetails";
import ComicCover from "@/components/Komify/upload/ComicCover";
import ChapterSection from "@/components/Komify/upload/ChapterSection";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { Upload } from "lucide-react";

export interface ComicData {
  slug: number;
  title: string;
  author: string;
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
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  handleChapterFile: (index: number, files: FileList | null) => void;

  openPreview: (index: number) => void;

  handleOpenDialog: (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;

  setCoverDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

  handleComicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  return (
    <form onSubmit={handleOpenDialog} className="space-y-6 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
          <div className="grid gap-4">
            {[
              { name: "title", placeholder: "Title" },
              { name: "parodies", placeholder: "Parodies" },
              { name: "characters", placeholder: "Characters" },
              { name: "tags", placeholder: "Tags" },
              { name: "artist", placeholder: "Artist" },
              { name: "groups", placeholder: "Groups" },
              { name: "authors", placeholder: "Authors" },
              { name: "categories", placeholder: "Categories" },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                placeholder={field.placeholder}
                value={(comicData as any)[field.name]}
                onChange={handleComicChange}
                className="border p-2 rounded w-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>
        {/* <ComicDetails comicData={comicData} /> */}
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
  );
}
