"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Calendar, SortAsc, LayoutGrid, Info } from "lucide-react";
import comicsData from "@/data/komify/comics.json";
import MetadataHeader from "@/components/Komify/metadata/MetadataHeader";
import Pagination from "@/components/Komify/Home/Pagination";

type Order = "newest" | "oldest";

interface MetadataDetailPageProps {
  field: string;
  label: string;
}

export default function MetadataDetailPage({
  field,
  label,
}: MetadataDetailPageProps) {
  const params = useParams();
  const value = decodeURIComponent((params[field] as string) || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredComics = useMemo(() => {
    const comics = comicsData as any[];

    return comics
      .filter((comic) => {
        const data = comic[field];
        if (!data || !value) return false;

        const matchesMetadata = Array.isArray(data)
          ? data.some((v: string) => v.toLowerCase() === value.toLowerCase())
          : typeof data === "string" &&
            data.toLowerCase() === value.toLowerCase();

        if (!matchesMetadata) return false;

        const title = Array.isArray(comic.title)
          ? comic.title.join(" ")
          : comic.title || "";
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => {
        const dateA = new Date(a.uploaded || 0).getTime();
        const dateB = new Date(b.uploaded || 0).getTime();
        return order === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [field, value, searchTerm, order]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, order]);

  const totalPages = Math.ceil(filteredComics.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComics.slice(start, start + itemsPerPage);
  }, [filteredComics, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className=" text-zinc-200">
      <MetadataHeader
        title={label}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder={`Cari komik di ${value}...`}
      />

      <section className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <LayoutGrid size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {label} Collection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white capitalize tracking-tighter">
              {value}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-2">
              <SortAsc size={14} className="text-zinc-500" />
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as Order)}
                className="bg-transparent text-xs font-bold text-zinc-300 focus:outline-none cursor-pointer uppercase tracking-widest"
              >
                <option value="newest" className="bg-zinc-900">
                  Terbaru
                </option>
                <option value="oldest" className="bg-zinc-900">
                  Terlama
                </option>
              </select>
            </div>
          </div>
        </div>

        {filteredComics.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[3rem]">
            <Info size={40} className="text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-medium">
              Ops! Tidak ada komik ditemukan.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {currentItems.map((comic: any) => (
                <Link
                  key={comic.slug}
                  href={`/komify/${comic.slug}`}
                  className="group flex flex-col space-y-3"
                >
                  <div className="relative aspect-3/4 rounded-4xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
                    <img
                      src={comic.cover || "/placeholder-cover.jpg"}
                      alt={comic.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase tracking-widest bg-blue-600/90 backdrop-blur-md w-fit px-3 py-1.5 rounded-full">
                        <Calendar size={10} />
                        {comic.uploaded || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="px-2">
                    <h3 className="text-sm font-bold text-zinc-300 group-hover:text-white line-clamp-2 transition-colors leading-snug">
                      {comic.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center pt-8 border-t border-white/5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
