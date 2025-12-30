"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Save, Upload } from "lucide-react";

export interface CastFormData {
  name: string;
  alias?: string;
  avatar?: string;
  avatarFile?: File | null;
  birthDate?: string;
  debutReason?: string;
  debutStart?: string;
  debutEnd?: string;
  description?: string;
}

interface Props {
  open: boolean;
  initialData: CastFormData;
  onClose: () => void;
  onSave: (data: CastFormData) => void;
}

export default function CastEditModal({
  open,
  initialData,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<CastFormData>(initialData);
  const [preview, setPreview] = useState<string | null>(
    initialData.avatar || null
  );

  /** Reset form saat modal dibuka */
  useEffect(() => {
    if (open) {
      setForm(initialData);
      setPreview(initialData.avatar || null);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleAvatarChange = (file?: File) => {
    if (!file) return;
    setForm({ ...form, avatarFile: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl p-6 space-y-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">Edit Profil Pemeran</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AVATAR */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm text-gray-400">No Image</span>
              )}
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
              <Upload className="w-4 h-4" />
              Upload Foto
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleAvatarChange(e.target.files?.[0])}
              />
            </label>
          </div>

          {/* FORM */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="input"
                placeholder="Nama panggung"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="input"
                placeholder="Nama alias"
                value={form.alias || ""}
                onChange={(e) => setForm({ ...form, alias: e.target.value })}
              />

              <input
                type="date"
                className="input"
                value={form.birthDate || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    birthDate: e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="input"
                value={form.debutStart || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    debutStart: e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="input"
                value={form.debutEnd || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    debutEnd: e.target.value,
                  })
                }
              />
            </div>

            <textarea
              rows={3}
              className="input"
              placeholder="Alasan debut"
              value={form.debutReason || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  debutReason: e.target.value,
                })
              }
            />

            <textarea
              rows={4}
              className="input"
              placeholder="Deskripsi pemeran"
              value={form.description || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
