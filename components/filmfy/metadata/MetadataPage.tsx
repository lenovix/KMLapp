"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Hash, PlayCircle } from "lucide-react";
import MetadataHeader from "@/components/filmfy/metadata/header";
import films from "@/data/filmfy/films.json";

export type MetadataType = "director" | "maker" | "label" | "series";

interface Film {
  id: number;
  title: string;
  code: string;
  director?: string;
  maker?: string;
  label?: string;
  series?: string;
  releaseDate: string;
  cover: string;
}

interface FilmfyMetadataPageProps {
  type: MetadataType;
  value: string;
  title: string;
}

export default function FilmfyMetadataPage({
  type,
  value,
  title,
}: FilmfyMetadataPageProps) {
  const [query, setQuery] = useState("");

  const decodedValue = decodeURIComponent(value);

  const filteredFilms = (films as Film[])
    .filter((film) => {
      const metaValue = film[type];
      return metaValue?.toLowerCase() === decodedValue.toLowerCase();
    })
    .filter((film) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        film.title.toLowerCase().includes(q) ||
        film.code.toLowerCase().includes(q)
      );
    });

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <MetadataHeader
            director={decodedValue}
            query={query}
            setQuery={setQuery}
            title={title}
          />
        </div>

        <div className="flex items-center gap-2 px-2">
          <div className="h-1 w-12 bg-blue-600 rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Found {filteredFilms.length} Cinematic Entries
          </p>
        </div>

        {filteredFilms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-medium italic">
              No films found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-in fade-in zoom-in-95 duration-500">
            {filteredFilms.map((film) => (
              <Link
                key={film.id}
                href={`/filmfy/${film.id}`}
                className="group relative"
              >
                <div className="relative aspect-2/3 w-full rounded-4xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-xl transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-blue-500/20 group-hover:shadow-2xl">
                  <Image
                    src={film.cover}
                    alt={film.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <PlayCircle className="w-12 h-12 text-white/80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 group-hover:scale-100 transition-transform duration-500" />

                    <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Hash className="w-3 h-3" />
                        <span className="text-[10px] font-black tracking-widest uppercase">
                          {film.code}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">
                        {film.title}
                      </h2>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-100 group-hover:opacity-0 transition-opacity">
                    <span className="text-[9px] font-black text-white uppercase tracking-tighter">
                      {film.code}
                    </span>
                  </div>
                </div>

                <div className="mt-4 px-2 space-y-1">
                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                    {film.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {film.releaseDate}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
