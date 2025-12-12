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
      {/* STATUS */}
      <div>
        <span className="font-semibold text-slate-100">Status:</span>{" "}
        {comic.status === "Ongoing" && (
          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md">
            Ongoing
          </span>
        )}
        {comic.status === "Complete" && (
          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded-md">
            Complete
          </span>
        )}
      </div>

      {renderList("Parodies", comic.parodies)}
      {renderList("Characters", comic.characters)}
      {renderList("Author", comic.author)}
      {renderList("Artist", comic.artists)}
      {renderList("Groups", comic.groups)}
      {renderList("Categories", comic.categories)}

      <div>
        <span className="font-semibold text-slate-100">Uploaded:</span>{" "}
        {comic.uploaded}
      </div>
    </div>
  );
}
