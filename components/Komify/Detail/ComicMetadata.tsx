// components/Komify/Detail/ComicMetadata.tsx
"use client";

interface ComicMetaProps {
  comic: any;
}

export default function ComicMetadata({ comic }: ComicMetaProps) {
  const renderList = (label: string, list: any[]) => {
    if (!Array.isArray(list) || list.length === 0 || list[0] === "[]")
      return null;

    return (
      <div>
        <span className="font-semibold text-slate-100">{label}:</span>{" "}
        {list.join(", ")}
      </div>
    );
  };

  return (
    <div
      className="grid grid-cols-1 gap-x-10 gap-y-2 
        text-sm text-slate-300 mb-6"
    >
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
