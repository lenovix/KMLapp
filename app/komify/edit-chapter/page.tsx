"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Trash2,
  GripVertical,
  Languages,
  ShieldCheck,
  FileText,
} from "lucide-react";
import comicsData from "@/data/komify/comics.json";
import DialogBox from "@/components/UI/DialogBox";
import PrimaryButton from "@/components/UI/PrimaryButton";

interface Chapter {
  number: string | number;
  title: string;
  language?: string;
  cencored?: string;
}

interface Comic {
  slug: string | number;
  title: string;
  chapters: Chapter[];
}

interface PageItem {
  id: string;
  file?: File;
  url?: string;
  filename?: string;
}

function EditChapterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");
  const chapterParam = searchParams.get("chapter");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [languages, setLanguages] = useState<string[]>([]);
  const [cencoredList, setCencoredList] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [form, setForm] = useState({ title: "", language: "", cencored: "" });
  const [pages, setPages] = useState<PageItem[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!slugParam || !chapterParam) return;

    const comics = comicsData as unknown as Comic[];
    const comic = comics.find((c) => String(c.slug) === slugParam);
    const ch = comic?.chapters?.find((c) => String(c.number) === chapterParam);

    if (!ch) return;

    setChapterData(ch);
    setForm({
      title: ch.title || "",
      language: ch.language || "Indonesian",
      cencored: ch.cencored || "Uncensored",
    });

    fetch(`/api/komify/read?slug=${slugParam}&chapter=${chapterParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.pages)) {
          setPages(
            data.pages.map((filename: string, idx: number) => ({
              id: `old-${idx}-${filename}`,
              filename,
              url: `/komify/${slugParam}/chapters/${chapterParam}/${filename}`,
            }))
          );
        }
      });

    const fetchConfig = (url: string, setter: (d: string[]) => void) => {
      fetch(url)
        .then((res) => res.json())
        .then(setter)
        .catch(console.error);
    };
    fetchConfig("/data/config/language.json", setLanguages);
    fetchConfig("/data/config/cencored.json", setCencoredList);
  }, [slugParam, chapterParam]);

  useEffect(() => {
    return () => {
      pages.forEach((p) => {
        if (p.url?.startsWith("blob:")) URL.revokeObjectURL(p.url);
      });
    };
  }, [pages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const timestamp = Date.now();

    const newItems = fileArray.map((file, index) => ({
      id: `new-${timestamp}-${index}`,
      file,
      url: URL.createObjectURL(file),
      filename: file.name,
    }));

    setNewFiles((prev) => [...prev, ...fileArray]);
    setPages((prev) => [...prev, ...newItems]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(pages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPages(items);
  };

  const saveChapterChanges = async (onlyOrder = false) => {
    if (!slugParam || !chapterParam || loading) return;
    setLoading(true);

    try {
      const order = pages.map((p) => p.filename).filter(Boolean) as string[];

      await fetch("/api/komify/updatePageOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugParam, chapter: chapterParam, order }),
      });

      if (onlyOrder) {
        alert("Urutan berhasil disimpan!");
        return;
      }

      const fd = new FormData();
      fd.append("slug", slugParam);
      fd.append("chapter", chapterParam);
      fd.append("title", form.title);
      fd.append("language", form.language);
      fd.append("cencored", form.cencored);
      newFiles.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/komify/editChapter", {
        method: "POST",
        body: fd,
      });
      if (res.ok) router.push(`/komify/${slugParam}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (!chapterData)
    return (
      <div className="p-20 text-center animate-pulse text-zinc-500 font-black uppercase tracking-widest">
        Loading Chapter Data...
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Edit Chapter{" "}
            <span className="text-blue-500">{chapterData.number}</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            Tarik dan lepas gambar untuk mengatur urutan halaman.
          </p>
        </div>
        <div className="flex gap-3">
          <PrimaryButton variant="outline" onClick={() => router.back()}>
            Batal
          </PrimaryButton>
          <PrimaryButton
            onClick={() => setConfirmOpen(true)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Simpan Chapter"}
          </PrimaryButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-4xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {pages.length} Total Pages
              </h3>
              <button
                onClick={() => {
                  if (confirm("Hapus semua halaman?")) {
                    setPages([]);
                    setNewFiles([]);
                  }
                }}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
              >
                Clear All
              </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="pages-grid" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
                  >
                    {pages.map((page, index) => (
                      <Draggable
                        key={page.id}
                        draggableId={page.id}
                        index={index}
                      >
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`relative group bg-zinc-950 border rounded-2xl p-2 transition-all ${
                              snapshot.isDragging
                                ? "border-blue-500 shadow-2xl z-50 scale-105"
                                : "border-zinc-800"
                            }`}
                          >
                            <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-zinc-900">
                              <img
                                src={page.url}
                                alt="page"
                                className="w-full h-full object-cover"
                              />

                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <div
                                  {...dragProvided.dragHandleProps}
                                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-grab"
                                >
                                  <GripVertical size={16} />
                                </div>
                                <button
                                  onClick={() => {
                                    setPages((p) =>
                                      p.filter((item) => item.id !== page.id)
                                    );
                                    if (page.file) {
                                      setNewFiles((prev) =>
                                        prev.filter((f) => f !== page.file)
                                      );
                                    }
                                  }}
                                  className="p-2 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold">
                                #{index + 1}
                              </div>
                            </div>
                            <p className="text-[9px] text-zinc-500 truncate mt-2 px-1 uppercase tracking-tighter">
                              {page.filename}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    <div className="relative aspect-3/4">
                      <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl cursor-pointer transition-all group">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          accept="image/*"
                        />
                        <div className="p-4 bg-zinc-900 rounded-full group-hover:scale-110 transition-transform mb-3">
                          <Plus
                            className="text-zinc-500 group-hover:text-blue-500"
                            size={24}
                          />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
                          Add Pages
                        </span>
                      </label>
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-4xl p-6 shadow-2xl space-y-6 sticky top-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <FileText size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">
                  Chapter Info
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Judul Chapter
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <Languages size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    Bahasa
                  </label>
                </div>
                <select
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                  <ShieldCheck size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest">
                    Sensor
                  </label>
                </div>
                <select
                  value={form.cencored}
                  onChange={(e) =>
                    setForm({ ...form, cencored: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none"
                >
                  {cencoredList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <PrimaryButton
                variant="outline"
                className="w-full text-[10px]"
                onClick={() => saveChapterChanges(true)}
              >
                Hanya Update Urutan
              </PrimaryButton>
            </div>
          </div>
        </aside>
      </div>

      <DialogBox
        open={confirmOpen}
        title="Simpan Chapter?"
        desc="Urutan halaman dan metadata akan diperbarui secara permanen."
        onConfirm={() => saveChapterChanges()}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}

export default function EditChapterPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-zinc-500 uppercase font-black tracking-widest">
          Loading...
        </div>
      }
    >
      <EditChapterContent />
    </Suspense>
  );
}
