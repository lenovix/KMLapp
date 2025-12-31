"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, Pencil, Loader2 } from "lucide-react";
import CastEditModal, { CastFormData } from "./CastEditModal";

interface CastDescriptionSectionProps {
  profile: CastFormData & { slug: string };
  onSave?: (profile: CastFormData) => void;
}

export default function CastDescriptionSection({
  profile,
  onSave,
}: CastDescriptionSectionProps) {
  const [openModal, setOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<CastFormData>(profile);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar || null
  );

  const handleSave = async (data: CastFormData) => {
    console.log("Saving for slug:", profile.slug);

    if (!profile.slug) {
      alert("Error: Cast Slug tidak ditemukan!");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("slug", profile.slug);
      formData.append("name", data.name);
      formData.append("alias", data.alias || "");
      formData.append("birthDate", data.birthDate || "");
      formData.append("debutReason", data.debutReason || "");
      formData.append("debutStart", data.debutStart || "");
      formData.append("debutEnd", data.debutEnd || "");
      formData.append("description", data.description || "");

      if (data.avatarFile) {
        formData.append("avatar", data.avatarFile);
      }

      const res = await fetch("/api/filmfy/cast", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setForm({ ...data, avatar: result.avatar || data.avatar });

        if (data.avatarFile) {
          const objectUrl = URL.createObjectURL(data.avatarFile);
          setAvatarPreview(objectUrl);
        }

        setOpenModal(false);
        onSave?.(data);
        alert("Data berhasil disimpan!");
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative">
        <button
          onClick={() => setOpenModal(true)}
          className="absolute top-4 right-4 inline-flex items-center gap-1
               text-xs font-medium text-blue-600 dark:text-blue-400
               hover:underline"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6">
          <div className="flex justify-center md:justify-start">
            <div
              className="w-32 h-32 rounded-2xl overflow-hidden
                   bg-gray-200 dark:bg-gray-800
                   border border-gray-300 dark:border-gray-700
                   shadow-sm"
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt={form.name}
                  width={128}
                  height={128}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {form.name}
              </h1>
              {form.alias && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Alias: <span className="font-medium">{form.alias}</span>
                </p>
              )}
            </div>

            {form.description && (
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-w-2xl">
                {form.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {form.birthDate && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Tanggal Lahir
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {form.birthDate}
                  </p>
                </div>
              )}

              {(form.debutStart || form.debutEnd) && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Masa Debut
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {form.debutStart || "?"} – {form.debutEnd || "Sekarang"}
                  </p>
                </div>
              )}

              {form.debutReason && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Alasan Debut
                  </p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {form.debutReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CastEditModal
        open={openModal}
        initialData={form}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </>
  );
}
