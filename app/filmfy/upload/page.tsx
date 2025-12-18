"use client";

import { useState } from "react";
import {
  Upload,
  Film,
  Image as ImageIcon,
  Plus,
  X,
  Layers,
} from "lucide-react";

interface Part {
  id: number;
  title: string;
  note?: string;
}

export default function FilmfyUploadPage() {
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [director, setDirector] = useState("");
  const [maker, setMaker] = useState("");
  const [label, setLabel] = useState("");
  const [genre, setGenre] = useState("");
  const [cast, setCast] = useState("");
  const [series, setSeries] = useState("");

  const [parts, setParts] = useState<Part[]>([]);
  const [partTitle, setPartTitle] = useState("");
  const [partNote, setPartNote] = useState("");

  const addPart = () => {
    if (!partTitle.trim()) return;
    setParts((prev) => [
      ...prev,
      { id: Date.now(), title: partTitle, note: partNote },
    ]);
    setPartTitle("");
    setPartNote("");
  };

  const removePart = (id: number) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
  };

  const submitMetadata = async () => {
    if (!title.trim()) {
      alert("Title wajib diisi");
      return;
    }

    const res = await fetch("/api/filmfy/addFilm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        releaseDate,
        director,
        maker,
        label,
        genre,
        cast,
        series,
        parts: parts.map((p) => ({ title: p.title, note: p.note })),
      }),
    });

    if (!res.ok) {
      alert("Gagal menyimpan metadata film");
      return;
    }

    alert("Metadata film berhasil disimpan");

    // reset form
    setTitle("");
    setReleaseDate("");
    setDirector("");
    setMaker("");
    setLabel("");
    setGenre("");
    setCast("");
    setSeries("");
    setParts([]);
  };

  const inputClass =
    "w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-600 text-white shadow">
            <Film className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Buat Metadata Film
          </h1>
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informasi Film
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Director"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Maker"
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Genre (pisahkan dengan koma)"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Cast (pisahkan dengan koma)"
              value={cast}
              onChange={(e) => setCast(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Series (opsional)"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cover Film
          </h2>
          <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500">Upload cover (nanti)</p>
          </label>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Layers className="w-5 h-5" /> Part Film
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Judul Part"
              value={partTitle}
              onChange={(e) => setPartTitle(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="Catatan (opsional)"
              value={partNote}
              onChange={(e) => setPartNote(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={addPart}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Tambah Part
            </button>
          </div>

          {parts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada part. File video akan diupload manual.
            </p>
          ) : (
            <ul className="space-y-2">
              {parts.map((part, i) => (
                <li
                  key={part.id}
                  className="flex items-center justify-between px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {i + 1}. {part.title}
                    </p>
                    {part.note && (
                      <p className="text-xs text-gray-500">{part.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removePart(part.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex justify-end">
          <button
            onClick={submitMetadata}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            <Upload className="w-5 h-5" /> Simpan Metadata
          </button>
        </div>
      </div>
    </main>
  );
}
