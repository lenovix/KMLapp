"use client";

import { useParams } from "next/navigation";
import comics from "@/data/komify/comics.json";
import Link from "next/link";
import { useState } from "react";

export default function ParodieDetailPage() {
  const params = useParams();
  const parodies = params.parodies as string;

  const [search, setSearch] = useState("");

  /* Filter berdasarkan parodi */
  const comicsByParodie = comics.filter((comic: any) => {
    if (!comic.parodies || !parodies) return false;

    if (Array.isArray(comic.parodies)) {
      return comic.parodies.some(
        (p: string) => p.toLowerCase() === parodies.toLowerCase()
      );
    }

    return (
      typeof comic.parodies === "string" &&
      comic.parodies.toLowerCase() === parodies.toLowerCase()
    );
  });

  /* Filter berdasarkan search */
  const filteredComics = comicsByParodie.filter((comic: any) => {
    const title =
      typeof comic.title === "string"
        ? comic.title
        : Array.isArray(comic.title)
        ? comic.title.join(" ")
        : "";

    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 text-slate-200">
      {/* Judul */}
      <h1 className="text-3xl font-bold mb-6">
        ✍️ Parody: <span className="text-blue-500 capitalize">{parodies}</span>
      </h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari judul komik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3
                     text-white placeholder-slate-500
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Grid */}
      {filteredComics.length === 0 ? (
        <p className="text-slate-400 text-center">
          Tidak ada komik dengan parodi ini.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredComics.map((comic: any) => (
            <Link
              key={comic.slug}
              href={`/komify/${comic.slug}`}
              className="group rounded-xl overflow-hidden bg-slate-900 border border-slate-800
                         hover:border-blue-500 hover:shadow-lg transition"
            >
              {/* Cover */}
              <div className="aspect-[2/3] bg-slate-800 overflow-hidden">
                <img
                  src={comic.cover || "/placeholder-cover.jpg"}
                  alt={comic.title}
                  className="w-full h-full object-cover
                             transition-transform duration-300
                             group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <h2 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-400">
                  {comic.title}
                </h2>

                <span
                  className={`inline-block text-xs font-medium px-2 py-1 rounded-full
                    ${
                      comic.status === "Complete" ||
                      comic.status === "Completed"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                >
                  {comic.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
