"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import comicsData from "@/data/komify/comics.json";

export default function AddChapter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 ambil slug dari query string
  const slug = searchParams.get("slug");

  const [comic, setComic] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    number: "001",
    title: "",
    language: "",
    files: null,
  });

  const [previewPages, setPreviewPages] = useState<
    Array<{ id: string; file: File; url: string }>
  >([]);

  useEffect(() => {
    if (!slug) return;

    const found = comicsData.find((c) => c.slug === Number(slug));

    if (!found) return;

    setComic(found);

    const nextNum =
      found.chapters?.length > 0
        ? String(
            found.chapters
              .map((ch: any) => Number(ch.number))
              .filter((n: number) => !isNaN(n))
              .reduce((max: number, n: number) => Math.max(max, n), 0) + 1
          ).padStart(3, "0")
        : "001";

    setForm((prev: any) => ({ ...prev, number: nextNum }));
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm({ ...form, files });

    setPreviewPages(
      files.map((file, idx) => ({
        id: `new-${Date.now()}-${idx}`,
        file,
        url: URL.createObjectURL(file),
      }))
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newPages = Array.from(previewPages);
    const [removed] = newPages.splice(result.source.index, 1);
    newPages.splice(result.destination.index, 0, removed);

    setPreviewPages(newPages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || loading) return;

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("slug", slug);
      fd.append("number", form.number);
      fd.append("title", form.title);
      fd.append("language", form.language);

      previewPages.forEach((item) => {
        fd.append("pages", item.file);
      });

      const res = await fetch("/api/komify/addChapter", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      router.push(`/komify/${slug}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal menambah chapter!");
    } finally {
      setLoading(false);
    }
  };


  if (!slug) {
    return <p className="p-6 text-red-600">Slug tidak ditemukan di URL</p>;
  }

  if (!comic) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 text-slate-200">
      {/* Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Grid form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nomor Chapter */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Nomor Chapter
              </label>
              <input
                name="number"
                value={form.number}
                readOnly
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-300"
              />
            </div>

            {/* Judul */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Judul Chapter
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Zero to Hero"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Bahasa */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Bahasa
            </label>
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              placeholder="English / Japanese / Indonesia"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white
                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              File Gambar
            </label>

            <label
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700
                             rounded-xl p-6 cursor-pointer
                             hover:border-blue-500 hover:bg-slate-800 transition"
            >
              <span className="text-sm text-slate-300">
                Klik atau drag gambar ke sini
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Bisa diurutkan setelah upload
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Preview */}
          {previewPages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">
                Urutkan Halaman
              </p>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="pages" direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex gap-4 overflow-x-auto pb-2"
                    >
                      {previewPages.map((item, idx) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={idx}
                        >
                          {(prov, snapshot) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`relative shrink-0 rounded-xl border border-slate-700
                              bg-slate-800 p-2 w-[120px] transition
                              ${
                                snapshot.isDragging
                                  ? "ring-2 ring-blue-500 shadow-xl"
                                  : "hover:shadow"
                              }`}
                            >
                              <img
                                src={item.url}
                                className="w-full h-36 object-contain rounded-md bg-slate-900"
                              />
                              <span
                                className="absolute -top-2 -right-2
                              bg-blue-600 text-white text-xs
                              w-6 h-6 flex items-center justify-center rounded-full"
                              >
                                {idx + 1}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold
                     hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Mengupload Chapter..." : "Tambah Chapter"}
          </button>
        </form>
      </div>
    </main>
  );

}
