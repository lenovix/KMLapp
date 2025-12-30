"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Plus, Search } from "lucide-react";

import CastDescriptionSection from "@/components/filmfy/CastClientPage/CastDescriptionSection";
import CastGallerySection from "@/components/filmfy/CastClientPage/CastGallerySection";
import CastFilmListSection from "@/components/filmfy/CastClientPage/CastFilmListSection";
import { CastFormData } from "@/components/filmfy/CastClientPage/CastEditModal";

interface Film {
  id: number;
  title: string;
  code: string;
  cover?: string | null;
}

interface CastInfo {
  slug: string;
  name: string;
  alias?: string;
  avatar?: string | null;
  birthDate?: string;
  debutReason?: string;
  debutStart?: string;
  debutEnd?: string;
  description?: string;
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

  /** CAST PROFILE (source of truth) */
  const castProfile: CastFormData = {
    name: initialCastInfo?.name || cast,
    alias: initialCastInfo?.alias || "",
    avatar: initialCastInfo?.avatar || "",
    birthDate: initialCastInfo?.birthDate || "",
    debutReason: initialCastInfo?.debutReason || "",
    debutStart: initialCastInfo?.debutStart || "",
    debutEnd: initialCastInfo?.debutEnd || "",
    description:
      initialCastInfo?.description ||
      `Daftar film yang dibintangi oleh ${cast}.`,
  };

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

        {/* CAST PROFILE */}
        <CastDescriptionSection
          profile={castProfile}
          onSave={async (data) => {
            const formData = new FormData();

            formData.append("slug", cast);
            formData.append("name", data.name);

            if (data.alias) formData.append("alias", data.alias);
            if (data.birthDate) formData.append("birthDate", data.birthDate);
            if (data.debutReason)
              formData.append("debutReason", data.debutReason);
            if (data.debutStart) formData.append("debutStart", data.debutStart);
            if (data.debutEnd) formData.append("debutEnd", data.debutEnd);
            if (data.description)
              formData.append("description", data.description);

            if (data.avatarFile) {
              formData.append("avatar", data.avatarFile);
            }

            await fetch("/api/filmfy/cast", {
              method: "POST",
              body: formData, // ⬅️ PENTING
            });
          }}
        />

        {/* GALLERY */}
        <CastGallerySection
          images={["/cast/ichkmlsdr/1.jpg", "/cast/ichkmlsdr/2.jpg"]}
          onSave={(updatedImages) => {
            console.log("SAVE GALLERY:", updatedImages);
          }}
        />

        {/* FILM LIST */}
        <CastFilmListSection films={filteredFilms} />
      </div>
    </main>
  );
}
