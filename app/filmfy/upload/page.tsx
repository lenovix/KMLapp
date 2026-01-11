"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  X,
  Layers,
  Loader2,
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
  const [isUploading, setIsUploading] = useState(false);

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

  const fetchNextId = () => {
    fetch("/api/filmfy/nextId")
      .then((res) => res.json())
      .then((data) => setNextId(data.nextId))
      .catch(() => setNextId(null));
  };

  useEffect(() => {
    fetchNextId();

    fetch("/data/config/cencored.json")
      .then((res) => res.json())
      .then((data) => {
        setCencoredOptions(data);
        if (data.length > 0) setCencored(data[0]);
      })
      .catch(() => setCencoredOptions([]));
  }, []);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

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
    if (!title.trim() || !coverFile) {
      alert("Title dan Cover wajib diisi!");
      return;
    }

    setIsUploading(true);
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

    try {
      const res = await fetch("/api/filmfy/addFilm", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal simpan");

      alert("Film berhasil disimpan!");

      fetchNextId();
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
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 " +
    "bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-4">
        <header className="flex items-center gap-4 py-2">
          <Link
            href="/filmfy"
            className="p-2 rounded-xl bg-white dark:bg-gray-800 border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">
            {nextId ? `Upload Film #${nextId}` : "Film Baru"}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                      Code
                    </label>
                    <input
                      placeholder="PROD-001"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                      Judul Utama
                    </label>
                    <input
                      placeholder="Contoh: Interstellar"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                      Tanggal Rilis
                    </label>
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 block">
                      Sutradara
                    </label>
                    <input
                      placeholder="Nama Sutradara"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <input
                    placeholder="Studio / Maker"
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

                  <div className="md:col-span-2">
                    <input
                      placeholder="Genre (Aksi, Sci-Fi, ...)"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      placeholder="Pemeran / Cast"
                      value={cast}
                      onChange={(e) => setCast(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      placeholder="Series (Opsional)"
                      value={series}
                      onChange={(e) => setSeries(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6 shadow-sm space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Layers className="w-5 h-5 text-blue-500" /> Manajemen Part
              </h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  placeholder="Judul Part"
                  value={partTitle}
                  onChange={(e) => setPartTitle(e.target.value)}
                  className={inputClass}
                />
                <input
                  placeholder="Catatan"
                  value={partNote}
                  onChange={(e) => setPartNote(e.target.value)}
                  className={inputClass}
                />
                <button
                  onClick={addPart}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Tambah
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {parts.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed rounded-xl text-gray-400 text-sm">
                    Belum ada part ditambahkan
                  </div>
                ) : (
                  parts.map((part, i) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-xl p-3 group"
                    >
                      <div>
                        <span className="text-xs font-bold text-blue-500 mr-2">
                          PART {i + 1}
                        </span>
                        <span className="font-medium">{part.title}</span>
                        {part.note && (
                          <p className="text-xs text-gray-500 italic">
                            {part.note}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removePart(part.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold">Poster Film</h2>
              <label className="relative group flex flex-col items-center justify-center w-full aspect-2/3 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all cursor-pointer overflow-hidden">
                {coverPreview ? (
                  <>
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <p className="text-white text-sm font-medium">
                        Ganti Gambar
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Klik untuk upload cover (JPG/PNG)
                    </p>
                  </div>
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

            <section className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6 shadow-sm space-y-3">
              <label className="text-sm font-semibold">Sensor Status</label>
              <select
                value={cencored}
                onChange={(e) => setCencored(e.target.value)}
                className={inputClass}
              >
                {cencoredOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </section>

            <button
              onClick={submitMetadata}
              disabled={isUploading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white transition-all shadow-lg shadow-blue-500/20 ${
                isUploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              {isUploading ? "Menyimpan..." : "Simpan Metadata"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
