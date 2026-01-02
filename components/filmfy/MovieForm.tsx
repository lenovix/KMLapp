"use client";

import { Upload, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MovieFormProps {
  mode: "create" | "edit";
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function MovieForm({
  mode,
  initialData,
  onSubmit,
}: MovieFormProps) {
  const router = useRouter();

  const [code, setCode] = useState(initialData?.code || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [releaseDate, setReleaseDate] = useState(
    initialData?.releaseDate || ""
  );
  const [director, setDirector] = useState(initialData?.director || "");
  const [maker, setMaker] = useState(initialData?.maker || "");
  const [label, setLabel] = useState(initialData?.label || "");
  const [genre, setGenre] = useState(
    Array.isArray(initialData?.genre) ? initialData.genre.join(", ") : ""
  );
  const [cast, setCast] = useState(
    Array.isArray(initialData?.cast) ? initialData.cast.join(", ") : ""
  );
  const [series, setSeries] = useState(initialData?.series || "");
  const [cencored, setCencored] = useState(
    initialData?.cencored || "Uncensored"
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.cover || null
  );

  const submit = async () => {
    const fd = new FormData();

    if (initialData?.id) {
      fd.append("id", String(initialData.id));
    }

    fd.append("code", code);
    fd.append("title", title);
    fd.append("releaseDate", releaseDate);
    fd.append("director", director);
    fd.append("maker", maker);
    fd.append("label", label);
    fd.append("series", series);
    fd.append("cencored", cencored);
    fd.append("genre", genre);
    fd.append("cast", cast);

    if (coverFile) fd.append("cover", coverFile);

    await onSubmit(fd);

    if (initialData?.id) {
      router.push(`/filmfy/${initialData.id}`);
      router.refresh();
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Metadata Film</h2>

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
          placeholder="Series"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className={inputClass}
        />
      </section>

      <aside className="space-y-6 lg:sticky lg:top-6 h-fit">
        <button
          onClick={submit}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
          bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          <Upload className="w-5 h-5" />
          {mode === "edit" ? "Simpan Perubahan" : "Upload Film"}
        </button>

        <section className="bg-white dark:bg-gray-800 rounded-2xl border p-6 space-y-3">
          <h2 className="text-sm font-semibold">Cover Film</h2>

          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer aspect-3/4 border border-dashed rounded-xl">
            {coverPreview ? (
              <img
                src={coverPreview}
                className="max-h-64 rounded-lg object-cover"
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
                const f = e.target.files?.[0];
                if (!f) return;
                setCoverFile(f);
                setCoverPreview(URL.createObjectURL(f));
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
            <option value="Uncensored">Uncensored</option>
            <option value="Cencored">Cencored</option>
          </select>
        </section>
      </aside>
    </div>
  );
}
