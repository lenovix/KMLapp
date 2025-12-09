"use client";


import ComicDetails from "@/components/Komify/upload/ComicDetails";
import ComicCover from "@/components/Komify/upload/ComicCover";
import ChapterSection from "@/components/Komify/upload/ChapterSection";

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
}) {
  return (
    <form onSubmit={handleOpenDialog} className="space-y-6 overflow-hidden">
      {/* ========================== */}
      {/* DETAIL + COVER SECTION     */}
      {/* ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DETAIL (kiri) */}
        <ComicDetails
          comicData={comicData}
          onChange={handleComicChange}
        />

        {/* COVER + BUTTON (kanan) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4 flex flex-col">
          
          {/* Submit Button */}
          <button
            onClick={handleOpenDialog}
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            Simpan Komik
          </button>

          {/* BOX COVER */}
          <ComicCover
            cover={comicData.cover}
            onClick={() => setCoverDialogOpen(true)}
            onDelete={() =>
              setComicData({ ...comicData, cover: "" })
            }
          />
        </div>
      </div>

      {/* ========================== */}
      {/* CHAPTER SECTION (BOTTOM)   */}
      {/* ========================== */}
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
