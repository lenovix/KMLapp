"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Plus, Search } from "lucide-react";
import CastDescriptionSection from "@/components/filmfy/CastClientPage/CastDescriptionSection";
import CastGallerySection from "@/components/filmfy/CastClientPage/CastGallerySection";
import CastFilmListSection from "@/components/filmfy/CastClientPage/CastFilmListSection";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
}

interface CastInfo {
  name: string;
  character?: string;
  description?: string;
  avatar?: string | null;
}

export default function CastClientPage({
  cast,
  films,
  castInfo: initialCastInfo,
}: {
  cast: string;
  films: Film[];
  castInfo?: CastInfo;
}) {
  const [query, setQuery] = useState("");

  const [castInfo] = useState<CastInfo>({
    name: initialCastInfo?.name || cast,
    character: initialCastInfo?.character || "",
    description: initialCastInfo?.description || "",
    avatar: initialCastInfo?.avatar || null,
  });

  const filteredFilms = useMemo(() => {
    const q = query.toLowerCase();
    return films.filter(
      (film) =>
        film.title.toLowerCase().includes(q) ||
        film.code.toLowerCase().includes(q)
    );
  }, [query, films]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/filmfy"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">Filmfy</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari film / kode..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border
                             dark:border-gray-700 bg-white dark:bg-gray-800
                             text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="p-2 rounded-xl border dark:border-gray-700">
                <Bookmark className="w-5 h-5" />
              </button>

              <Link
                href="/filmfy/upload"
                className="inline-flex items-center gap-2 px-4 py-2
                           rounded-xl bg-blue-600 text-white text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Film
              </Link>
            </div>
          </div>
        </header>

        <CastDescriptionSection
          profile={{
            name: castInfo.name,
            character: castInfo.character,
            description: castInfo.description,
            avatar: castInfo.avatar,
          }}
          onSave={(updatedProfile) => {
            console.log("SAVE CAST PROFILE:", updatedProfile);
            // TODO:
            // - simpan ke JSON
            // - atau POST ke API
          }}
        />

        <CastGallerySection
          images={["/cast/ichkmlsdr/1.jpg", "/cast/ichkmlsdr/2.jpg"]}
          onSave={(updatedImages) => {
            console.log("SAVE GALLERY:", updatedImages);
            // TODO: simpan ke API / file
          }}
        />

        <CastFilmListSection films={filteredFilms} />
      </div>
    </main>
  );
}
