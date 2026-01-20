"use client";

import Link from "next/link";
import {
  User,
  Users,
  Ghost,
  BookOpen,
  Layers,
  Calendar,
  Info,
  Palette,
} from "lucide-react";

interface ComicMetaProps {
  comic: any;
}

const toArray = (val: string | string[] | null | undefined): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export default function ComicMetadata({ comic }: ComicMetaProps) {
  const renderList = (
    label: string,
    value: string | string[] | null | undefined,
    icon: React.ReactNode,
  ) => {
    const list = toArray(value);
    if (list.length === 0) return null;

    const pathMap: Record<string, string> = {
      Parodies: "parodies",
      Characters: "characters",
      Author: "authors",
      Artist: "artists",
      Groups: "groups",
      Categories: "category",
    };

    const path = pathMap[label] || label.toLowerCase();

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {list.map((item) => (
            <Link
              key={item}
              href={`/komify/metadata/${path}/${encodeURIComponent(item)}`}
              className="text-xs font-bold text-zinc-300 hover:text-blue-400 bg-zinc-800/50 hover:bg-blue-500/10 border border-zinc-800 hover:border-blue-500/30 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {renderList(
            "Author",
            comic.authors,
            <User size={12} className="text-blue-500" />,
          )}
          {renderList(
            "Artist",
            comic.artists,
            <Palette size={12} className="text-purple-500" />,
          )}
          {renderList(
            "Groups",
            comic.groups,
            <Users size={12} className="text-emerald-500" />,
          )}
        </div>
        <div className="space-y-5">
          {renderList(
            "Parodies",
            comic.parodies,
            <Ghost size={12} className="text-orange-500" />,
          )}
          {renderList(
            "Characters",
            comic.characters,
            <Layers size={12} className="text-pink-500" />,
          )}
          {renderList(
            "Categories",
            comic.categories,
            <BookOpen size={12} className="text-cyan-500" />,
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-zinc-500">
          <Calendar size={14} />
          <span className="text-xs font-medium uppercase tracking-tighter">
            Uploaded:
          </span>
          <span className="text-xs font-bold text-zinc-300">
            {comic.uploaded || "Recently"}
          </span>
        </div>
      </div>
    </div>
  );
}
