"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import comics from "@/data/komify/comics.json";
import AllComicHeader from "@/components/Komify/Home/header";
import Pagination from "@/components/Komify/Home/Pagination";
import statusList from "@/public/data/config/status.json";
import categoriesList from "@/public/data/komify/categories.json";
import FilterGroup from "@/components/Komify/Home/FilterGroup";
import { useDebounce } from "@/hooks/useDebounce";

interface ComicData {
  slug: number;
  title: string;
  authors: string[];
  artist: string[];
  groups: string[];
  parodies: string[];
  characters: string[];
  categories: string[];
  tags: string[];
  uploaded: string;
  status: "Ongoing" | "Completed" | "Hiatus";
  cover: string;
}

export default function AllComic() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const allStatuses: string[] = statusList;
  const allCategories: string[] = categoriesList;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus, selectedCategories, selectedTags]);

  const filteredComics = useMemo(() => {
    const filtered = (comics as unknown as ComicData[]).map((comic) => ({
      ...comic,
      artist: comic.artist || [],
    })).filter((comic) => {
      const title =
        typeof comic.title === "string"
          ? comic.title
          : Array.isArray(comic.title)
            ? comic.title[0]
            : "";

      const matchesSearch = title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const comicTags = Array.isArray(comic.tags)
        ? comic.tags
        : comic.tags
          ? [comic.tags]
          : [];

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => comicTags.includes(tag));

      const matchesStatus = !selectedStatus || comic.status === selectedStatus;

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

    return filtered.sort((a: any, b: any) => {
      const uploadedA = Array.isArray(a.uploaded) ? a.uploaded[0] : a.uploaded;
      const uploadedB = Array.isArray(b.uploaded) ? b.uploaded[0] : b.uploaded;
      return new Date(uploadedB).getTime() - new Date(uploadedA).getTime();
    });
  }, [debouncedSearch, selectedTags, selectedStatus, selectedCategories]);

  const COMICS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredComics.length / COMICS_PER_PAGE);

  const paginatedComics = useMemo(
    () =>
      filteredComics.slice(
        (currentPage - 1) * COMICS_PER_PAGE,
        currentPage * COMICS_PER_PAGE,
      ),
    [filteredComics, currentPage],
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    (comics as unknown as ComicData[]).forEach((c) => {
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
        : [...prev, category],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      <section className="space-y-4">
        <AllComicHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-none space-y-8">
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
            label="Popular Tags"
            options={allTags.slice(0, 20)}
            selectedValues={selectedTags}
            onToggleValue={toggleTag}
            activeColor="blue"
          />
        </aside>

        <section className="flex-1">
          {filteredComics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-xl font-medium text-gray-400">
                Oops! Komik tidak ditemukan.
              </p>
              <p className="text-sm text-gray-500">
                Coba ubah filter atau kata kunci pencarianmu.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedComics.map((comic: ComicData) => {
                  const title =
                    typeof comic.title === "string"
                      ? comic.title
                      : (comic.title?.[0] ?? "Comic");

                  return (
                    <Link
                      key={comic.slug}
                      href={`/komify/${comic.slug}`}
                      className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden 
                                 border border-gray-100 dark:border-slate-800
                                 hover:border-blue-500 dark:hover:border-blue-400
                                 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="aspect-3/4 overflow-hidden relative">
                        <Image
                          src={comic.cover}
                          alt={title}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          loading="lazy"
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm 
                              ${comic.status === "Completed" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}
                          >
                            {comic.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <h2
                          className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-2 
                                       group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          {title}
                        </h2>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
