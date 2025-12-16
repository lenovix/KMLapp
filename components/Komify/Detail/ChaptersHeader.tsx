"use client";

import { useState } from "react";
import AddChapterModal from "@/components/Komify/Detail/AddChapterModal";

export default function ChaptersHeader({ slug }: { slug: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">Chapters</h2>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow 
          hover:bg-blue-700 active:scale-95 transition"
        >
          + Tambah Chapter
        </button>
      </div>

      {/* 🔥 POPUP */}
      <AddChapterModal
        slug={slug}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => location.reload()}
      />
    </>
  );
}
