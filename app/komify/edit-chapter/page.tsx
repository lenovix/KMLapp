"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import comicsData from "@/data/komify/comics.json";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function EditChapterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const chapter = searchParams.get("chapter");

  const [chapterData, setChapterData] = useState<any>(null);
  const [form, setForm] = useState({ title: "", language: "" });
  const [pages, setPages] = useState<
    Array<{ id: string; file?: File; url?: string; filename?: string }>
  >([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!slug || !chapter) return;

    const comic = (comicsData as any[]).find(
      (c) => String(c.slug) === String(slug)
    );
    if (!comic) return;

    const ch = comic.chapters?.find(
      (c: any) => String(c.number) === String(chapter)
    );
    if (!ch) return;

    setChapterData(ch);
    setForm({
      title: ch.title || "",
      language: ch.language || "",
    });

    fetch(`/api/komify/read?slug=${slug}&chapter=${chapter}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data.pages)) return;

        setPages(
          data.pages.map((filename: string, idx: number) => ({
            id: `${idx}-${filename}`,
            filename,
            url: `/komify/${slug}/chapters/${chapter}/${filename}`,
          }))
        );
      });
  }, [slug, chapter]);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    setNewFiles((prev) => [...prev, ...files]);
    setPages((prev) => [
      ...prev,
      ...files.map((file, i) => ({
        id: `new-${Date.now()}-${i}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(pages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setPages(reordered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !chapter) return;

    setLoading(true);

    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("chapter", chapter);
    fd.append("title", form.title);
    fd.append("language", form.language);
    fd.append("order", JSON.stringify(pages.map((p) => p.id)));

    newFiles.forEach((f) => fd.append("files", f));

    try {
      const res = await fetch("/api/komify/editChapter", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        router.push(`/komify/${slug}`);
      } else {
        alert("Gagal update chapter");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!chapterData) {
    return <p className="p-6 text-gray-400">Loading...</p>;
  }
  return (
    <main className="w-full px-6 space-y-8 text-white">
      <header>
        <h1 className="text-3xl font-bold">
          Edit Chapter {chapterData.number}
        </h1>
        <p className="text-sm text-gray-400">
          Atur metadata & urutan halaman chapter
        </p>
      </header>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-300">Judul Chapter</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 bg-white/10 border border-white/10 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Bahasa</label>
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full mt-1 bg-white/10 border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Upload Gambar Baru</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full mt-1 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {/* DRAG DROP */}
      <section className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h2 className="font-semibold mb-4">Urutkan Halaman</h2>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="pages" direction="vertical">
            {(p) => (
              <div
                ref={p.innerRef}
                {...p.droppableProps}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {pages.map((page, i) => (
                  <Draggable key={page.id} draggableId={page.id} index={i}>
                    {(d, s) => (
                      <div
                        ref={d.innerRef}
                        {...d.draggableProps}
                        {...d.dragHandleProps}
                        className={`
                    bg-white/5 border border-white/10 rounded-lg p-2
                    text-center select-none
                    ${s.isDragging ? "ring-2 ring-blue-500" : ""}
                  `}
                        style={d.draggableProps.style}
                      >
                        <div className="text-gray-400 mb-1 cursor-grab">☰</div>

                        <img
                          src={page.url}
                          className="w-full h-36 object-contain mx-auto"
                          draggable={false}
                        />

                        <p className="text-xs text-gray-400 truncate mt-1">
                          {page.filename || page.file?.name}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {p.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </main>
  );
}
