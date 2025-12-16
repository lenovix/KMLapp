"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Upload, Trash2, Trash } from "lucide-react";
import FileUploadInput from "@/components/UI/FileUploadInput";
import comicsData from "@/data/komify/comics.json";
import DialogBox from "@/components/UI/DialogBox";
import PrimaryButton from "@/components/UI/PrimaryButton";

export default function EditChapterPage() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = Number(searchParams.get("slug"));
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
      fetch("/data/config/language.json")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLanguages(data);
          }
        })
        .catch(console.error);

  }, [slug, chapter]);

  useEffect(() => {
    return () => {
      pages.forEach((p) => {
        if (p.url?.startsWith("blob:")) {
          URL.revokeObjectURL(p.url);
        }
      });
    };
  }, [pages]);
  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    setNewFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const filtered = fileArray.filter((f) => !existingNames.has(f.name));
      return [...prev, ...filtered];
    });

    setPages((prev) => {
      const existingNames = new Set(prev.map((p) => p.filename));
      const timestamp = Date.now();

      const newPages = fileArray
        .filter((f) => !existingNames.has(f.name))
        .map((file, index) => ({
          id: `new-${timestamp}-${index}-${file.name}`,
          file,
          url: URL.createObjectURL(file),
          filename: file.name,
        }));

      return [...prev, ...newPages];
    });
  };



  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(pages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setPages(reordered);
  };

  const updatePageOrder = async () => {
    if (!slug || !chapter) return;

    setLoading(true);

    try {
      const res = await fetch("/api/komify/updatePageOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          chapter,
          order: pages.map((p) => p.filename || p.file?.name).filter(Boolean),
        }),
      });

      if (!res.ok) {
        alert("Gagal update posisi halaman");
        return;
      }

      alert("Posisi halaman berhasil diperbarui");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };


  const submitChapter = async () => {
    if (!slug || !chapter) return;

    setLoading(true);

    const fd = new FormData();
    fd.append("slug", slug.toString());
    fd.append("chapter", chapter);
    fd.append("title", form.title);
    fd.append("language", form.language);
    fd.append(
      "order",
      JSON.stringify(
        pages.map((p) => p.filename || p.file?.name).filter(Boolean)
      )
    );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleDeletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setNewFiles((prev) => prev.filter((f) => !id.includes(f.name)));
  };

  if (!chapterData) {
    return <p className="p-6 text-gray-400">Loading...</p>;
  }
  return (
    <>
      <main className="w-full px-6 space-y-6 text-white">
        <header>
          <h1 className="text-3xl font-bold">
            Edit Chapter {chapterData.number}
          </h1>
          <p className="text-sm text-gray-400">
            Atur metadata & urutan halaman chapter
          </p>
        </header>

        {/* MAIN LAYOUT */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ================= LEFT — DRAG AREA (3/4) ================= */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
            {/* === HEADER === */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">
                Chapter Pages
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {pages.length} pages
                </span>

                <PrimaryButton
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={updatePageOrder}
                >
                  {loading ? "Updating..." : "Update Posisi"}
                </PrimaryButton>
              </div>
            </div>

            {/* === UPLOAD BAR === */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <FileUploadInput
                multiple
                accept="image/*"
                icon={<Upload size={16} />}
                text="Upload Pages"
                countFile={pages.length}
                onChange={handleFileUpload}
              />

              <PrimaryButton
                variant="outline"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={() => setPages([])}
              >
                Clear
              </PrimaryButton>
            </div>

            {/* === GRID PREVIEW === */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pages" direction="vertical">
                {(p) => (
                  <div
                    ref={p.innerRef}
                    {...p.droppableProps}
                    className="
                      grid
                      grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
                      gap-4
                      max-h-[70vh]
                      overflow-y-auto
                      pr-2
                    "
                  >
                    {pages.map((page, i) => (
                      <Draggable key={page.id} draggableId={page.id} index={i}>
                        {(d, s) => (
                          <div
                            ref={d.innerRef}
                            {...d.draggableProps}
                            style={d.draggableProps.style}
                            className={`
                              relative group
                              bg-white/5 border border-white/10
                              rounded-xl p-2
                              transition
                              hover:border-blue-500/40
                              ${s.isDragging ? "ring-2 ring-blue-500" : ""}
                            `}
                          >
                            {/* DRAG HANDLE */}
                            <div
                              {...d.dragHandleProps}
                              className="
                                absolute top-2 left-2
                                z-10
                                flex items-center justify-center
                                w-7 h-7
                                text-gray-300
                                bg-black/50
                                rounded-md
                                cursor-grab
                                opacity-0 group-hover:opacity-100
                                transition
                              "
                              title="Drag to reorder"
                            >
                              ☰
                            </div>

                            {/* DELETE BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleDeletePage(page.id)}
                              className="
                                absolute top-2 right-2
                                z-10
                                flex items-center justify-center
                                w-7 h-7
                                bg-red-600/90 hover:bg-red-600
                                text-white
                                rounded-md
                                opacity-0 group-hover:opacity-100
                                transition
                              "
                              title="Hapus halaman"
                            >
                              <Trash2 size={14} />
                            </button>

                            {/* IMAGE */}
                            <img
                              src={page.url}
                              draggable={false}
                              className="
                                w-full h-40
                                object-contain
                                rounded-md
                                bg-black/20
                              "
                            />

                            {/* FILENAME */}
                            <p className="text-xs text-gray-400 truncate mt-2 text-center">
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
          </div>

          {/* ================= RIGHT — DETAIL (1/4) ================= */}
          <aside className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 h-fit sticky top-6">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <select
                  name="language"
                  value={form.language}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, language: e.target.value }))
                  }
                  className="
                    w-full mt-1
                    bg-white/10 border border-white/10
                    rounded px-3 py-2
                    text-white
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map((lang) => (
                    <option
                      key={lang}
                      value={lang}
                      className="bg-slate-800 text-white"
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          </aside>
        </section>
      </main>
      {
        <DialogBox
          open={confirmOpen}
          title="Simpan Perubahan Chapter?"
          desc="Perubahan judul, bahasa, dan urutan halaman akan disimpan dan tidak bisa dibatalkan."
          type="warning"
          confirmText="Ya, Simpan"
          cancelText="Batal"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            submitChapter();
          }}
        />
      }
    </>
  );

}
