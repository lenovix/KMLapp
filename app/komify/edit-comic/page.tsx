"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Save, ChevronLeft, Info, Image as ImageIcon } from "lucide-react";
import comicsData from "@/data/komify/comics.json";
import ComicCover from "@/components/Komify/upload/ComicCover";
import DialogBoxCover from "@/components/Komify/upload/DialogBoxCover";
import PrimaryButton from "@/components/UI/PrimaryButton";
import DialogBox from "@/components/UI/DialogBox";
import Alert from "@/components/UI/Alert";

interface Comic {
  slug: number;
  title: string;
  authors: string[];
  artists?: string[];
  groups: string[];
  parodies: string[];
  characters: string[];
  categories: string[];
  tags: string[];
  uploaded: string;
  status: "Ongoing" | "Completed" | "Hiatus";
  cover: string;
}

const comics = comicsData as unknown as Comic[];

function EditComicContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = Number(searchParams.get("slug"));

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [alertData, setAlertData] = useState<{
    title: string;
    message?: string;
    type: "success" | "warning" | "error" | "onprogress";
  } | null>(null);

  const [form, setForm] = useState<
    Partial<Record<keyof Comic | "artists", string>>
  >({});
  const [currentCover, setCurrentCover] = useState("");

  useEffect(() => {
    if (!slug) return;

    const found = comics.find((c) => Number(c.slug) === slug);
    if (!found) return;

    const toString = (val: string | string[] | undefined): string => {
      if (!val) return "";
      return Array.isArray(val) ? val.join(", ") : val;
    };

    setForm({
      title: found.title,
      parodies: toString(found.parodies),
      characters: toString(found.characters),
      artists: toString(found.artists),
      groups: toString(found.groups),
      categories: toString(found.categories),
      uploaded: found.uploaded,
      authors: toString(found.authors),
      tags: toString(found.tags),
      status: found.status,
    });
    setCurrentCover(found.cover);

    const fetchConfig = async (url: string, setter: (d: string[]) => void) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error(`Gagal load ${url}`, err);
      }
    };

    fetchConfig("/data/config/status.json", setStatusOptions);
    fetchConfig("/data/komify/categories.json", setCategoryOptions);
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, categories: values.join(", ") }));
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("slug", String(slug));
      Object.entries(form).forEach(([key, value]) =>
        fd.append(key, value || ""),
      );
      if (coverFile) fd.append("cover", coverFile);

      const res = await fetch("/api/komify/editComic", {
        method: "POST",
        body: fd,
      });
      if (res.ok) router.push(`/komify/${slug}`);
      else throw new Error();
    } catch {
      setAlertData({
        type: "error",
        title: "Gagal",
        message: "Terjadi kesalahan sistem",
      });
    } finally {
      setDialogOpen(false);
    }
  };

  if (!slug) return null;

  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors mb-2"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Edit <span className="text-blue-500">Comic</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Modifikasi informasi data komik kamu.
          </p>
        </div>

        <div className="flex gap-3">
          <PrimaryButton
            onClick={() => setDialogOpen(true)}
            className="px-8 py-3 rounded-2xl shadow-xl shadow-blue-900/20"
          >
            <Save size={18} className="mr-2" /> Simpan
          </PrimaryButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-3 text-blue-500 mb-2">
              <Info size={20} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ["title", "Judul Komik"],
                ["authors", "Penulis"],
                ["artists", "Artist"],
                ["groups", "Scan Group"],
                ["parodies", "Parody Content"],
                ["characters", "Characters"],
              ].map(([name, label]) => (
                <div key={name} className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                    {label}
                  </label>
                  <input
                    name={name}
                    value={form[name as keyof typeof form] || ""}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder={`Input ${label}...`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Tags (Pisahkan dengan koma)
              </label>
              <textarea
                name="tags"
                value={form.tags || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white min-h-25 outline-none focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-blue-500 mb-2">
              <ImageIcon size={20} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">
                Visual & Status
              </h3>
            </div>

            <ComicCover
              cover={currentCover}
              onClick={() => setCoverDialogOpen(true)}
              onDelete={() => {
                setCurrentCover("");
                setCoverFile(null);
              }}
            />

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Publish Status
                </label>
                <select
                  name="status"
                  value={form.status || ""}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500/50 appearance-none"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Categories
                </label>
                <select
                  value={form.categories || ""}
                  onChange={handleMultiSelect}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500/50 custom-scrollbar"
                >
                  {categoryOptions.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="p-2 border-b border-white/5 last:border-0"
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogBoxCover
        open={coverDialogOpen}
        onClose={() => setCoverDialogOpen(false)}
        onSave={(file) => {
          setCoverFile(file);
          setCurrentCover(URL.createObjectURL(file));
          setCoverDialogOpen(false);
        }}
      />

      <DialogBox
        open={dialogOpen}
        title="Simpan Perubahan?"
        desc="Data lama akan diperbarui dengan informasi yang baru kamu masukkan."
        onConfirm={handleSubmit}
        onCancel={() => setDialogOpen(false)}
      />

      {alertData && (
        <Alert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          onClose={() => setAlertData(null)}
        />
      )}
    </main>
  );
}

export default function EditComicPage() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-zinc-500 uppercase font-black tracking-widest">
          Loading Editor...
        </div>
      }
    >
      <EditComicContent />
    </Suspense>
  );
}
