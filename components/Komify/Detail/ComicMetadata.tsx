// components/Komify/Detail/ComicMetadata.tsx
"use client";

import Link from "next/link";

interface ComicMetaProps {
  comic: any;
}

export default function ComicMetadata({ comic }: ComicMetaProps) {
  const renderList = (label: string, list: string[] | undefined) => {
    if (!Array.isArray(list) || list.length === 0 || list[0] === "[]")
      return null;

    // Map label ke path URL
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
      <div className="flex flex-wrap items-center gap-2 ">
        <span className="font-semibold text-slate-100">{label}:</span>
        {list.map((item, i) => (
          <Link
            key={item}
            href={`/komify/${path}/${encodeURIComponent(item)}`}
            className="
          text-blue-400 
          hover:text-blue-300 
          hover:underline
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
        {comic.status === "complete" && (
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
