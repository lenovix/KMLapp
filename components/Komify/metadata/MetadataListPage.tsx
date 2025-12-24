"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import Header from "@/components/Komify/metadata/MetadataHeader";

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

    for (const comic of comics as any[]) {
      const value = comic[field];
      if (!value) continue;

      if (Array.isArray(value)) {
        for (const v of value) {
          if (v) set.add(v);
        }
      } else if (typeof value === "string") {
        set.add(value);
      }
    }

    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [field]);

  const filteredValues = useMemo(() => {
    if (!searchTerm) return allValues;

    const keyword = searchTerm.toLowerCase();
    return allValues.filter((v) => v.toLowerCase().includes(keyword));
  }, [allValues, searchTerm]);

  return (
    <main className="min-h-screen text-slate-200">
      <Header
        title={title}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filteredValues.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            Tidak ada data yang cocok.
          </div>
        ) : (
          <div
            className="
              grid grid-cols-2 sm:grid-cols-3
              md:grid-cols-4 lg:grid-cols-6
              gap-4
            "
          >
            {filteredValues.map((value) => (
              <Link
                key={value}
                href={`${basePath}/${encodeURIComponent(value)}`}
                className="
                  group flex items-center justify-center
                  rounded-2xl border border-slate-700
                  bg-slate-900/80 px-4 py-3
                  text-sm font-medium text-center
                  hover:border-blue-500/60
                  hover:bg-slate-800
                  hover:text-blue-400
                  transition
                "
              >
                <span className="capitalize line-clamp-2">{value}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
