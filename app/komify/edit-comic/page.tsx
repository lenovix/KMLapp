"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  Save,
  Info,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import comicsData from "@/data/komify/comics.json";
import ComicCover from "@/components/Komify/upload/ComicCover";
import DialogBoxCover from "@/components/Komify/upload/DialogBoxCover";
import PrimaryButton from "@/components/UI/PrimaryButton";
import DialogBox from "@/components/UI/DialogBox";
import Alert from "@/components/UI/Alert";
import FixParagraphModal from "@/components/Komify/Detail/FixParagraphModal";

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
  status: "Ongoing" | "Complete" | "Not Completed";
  cover: string;
}

const comics = comicsData as unknown as Comic[];

function EditComicContent() {
  const [fixerOpen, setFixerOpen] = useState(false);
  const [activeFixField, setActiveFixField] = useState<string | null>(null);
  const [useDummyCover, setUseDummyCover] = useState(false);
  const dummyPath = "/img/dummy-cover.png";
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

  const handleDummyToggle = (checked: boolean) => {
    setUseDummyCover(checked);
    if (checked) {
      setCurrentCover(dummyPath);
      setCoverFile(null);
    } else {
      const found = comics.find((c) => Number(c.slug) === slug);
      setCurrentCover(found?.cover || "");
    }
  };

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

    fetchConfig("/data/komify/status.json", setStatusOptions);
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

      if (useDummyCover) {
        fd.append("cover", dummyPath);
      } else if (coverFile) {
        fd.append("cover", coverFile);
      }

      const res = await fetch("/api/komify/editComic", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        const cacheBuster = `?t=${Date.now()}`;
        router.push(`/komify/${slug}${cacheBuster}`);
        router.refresh();
      } else {
        throw new Error();
      }
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

  const openFixer = (fieldName: string) => {
    setActiveFixField(fieldName);
    setFixerOpen(true);
  };

  const handleApplyFix = (newValue: string) => {
    if (activeFixField) {
      setForm((prev) => ({ ...prev, [activeFixField]: newValue }));
    }
    setFixerOpen(false);
  };

  if (!slug) return null;

  return (
    <main className="relative min-h-screen mx-auto p-6 sm:p-12 lg:p-16 space-y-12 pb-32 overflow-hidden selection:bg-blue-500/30 selection:text-blue-200 bg-[#050505]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-zinc-950/60 backdrop-blur-2xl border border-white/5 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="space-y-4 z-10">
              <div>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-none mb-3">
                  Edit{" "}
                  <span className="bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    Comic
                  </span>
                </h1>

                {slug && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl backdrop-blur-md">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                      Slug
                    </span>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <code className="text-zinc-400 text-xs font-mono tracking-tight">
                      {slug}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 z-10">
              <button
                onClick={() => router.back()}
                className="px-8 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 uppercase"
              >
                Discard
              </button>

              <PrimaryButton
                onClick={() => setDialogOpen(true)}
                className="relative overflow-hidden px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300 active:scale-95 group/btn"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Save
                    size={18}
                    className="text-blue-100 group-hover/btn:rotate-12 transition-transform duration-300"
                  />
                  <span className="font-black italic tracking-tighter uppercase text-lg">
                    Save Changes
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-12 shadow-2xl transition-all duration-500 hover:border-blue-500/10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none" />

              <div className="flex items-center gap-4 text-blue-400 mb-10">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <Info size={22} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">
                    Basic Information
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">
                    Metadata Core
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {[
                  ["title", "Title"],
                  ["parodies", "Parodies"],
                  ["characters", "Characters"],
                  ["authors", "Authors"],
                  ["artists", "Artists"],
                  ["groups", "Groups"],
                ].map(([name, label]) => {
                  if (name === "authors" && form.categories !== "Manhwa")
                    return null;

                  const isTextArea = name === "title";

                  return (
                    <div
                      key={name}
                      className={`group/input space-y-3 ${isTextArea ? "sm:col-span-2" : ""}`}
                    >
                      <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-zinc-500 group-focus-within/input:text-blue-500 uppercase tracking-[0.2em] transition-colors">
                          {label}
                        </label>
                        {name !== "title" && (
                          <button
                            onClick={() => openFixer(name)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/5 text-blue-500 hover:bg-blue-500 hover:text-white text-[9px] font-black transition-all duration-300 transform active:scale-90 uppercase italic"
                          >
                            <Sparkles size={10} /> format fixer
                          </button>
                        )}
                      </div>

                      {isTextArea ? (
                        <textarea
                          name={name}
                          value={(form as any)[name] || ""}
                          onChange={(e) => handleChange(e as any)}
                          className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-5 text-sm text-white placeholder:text-zinc-700 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 outline-none hover:bg-zinc-950/80 shadow-inner resize-none min-h-[100px] leading-relaxed"
                          placeholder={`Type ${label.toLowerCase()}...`}
                        />
                      ) : (
                        <input
                          name={name}
                          value={(form as any)[name] || ""}
                          onChange={handleChange}
                          className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-5 text-sm text-white placeholder:text-zinc-700 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 outline-none hover:bg-zinc-950/80 shadow-inner"
                          placeholder={`Type ${label.toLowerCase()}...`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 space-y-3 group/input">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[10px] font-black text-zinc-500 group-focus-within/input:text-blue-500 uppercase tracking-[0.2em] transition-colors">
                    Tags Collection{" "}
                    <span className="text-zinc-700 lowercase">
                      (comma separated)
                    </span>
                  </label>
                  <button
                    onClick={() => openFixer("tags")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/5 text-blue-500 hover:bg-blue-500 hover:text-white text-[9px] font-black transition-all duration-300 uppercase italic"
                  >
                    <Sparkles size={10} /> Smart-Fix tags
                  </button>
                </div>
                <textarea
                  name="tags"
                  value={form.tags || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-[2rem] p-6 text-sm text-white min-h-[140px] outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 hover:bg-zinc-950/80 resize-none leading-relaxed"
                  placeholder="Enter tags like: Adult, Anal, Fantasy..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 shadow-2xl">
              <div className="flex items-center gap-4 text-blue-400 mb-8">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <ImageIcon size={22} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">
                  Visual Identity
                </h3>
              </div>

              <div
                onClick={() => handleDummyToggle(!useDummyCover)}
                className="flex items-center justify-between px-5 py-4 bg-zinc-950/80 rounded-2xl border border-white/5 mb-8 cursor-pointer hover:border-blue-500/30 transition-all group/check"
              >
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover/check:text-zinc-200 transition-colors">
                  Use Dummy Cover
                </span>
                <div
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${useDummyCover ? "bg-blue-600" : "bg-zinc-800"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${useDummyCover ? "left-6" : "left-1"}`}
                  />
                </div>
              </div>

              <div className="relative group/cover rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl">
                <ComicCover
                  cover={currentCover}
                  onClick={() => setCoverDialogOpen(true)}
                  onDelete={() => {
                    setCurrentCover("");
                    setCoverFile(null);
                  }}
                />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover/cover:opacity-100 pointer-events-none transition-opacity duration-500" />
              </div>

              <div className="space-y-6 mt-10">
                {[
                  ["status", "Release Status", statusOptions],
                  ["categories", "Category", categoryOptions],
                ].map(([name, label, options]) => (
                  <div key={name as string} className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-2">
                      {label}
                    </label>
                    <div className="relative">
                      <select
                        name={name as string}
                        value={(form as any)[name as string] || ""}
                        onChange={
                          name === "categories"
                            ? (handleMultiSelect as any)
                            : handleChange
                        }
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 pr-10 text-sm text-white outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer font-medium"
                      >
                        {(options as string[]).map((opt) => (
                          <option
                            key={opt}
                            value={opt}
                            className="bg-zinc-900 text-white p-4"
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FixParagraphModal
        open={fixerOpen}
        value={activeFixField ? (form as any)[activeFixField] || "" : ""}
        onApply={handleApplyFix}
        onClose={() => setFixerOpen(false)}
      />

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
