"use client";

import Link from "next/link";

type TagValue = string | string[] | null | undefined;

interface ComicTagsProps {
  tags?: TagValue;
}

export default function ComicTags({ tags }: ComicTagsProps) {
  const normalizeTags = (value: TagValue): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.map((v) => v.trim()).filter(Boolean);
    }

    const trimmed = value.trim();
    if (!trimmed) return [];

    return [trimmed];
  };

  const cleanedTags = normalizeTags(tags);

  if (cleanedTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {cleanedTags.map((tag, i) => (
        <Link
          key={`${tag}-${i}`}
          href={`/komify/metadata/tags/${encodeURIComponent(tag)}`}
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
          "
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
