"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import MetadataHeader from "@/components/Komify/metadata/MetadataHeader";
import Pagination from "@/components/Komify/Home/Pagination";

type Order = "newest" | "oldest";

interface MetadataDetailPageProps {
  field: string;
  label: string;
  basePath: string;
}

export default function MetadataDetailPage({
  field,
  label,
  basePath,
}: MetadataDetailPageProps) {
  const params = useParams();
  const value = decodeURIComponent(params[field] as string);

  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<Order>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Jumlah komik per halaman

  // 1. Logika Filter & Sort (useMemo agar tidak berat saat render)
  const filteredComics = useMemo(() => {
    // Filter berdasarkan metadata (field)
    const filtered = comics.filter((comic: any) => {
      const data = comic[field];
      if (!data || !value) return false;

      if (Array.isArray(data)) {
        return data.some((v: string) => v.toLowerCase() === value.toLowerCase());
      }
      return typeof data === "string" && data.toLowerCase() === value.toLowerCase();
    });

    // Filter berdasarkan search term & Sort
    return filtered
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
        return order === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [field, value, searchTerm, order]);

  // 2. Reset ke halaman 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, order]);

  // 3. Logika Slice Data untuk Pagination
  const totalPages = Math.ceil(filteredComics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredComics.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen text-slate-200">
      <MetadataHeader
        title={""}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder={`Cari komik...`}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Title + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {label}:<span className="text-blue-500 capitalize"> {value}</span>
          </h1>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Urutkan:</span>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as Order)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2
                         text-slate-200 focus:outline-none focus:ring-2
                         focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>

        {/* Grid Komik */}
        {filteredComics.length === 0 ? (
          <p className="text-slate-400 text-center py-20">
            Tidak ada komik dengan {label.toLowerCase()} ini.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map((comic: any) => (
                <Link
                  key={comic.slug}
                  href={`/komify/${comic.slug}`}
                  className="group block bg-slate-900 border border-slate-700
                             hover:border-blue-500/60
                             rounded-2xl overflow-hidden shadow-md
                             hover:shadow-xl transition"
                >
                  <div className="relative w-full aspect-3/4 overflow-hidden">
                    <img
                      src={comic.cover || "/placeholder-cover.jpg"}
                      alt={comic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold text-base line-clamp-2 group-hover:text-blue-400 transition">
                      {comic.title}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Komponen Pagination */}
            <div className="pt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
