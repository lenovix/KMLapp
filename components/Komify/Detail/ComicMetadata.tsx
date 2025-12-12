"use client";

import Link from "next/link";

interface ComicMetaProps {
  comic: any;
}

// Fungsi normalisasi (dipakai ulang untuk semua metadata)
const normalizeList = (list: string[] | undefined): string[] => {
  if (!Array.isArray(list)) return [];

  return list
    .flatMap((item) => {
      if (!item) return [];

      // Jika item isinya seperti: ["Manga"] (string JSON)
      if (item.trim().startsWith("[") && item.trim().endsWith("]")) {
        try {
          const parsed = JSON.parse(item);

          if (Array.isArray(parsed)) {
            return parsed.filter(
              (x) => typeof x === "string" && x.trim() !== ""
            );
          }
        } catch {
          return [];
        }
      }

      // Case normal: string biasa
      if (item.trim() !== "" && item !== "[]" && item !== "null") return [item];

      return [];
    })
    .filter(Boolean);
};

export default function ComicMetadata({ comic }: ComicMetaProps) {
  const renderList = (label: string, list: string[] | undefined) => {
    const cleaned = normalizeList(list);

    if (cleaned.length === 0) return null;

    const pathMap: Record<string, string> = {
      Parodies: "parody",
      Characters: "character",
      Author: "author",
      Artist: "artist",
      Groups: "group",
      Categories: "category",
    };

    const path = pathMap[label] || label.toLowerCase();

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-100">{label}:</span>

        {cleaned.map((item) => (
          <Link
            key={item}
            href={`/komify/${path}/${encodeURIComponent(item)}`}
            className="
          inline-flex items-center
          text-xs font-medium
          bg-blue-800/20 
          text-blue-300
          border border-blue-700/60
          px-3 py-1.5
          rounded-md
          shadow-sm
          hover:bg-blue-800/40
          hover:text-white
          transition
          duration-200
        "
          >
            {item}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-2 text-sm text-slate-300 mb-6">
      {renderList("Parodies", comic.parodies)}
      {renderList("Characters", comic.characters)}
      {renderList("Author", comic.author)}
      {renderList("Artist", comic.artists)}
      {renderList("Groups", comic.groups)}
      {renderList("Categories", comic.categories)}

      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium text-slate-300">Uploaded:</span>
        <span className="text-slate-100">{comic.uploaded}</span>

        {comic.status === "Ongoing" && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
            Ongoing
          </span>
        )}

        {comic.status === "Complete" && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30 rounded-md">
            Complete
          </span>
        )}
      </div>
    </div>
  );
}
