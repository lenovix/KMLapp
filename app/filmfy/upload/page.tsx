"use client";

import { useState } from "react";
import { Upload, Film, Image as ImageIcon, Plus, X } from "lucide-react";

export default function FilmfyUploadPage() {
  const [films, setFilms] = useState<File[]>([]);

  const handleAddFilms = (files: FileList | null) => {
    if (!files) return;
    setFilms((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFilm = (index: number) => {
    setFilms((prev) => prev.filter((_, i) => i !== index));
  };

  const inputClass =
    "w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow">
            <Film className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upload Film
          </h1>
        </header>

        {/* Section 1: Metadata */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informasi Film
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" className={inputClass} />
            <input
              type="date"
              placeholder="Release Date"
              className={inputClass}
            />
            <input placeholder="Director" className={inputClass} />
            <input placeholder="Maker" className={inputClass} />
            <input placeholder="Label" className={inputClass} />
            <input
              placeholder="Genre (pisahkan dengan koma)"
              className={inputClass}
            />
            <input
              placeholder="Cast (pisahkan dengan koma)"
              className={inputClass}
            />
            <input placeholder="Series (opsional)" className={inputClass} />
          </div>
        </section>

        {/* Section 2: Cover Upload */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cover Film
          </h2>

          <label
            className="flex flex-col items-center justify-center gap-3 p-8
            border-2 border-dashed rounded-xl cursor-pointer
            border-gray-300 dark:border-gray-700
            hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500">Upload cover (JPG / PNG)</p>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </section>

        {/* Section 3: Film Upload */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              File Film
            </h2>

            <label
              className="inline-flex items-center gap-2 px-4 py-2
              rounded-xl bg-blue-600 text-white text-sm cursor-pointer
              hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Tambah Film
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleAddFilms(e.target.files)}
              />
            </label>
          </div>

          {films.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada film diupload</p>
          ) : (
            <ul className="space-y-2">
              {films.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between px-4 py-2
                    rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFilm(i)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            className="inline-flex items-center gap-2 px-6 py-3
            rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            <Upload className="w-5 h-5" />
            Upload Film
          </button>
        </div>
      </div>
    </main>
  );
}
