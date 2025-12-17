"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import comicsData from "@/data/komify/comics.json";
import ComicCover from "@/components/Komify/upload/ComicCover";
import DialogBoxCover from "@/components/Komify/upload/DialogBoxCover";
import PrimaryButton from "@/components/UI/PrimaryButton";
import DialogBox from "@/components/UI/DialogBox";
import Alert from "@/components/UI/Alert";

interface ComicData {
  slug: number;
  title: string;
  authors: string[];
  artist: string[];
  groups: string[];
  parodies: string[];
  characters: string[];
  categories: string[];
  tags: string[];
  uploaded: string;
  status: "Ongoing" | "Completed" | "Hiatus";
  cover: string;
}

export default function EditComicPage() {
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [alertData, setAlertData] = useState<{
    title: string;
    message?: string;
    type: "success" | "warning" | "error" | "onprogress";
    progress?: number;
    duration?: number;
    onClose?: () => void;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: "",
    desc: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  const [comicData, setComicData] = useState<ComicData>({
    slug: 0,
    title: "",
    authors: [],
    artist: [],
    groups: [],
    parodies: [],
    characters: [],
    categories: [],
    tags: [],
    uploaded: new Date().toISOString().split("T")[0],
    status: "Ongoing",
    cover: "",
  });
  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = Number(searchParams.get("slug"));
  const [form, setForm] = useState<any>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const found = (comicsData as any[]).find(
      (c) => Number(c.slug) === Number(slug)
    );

    if (!found) return;

    const toArray = (val: string | string[] | null | undefined): string[] => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };

    const toString = (val: string | string[] | null | undefined): string => {
      if (!val) return "";
      return Array.isArray(val) ? val.join(", ") : val;
    };

    setComicData({
      slug: found.slug,
      title: found.title || "",

      authors: toArray(found.authors),
      artist: toArray(found.artists),
      groups: toArray(found.groups),
      parodies: toArray(found.parodies),
      characters: toArray(found.characters),
      categories: toArray(found.categories),
      tags: toArray(found.tags),

      uploaded: found.uploaded || "",
      status: found.status || "Ongoing",
      cover: found.cover || "",
    });

    setForm({
      title: found.title || "",

      parodies: toString(found.parodies),
      characters: toString(found.characters),
      artists: toString(found.artists),
      groups: toString(found.groups),
      categories: toString(found.categories),

      uploaded: found.uploaded || "",
      authors: toString(found.authors),
      tags: toString(found.tags),

      status: found.status || "",
    });


    const fetchStatus = async () => {
      try {
        const res = await fetch("/data/config/status.json");
        const data = await res.json();
        setStatusOptions(data);
      } catch (err) {
        console.error("Gagal load status.json", err);
      }
    };

    fetchStatus();

    const fetchCategories = async () => {
      try {
        const res = await fetch("/data/komify/categories.json");
        const data = await res.json();
        setCategoryOptions(data);
      } catch (err) {
        console.error("Gagal load categories.json", err);
      }
    };

    fetchCategories();
  }, [slug]);

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, selectedOptions } = e.target;

    const values = Array.from(selectedOptions).map((opt) => opt.value);

    setForm((prev: any) => ({
      ...prev,
      [name]: values.join(", "),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!slug) return;

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("slug", String(slug));

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value as string);
      });

      if (coverFile) {
        fd.append("cover", coverFile);
      }

      const res = await fetch("/api/komify/editComic", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        router.push(`/komify/${slug}`);
      } else {
        setAlertData({
          type: "error",
          title: "Gagal",
          message: "Gagal update komik",
        });
      }
    } catch (err) {
      setAlertData({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menyimpan",
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };


  const handleOpenDialog = () => {
    // OPTIONAL: validasi sederhana
    if (!form.title?.trim()) {
      setAlertData({
        type: "warning",
        title: "Judul kosong",
        message: "Judul komik wajib diisi",
      });
      return;
    }

    setDialogData({
      title: "Simpan Perubahan?",
      desc: "Pastikan semua data sudah benar sebelum melanjutkan.",
      onConfirm: handleSubmit,
      onCancel: () => setDialogOpen(false),
    });

    setDialogOpen(true);
  };


  if (!comicData.slug) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-white">Edit Komik :: {comicData.title}</h1>
          <p className="text-sm text-gray-400">
            Perbarui metadata dan cover komik
          </p>
        </header>

        {/* FORM */}
        <form
          encType="multipart/form-data"
          className="space-y-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
              <div className="grid gap-4">
                {[
                  ["title", "Judul"],
                  ["parodies", "Parodies"],
                  ["characters", "Characters"],
                  ["artists", "Artists"],
                  ["groups", "Groups"],
                  ["authors", "Author"],
                  ["tags", "Tags"],
                ].map(([name, label]) => (
                  <div key={name} className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">
                      {label}
                    </label>
                    <input
                      name={name}
                      value={form[name] || ""}
                      onChange={handleChange}
                      className="border p-2 rounded w-full bg-white/10 text-white placeholder-gray-300"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Categories
                </label>

                <select
                  name="categories"
                  multiple
                  value={(form.categories || "").split(", ").filter(Boolean)}
                  onChange={handleMultiSelect}
                  className="border p-2 rounded w-full bg-white/10 text-white placeholder-gray-300"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* RIGHT: COVER */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-sm space-y-4">
              <PrimaryButton
                type="button"
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleOpenDialog}
              >
                Simpan Perubahan
              </PrimaryButton>
              <ComicCover
                cover={comicData.cover}
                onClick={() => setCoverDialogOpen(true)}
                onDelete={() =>
                  setComicData((prev) => ({ ...prev, cover: "" }))
                }
              />
              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status || "Ongoing"}
                    onChange={handleChange}
                    className="border p-2 rounded w-full bg-white/10 text-white placeholder-gray-300"
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="bg-gray-800"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* COVER DIALOG */}
      <DialogBoxCover
        open={coverDialogOpen}
        onClose={() => setCoverDialogOpen(false)}
        onSave={(file) => {
          setCoverDialogOpen(false);
          setCoverFile(file);
          setComicData((prev) => ({
            ...prev,
            cover: URL.createObjectURL(file),
          }));
        }}
      />

      {/* CONFIRM DIALOG */}
      <DialogBox
        open={dialogOpen}
        title={dialogData.title}
        desc={dialogData.desc}
        onConfirm={dialogData.onConfirm}
        onCancel={dialogData.onCancel}
      />

      {/* ALERT */}
      {alertData && (
        <Alert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          progress={alertData.progress}
          duration={alertData.duration}
          onClose={() => setAlertData(null)}
        />
      )}
    </>
  );
}
