"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import AllComicHeader from "@/components/Komify/Home/header";
import Pagination from "@/components/Komify/Home/Pagination";
import FilterTags from "@/components/Komify/Home/FilterTags";
import statusList from "@/public/data/config/status.json";
import categoriesList from "@/public/data/komify/categories.json";
import FilterGroup from "@/components/Komify/Home/FilterGroup";

interface Ratings {
  [slug: string]: number;
}

export default function AllComic() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Ratings>({});

  const allStatuses: string[] = statusList;
  const allCategories: string[] = categoriesList;

  // 1. Reset halaman ke 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedCategories, selectedTags]);

  const filteredComics = useMemo(() => {
    const filtered = comics.filter((comic: any) => {
      const title =
        typeof comic.title === "string"
          ? comic.title
          : Array.isArray(comic.title)
          ? comic.title[0]
          : "";

      // 🔍 Search
      const matchesSearch = title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 🏷️ Tags
      const comicTags = Array.isArray(comic.tags)
        ? comic.tags
        : comic.tags
        ? [comic.tags]
        : [];

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => comicTags.includes(tag));

      // 📌 Status
      const matchesStatus = !selectedStatus || comic.status === selectedStatus;

      // 📂 Categories
      const comicCategories = Array.isArray(comic.categories)
        ? comic.categories
        : comic.categories
        ? [comic.categories]
        : [];

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.every((cat) => comicCategories.includes(cat));

      return matchesSearch && matchesTags && matchesStatus && matchesCategories;
    });

    // ⬇️ Order by uploaded (Newest)
    return filtered.sort((a: any, b: any) => {
      const uploadedA = Array.isArray(a.uploaded) ? a.uploaded[0] : a.uploaded;
      const uploadedB = Array.isArray(b.uploaded) ? b.uploaded[0] : b.uploaded;
      return new Date(uploadedB).getTime() - new Date(uploadedA).getTime();
    });
  }, [searchTerm, selectedTags, selectedStatus, selectedCategories]);

  const COMICS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredComics.length / COMICS_PER_PAGE);
  const paginatedComics = filteredComics.slice(
    (currentPage - 1) * COMICS_PER_PAGE,
    currentPage * COMICS_PER_PAGE
  );
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Memoize Tags (Lebih efisien)
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    comics.forEach((c: any) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t: string) => tagsSet.add(t.trim()));
      }
    });
    return Array.from(tagsSet).filter((t) => t && t !== "undefined");
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearStatus = () => setSelectedStatus(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-400"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <main className="flex flex-col gap-6 h-fit justify-between">
        <AllComicHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="h-fit w-full">
          {filteredComics.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              Tidak ditemukan komik dengan judul tersebut.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {paginatedComics.map((comic) => (
                  <Link
                    key={comic.slug}
                    href={`/komify/${comic.slug}`}
                    className="group bg-white dark:bg-slate-900 border hover:border-amber-50 border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition flex flex-col"
                  >
                    <img
                      src={comic.cover || "/placeholder-cover.jpg"}
                      alt={
                        typeof comic.title === "string"
                          ? comic.title
                          : comic.title?.[0]
                      }
                      className="w-full h-full object-center transition-transform duration-300"
                    />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {typeof comic.title === "string"
                          ? comic.title
                          : comic.title?.[0]}
                      </h2>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
        <FilterGroup
          label="Status"
          options={allStatuses}
          selectedValue={selectedStatus}
          onChangeValue={setSelectedStatus}
          withAll
          activeColor="blue"
        />
        <FilterGroup
          label="Categories"
          options={allCategories}
          selectedValues={selectedCategories}
          onToggleValue={toggleCategory}
          activeColor="emerald"
        />
        <FilterGroup
          label="Tags"
          options={allTags}
          selectedValues={selectedTags}
          onToggleValue={toggleTag}
          activeColor="blue"
        />
      </main>
    </>
  );
}
