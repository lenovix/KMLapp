"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  X,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface Part {
  id: number;
  title: string;
  note?: string;
}

export default function FilmfyUploadPage() {
  const [cencoredOptions, setCencoredOptions] = useState<string[]>([]);
  const [cencored, setCencored] = useState("Cencored");
  const [nextId, setNextId] = useState<number | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
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

  useEffect(() => {
    fetch("/api/filmfy/nextId")
      .then((res) => res.json())
      .then((data) => setNextId(data.nextId))
      .catch(() => setNextId(null));

    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then((data) => setCencoredOptions(data))
      .catch(() => setCencoredOptions([]));
  }, []);

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

    if (!coverFile) {
      alert("Cover wajib diupload");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("code", code);
    formData.append("releaseDate", releaseDate);
    formData.append("director", director);
    formData.append("maker", maker);
    formData.append("label", label);
    formData.append("genre", genre);
    formData.append("cast", cast);
    formData.append("series", series);
    formData.append("cover", coverFile);
    formData.append("parts", JSON.stringify(parts));
    formData.append("cencored", cencored);

    const res = await fetch("/api/filmfy/addFilm", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Gagal menyimpan film");
      return;
    }

    alert("Film berhasil disimpan");

    setTitle("");
    setCode("");
    setReleaseDate("");
    setDirector("");
    setMaker("");
    setLabel("");
    setGenre("");
    setCast("");
    setSeries("");
    setParts([]);
    setCoverFile(null);
    setCoverPreview(null);
    setCencored(cencoredOptions[0] || "");
  };

  const inputClass =
    "w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-2">
        <header className="sticky top-0 z-20 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur ">
          <div className="flex items-center gap-4 max-w-4xl mx-auto py-4">
            <Link
              href="/filmfy"
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              aria-label="Kembali ke Filmfy"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
              {nextId ? `Upload Film #${nextId}` : "Film Baru"}
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl border p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <input
                  placeholder="Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                />
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
                  placeholder="Genre (pisahkan koma)"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Cast (pisahkan koma)"
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

            <section className="bg-white dark:bg-gray-800 rounded-2xl border p-6 space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
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
                  className="rounded-xl bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 inline" /> Tambah Part
                </button>
              </div>

              {parts.length === 0 ? (
                <p className="text-sm text-gray-500">Belum ada part.</p>
              ) : (
                <ul className="space-y-2">
                  {parts.map((part, i) => (
                    <li
                      key={part.id}
                      className="flex justify-between border rounded-xl p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {i + 1}. {part.title}
                        </p>
                        {part.note && (
                          <p className="text-xs text-gray-500">{part.note}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removePart(part.id)}
                        className="text-red-500"
                      >
                        <X />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl border p-6 space-y-4">
              <h2 className="text-lg font-semibold">Cover Film</h2>

              <label className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer aspect-4/4">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    className="max-h-48 rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500">Upload cover</p>
                  </>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCoverFile(file);
                    setCoverPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl border p-6 space-y-2">
              <label className="text-sm font-medium">Status Cencored</label>
              <select
                value={cencored}
                onChange={(e) => setCencored(e.target.value)}
                className={inputClass}
              >
                {cencoredOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </section>
            <button
              onClick={submitMetadata}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              <Upload className="w-5 h-5" /> Simpan Metadata
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
