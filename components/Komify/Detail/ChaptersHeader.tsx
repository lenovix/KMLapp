// components/Komify/Detail/ChaptersHeader.tsx
"use client";

import { useRouter } from "next/navigation";

export default function ChaptersHeader({ slug }: { slug: number }) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        Chapters
      </h2>

      <button
        onClick={() => router.push(`/add-chapter?slug=${slug}`)}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow 
        hover:bg-blue-700 active:scale-95 transition"
      >
        + Tambah Chapter
      </button>
    </div>
  );
}
