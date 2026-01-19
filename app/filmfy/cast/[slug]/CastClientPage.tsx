"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

interface CastGalleryItem {
  name: string;
  order: number;
}

export interface SocialMediaItem {
  platform: string;
  url: string;
}

export interface CastInfo {
  slug: string;
  name: string;
  alias?: string;
  avatar?: string;

  birthDate?: string;
  age?: string;
  birthplace?: string;
  sign?: string;
  blood?: string;

  physical?: {
    height?: string;
    measurements?: string;
    cup?: string;
    shoeSize?: string;
    hairLength?: string;
    hairColor?: string;
  };

  profile?: {
    hobbies?: string;
    specialSkills?: string;
  };

  tags?: string[];

  socialMedia?: SocialMediaItem[];

  debut?: {
    reason?: string;
    start?: string;
    end?: string;
  };

  description?: string;
  gallery?: CastGalleryItem[];
}

interface Props {
  cast: string;
  films: Film[];
  castInfo?: CastInfo;
}

export default function CastClientPage({ cast, films, castInfo }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredFilms = useMemo(() => {
    const q = query.toLowerCase();
    return films.filter(
      (film) =>
        film.title.toLowerCase().includes(q) ||
        film.code.toLowerCase().includes(q),
    );
  }, [query, films]);

  if (!castInfo) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cast data not found</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-10">
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
              <span className="text-gray-400">/</span>
              <h1 className="text-xl font-bold">
                <Link href="/filmfy/cast">Casts</Link>
              </h1>
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

        <CastDescriptionSection profile={castInfo} />
        <CastFilmListSection films={filteredFilms} />

        <CastGallerySection
          slug={cast}
          images={
            castInfo.gallery?.map(
              (g) => `/filmfy/casts/${cast}/gallery/${g.name}`,
            ) || []
          }
          onUploaded={() => router.refresh()}
        />
      </div>
    </main>
  );
}
