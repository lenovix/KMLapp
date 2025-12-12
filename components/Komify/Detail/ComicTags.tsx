"use client";

import Link from "next/link";

export default function ComicTags({ tags = [] }: { tags: string[] }) {
  // Convert stringified arrays --> real array
  const normalizeTag = (t: string): string[] => {
    if (!t) return [];

    // Jika string seperti ["Manga"] atau ["Action","Drama"]
    if (t.trim().startsWith("[") && t.trim().endsWith("]")) {
      try {
        const parsed = JSON.parse(t);

        // Pastikan hasilnya array of strings
        if (Array.isArray(parsed)) {
          return parsed.filter((x) => typeof x === "string" && x.trim() !== "");
        }
      } catch {
        return [];
      }
    }

    // Selain itu: anggap sebagai string biasa
    return [t];
  };

  // Flatten + clean
  const cleanedTags = tags
    .flatMap((t) => normalizeTag(t))
    .filter(
      (t) =>
        t && t.trim() !== "" && t !== "[]" && t !== "null" && t !== "undefined"
    );

  if (cleanedTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {cleanedTags.map((tag, i) => (
        <Link
          key={i}
          href={`/tags/${encodeURIComponent(tag)}`}
          className="
            inline-flex items-center
            text-xs font-medium
            bg-blue-800/20 text-blue-400
            border border-blue-600
            px-3 py-1
            rounded-full
            shadow-sm
            hover:bg-blue-800/40
            hover:text-white
            transition
            duration-200
            cursor-pointer
          "
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
