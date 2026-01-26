"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  X,
  Layers,
  Loader2,
  Clapperboard,
  Calendar,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Cropper from "react-easy-crop";

interface Part {
  id: number;
  title: string;
  note?: string;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<Blob> => {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
};

export default function FilmfyUploadPage() {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isDeleted, setIsDeleted] = useState<"no" | "yes">("no");
  const [cencoredOptions, setCencoredOptions] = useState<string[]>([]);
  const [cencored, setCencored] = useState("Cencored");
  const [nextId, setNextId] = useState<number | null>(null);
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
    if (!title.trim()) {
      alert("Judul wajib diisi!");
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
    if (coverFile) formData.append("cover", coverFile);
    if (croppedBlob) {
      formData.append("croppedCover", croppedBlob, "cover.jpg");
    }
    formData.append("parts", JSON.stringify(parts));
    formData.append("cencored", cencored);
    formData.append("isDeleted", isDeleted);

    try {
      const res = await fetch("/api/filmfy/addFilm", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal simpan");

      alert("Film berhasil disimpan!");
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
      fetchNextId();
    } catch (error) {
      alert("Terjadi kesalahan!");
    } finally {
      setIsUploading(false);
    }
  };

  const onCropComplete = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApplyCrop = async () => {
    if (coverPreview && croppedAreaPixels) {
      const blob = await getCroppedImg(coverPreview, croppedAreaPixels);
      setCroppedBlob(blob);
      const previewUrl = URL.createObjectURL(blob);
      setCoverPreview(previewUrl);
      setShowCropModal(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400";

  const labelClass =
    "text-[11px] font-black uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400 ml-1 mb-1.5 block";

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/filmfy"
              className="p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:shadow-md transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">
                Database Entry
              </p>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                {nextId ? `Upload Film #${nextId}` : "Film Baru"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                Status Sistem
              </span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />{" "}
                API Connected
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Clapperboard className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-black dark:text-white">
                  Informasi Utama
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Kode Produksi</label>
                  <input
                    placeholder="Contoh: ABCD-123"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-4">
                  <label className={labelClass}>Judul Film</label>
                  <input
                    placeholder="Masukkan judul lengkap..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className={labelClass}>
                    <Calendar className="w-3 h-3 inline mr-1 mb-0.5" /> Tanggal
                    Rilis
                  </label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className={labelClass}>Sutradara</label>
                  <input
                    placeholder="Nama sutradara"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-3">
                  <label className={labelClass}>Studio / Maker</label>
                  <input
                    placeholder="Nama Studio"
                    value={maker}
                    onChange={(e) => setMaker(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className={labelClass}>Label</label>
                  <input
                    placeholder="Nama Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-6">
                  <label className={labelClass}>
                    <Tag className="w-3 h-3 inline mr-1 mb-0.5" /> Genre
                  </label>
                  <input
                    placeholder="Gunakan koma sebagai pemisah (Action, Comedy...)"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className={labelClass}>
                    <Users className="w-3 h-3 inline mr-1 mb-0.5" /> Pemeran
                  </label>
                  <input
                    placeholder="Nama talent"
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className={labelClass}>Series</label>
                  <input
                    placeholder="Nama series jika ada"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-black dark:text-white">
                    Segmentasi Film (Parts)
                  </h2>
                </div>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-bold uppercase">
                  {parts.length} Parts Added
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                <div className="space-y-4 md:col-span-2 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className={labelClass}>Nama Part</label>
                    <input
                      placeholder="Contoh: Part 1 atau Full Movie"
                      value={partTitle}
                      onChange={(e) => setPartTitle(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Catatan Part</label>
                    <input
                      placeholder="Link atau keterangan..."
                      value={partNote}
                      onChange={(e) => setPartNote(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addPart}
                      className="w-full md:w-auto px-8 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {parts.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-4xl text-gray-400 text-sm font-medium">
                    Belum ada segmentasi video.
                  </div>
                ) : (
                  parts.map((part, i) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 group hover:border-blue-500 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xs font-black text-gray-400">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">
                            {part.title}
                          </p>
                          {part.note && (
                            <p className="text-[10px] text-gray-500 font-medium tracking-tight uppercase">
                              {part.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removePart(part.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
                Cover Poster
              </h2>
              <label className="relative group flex flex-col items-center justify-center w-full aspect-[3/4.5] rounded-4xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer overflow-hidden">
                {coverPreview ? (
                  <>
                    <Image
                      src={coverPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-black uppercase">
                        Ganti Gambar
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
                      <ImageIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-500">
                      Click to Upload Cover
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase">
                      Recomended 3:4 Ratio
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
                    setCroppedBlob(null);
                    const url = URL.createObjectURL(file);
                    setCoverPreview(url);
                    setShowCropModal(true);
                  }}
                />

                {coverPreview && !showCropModal && (
                  <button
                    onClick={() => setShowCropModal(true)}
                    className="mt-2 text-[10px] font-black text-blue-500 uppercase tracking-tighter"
                  >
                    Adjust Crop
                  </button>
                )}
              </label>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 space-y-5">
              <div>
                <label className={labelClass}>Sensor Status</label>
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
              </div>

              <div>
                <label className={labelClass}>Availability Status</label>
                <select
                  value={isDeleted}
                  onChange={(e) => setIsDeleted(e.target.value as "yes" | "no")}
                  className={inputClass}
                >
                  <option value="no">Active (Tampilkan)</option>
                  <option value="yes">Deleted (Sembunyikan)</option>
                </select>
              </div>
            </section>

            <button
              onClick={submitMetadata}
              disabled={isUploading}
              className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-4xl font-black text-white transition-all shadow-xl ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 active:scale-95"
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
              {isUploading ? "PROCESS..." : "SAVE METADATA"}
            </button>
          </div>
        </div>
      </div>
      {showCropModal && coverPreview && (
        <div className="fixed inset-0 z-100 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-2xl aspect-3/4 bg-gray-900 rounded-3xl overflow-hidden">
            <Cropper
              image={coverPreview}
              crop={crop}
              zoom={zoom}
              aspect={3 / 4.5}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="mt-6 flex gap-4 w-full max-w-2xl">
            <button
              onClick={() => setShowCropModal(false)}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 text-white font-bold"
            >
              Batal
            </button>
            <button
              onClick={handleApplyCrop}
              className="flex-1 px-6 py-4 rounded-2xl bg-blue-600 text-white font-black"
            >
              Terapkan Crop
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
