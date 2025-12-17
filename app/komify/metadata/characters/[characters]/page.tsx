"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import comics from "@/data/komify/comics.json";
import Header from "@/components/Komify/metadata/header";

export default function ParodieDetailPage() {
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const parodies = decodeURIComponent(params.parodies as string);

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
  const filteredComics = comicsByParodie
    .filter((comic: any) => {
      const title =
        typeof comic.title === "string"
          ? comic.title
          : Array.isArray(comic.title)
          ? comic.title.join(" ")
          : "";

      return title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.uploaded || 0).getTime();
      const dateB = new Date(b.uploaded || 0).getTime();

      return order === "newest"
        ? dateB - dateA // terbaru dulu
        : dateA - dateB; // terlama dulu
    });



  return (
    <main className="text-slate-200">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Judul */}
          <h1 className="text-3xl font-bold">
            Parody:
            <span className="text-blue-500 capitalize"> {parodies}</span>
          </h1>

          {/* Sort */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Urutkan:</span>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as "newest" | "oldest")}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2
                 text-slate-200 focus:outline-none focus:ring-2
                 focus:ring-blue-500 transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredComics.length === 0 ? (
          <p className="text-slate-400 text-center">
            Tidak ada komik dengan parodi ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredComics.map((comic) => (
              <Link
                key={comic.slug}
                href={`/komify/${comic.slug}`}
                className="block bg-slate-900 border border-slate-700 hover:border-amber-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
              >
                <div className="relative w-full h-56 md:h-48 lg:h-52">
                  <img
                    src={comic.cover || "/placeholder-cover.jpg"}
                    alt={comic.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-4 flex flex-col gap-1">
                  <div className="font-semibold text-lg line-clamp-2">
                    {comic.title}
                  </div>

                  {/* <div className="text-sm">
                    {renderStars(ratings[comic.slug] || 0)}
                  </div> */}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
