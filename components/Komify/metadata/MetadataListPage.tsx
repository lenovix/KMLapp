"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Tag, Filter, Hash } from "lucide-react";
import comicsData from "@/data/komify/comics.json";
import Header from "@/components/Komify/metadata/MetadataHeader";

interface Comic {
  slug: string | number;
  [key: string]: any;
}

type MetadataListPageProps = {
  field: string;
  title: string;
  basePath: string;
};

export default function MetadataListPage({
  field,
  title,
  basePath,
}: MetadataListPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const allValues = useMemo(() => {
    const set = new Set<string>();
    const comics = comicsData as unknown as Comic[];

    for (const comic of comics) {
      const value = comic[field];
      if (!value) continue;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v && typeof v === "string") set.add(v.trim());
        });
      } else if (typeof value === "string") {
        set.add(value.trim());
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [field]);

  const filteredValues = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();
    if (!keyword) return allValues;
    return allValues.filter((v) => v.toLowerCase().includes(keyword));
  }, [allValues, searchTerm]);

  return (
    <main className=" text-zinc-200 pb-20">
      <Header
        title={title}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder={`Cari ${title}...`}
      />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Total {title}: {filteredValues.length}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-zinc-600">
            <Filter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              A-Z Sorted
            </span>
          </div>
        </div>

        {filteredValues.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[3rem] bg-zinc-900/20">
            <Search size={48} className="text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-medium tracking-wide">
              Data tidak ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredValues.map((value) => (
              <Link
                key={value}
                href={`${basePath}/${encodeURIComponent(value)}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-4xl bg-zinc-900/40 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300"
              >
                <Tag
                  size={12}
                  className="absolute top-4 right-4 text-zinc-800 group-hover:text-blue-500/50 transition-colors"
                />

                <span className="text-sm font-bold text-center text-zinc-400 group-hover:text-white transition-colors capitalize wrap-break-word">
                  {value}
                </span>

                <div className="absolute bottom-3 w-1 h-1 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
