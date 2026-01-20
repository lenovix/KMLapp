"use client";

import Link from "next/link";
import { Hash } from "lucide-react";

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

    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    return [trimmed];
  };

  const cleanedTags = normalizeTags(tags);

  if (cleanedTags.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {cleanedTags.map((tag, i) => (
          <Link
            key={`${tag}-${i}`}
            href={`/komify/metadata/tags/${encodeURIComponent(tag)}`}
            className="
              group inline-flex items-center gap-1.5
              text-[11px] font-bold
              bg-zinc-900 text-zinc-400
              border border-zinc-800
              pl-2 pr-3 py-1.5
              rounded-xl
              transition-all duration-300
              hover:bg-blue-600/10 hover:text-blue-400 hover:border-blue-500/30
              hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]
            "
          >
            <Hash
              size={12}
              className="text-zinc-600 group-hover:text-blue-500 transition-colors"
            />
            <span className="tracking-tight">{tag}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
