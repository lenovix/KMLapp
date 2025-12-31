"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Save, Upload, Loader2 } from "lucide-react";
import InfoItem from "@/components/UI/InfoItem";

export interface CastFormData {
  slug: string;
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
  isSaving?: boolean;
}

export default function CastEditModal({
  open,
  initialData,
  onClose,
  onSave,
  isSaving = false,
}: Props) {
  const [form, setForm] = useState<CastFormData>(initialData);
  const [preview, setPreview] = useState<string | null>(
    initialData.avatar || null
  );

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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-100">
            Edit Cast Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-44 h-44 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center">
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar"
                  width={176}
                  height={176}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span className="text-xs text-gray-500">NO IMAGE</span>
              )}
            </div>

            <label className="w-full cursor-pointer">
              <div className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">
                <Upload size={14} />
                Upload Avatar
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleAvatarChange(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-4">
                Informasi Dasar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Nama Panggung">
                  <input
                    className="dark-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </InfoItem>

                <InfoItem label="Alias">
                  <input
                    className="dark-input"
                    value={form.alias || ""}
                    onChange={(e) =>
                      setForm({ ...form, alias: e.target.value })
                    }
                  />
                </InfoItem>

                <InfoItem label="Tanggal Lahir">
                  <input
                    type="date"
                    className="dark-input"
                    value={form.birthDate || ""}
                    onChange={(e) =>
                      setForm({ ...form, birthDate: e.target.value })
                    }
                  />
                </InfoItem>

                <InfoItem label="Debut Mulai">
                  <input
                    type="date"
                    className="dark-input"
                    value={form.debutStart || ""}
                    onChange={(e) =>
                      setForm({ ...form, debutStart: e.target.value })
                    }
                  />
                </InfoItem>

                <InfoItem label="Debut Selesai">
                  <input
                    type="date"
                    className="dark-input"
                    value={form.debutEnd || ""}
                    onChange={(e) =>
                      setForm({ ...form, debutEnd: e.target.value })
                    }
                  />
                </InfoItem>
              </div>
            </div>

            <div className="space-y-4">
              <InfoItem label="Alasan Debut">
                <textarea
                  rows={3}
                  className="dark-input resize-none"
                  value={form.debutReason || ""}
                  onChange={(e) =>
                    setForm({ ...form, debutReason: e.target.value })
                  }
                />
              </InfoItem>

              <InfoItem label="Deskripsi">
                <textarea
                  rows={4}
                  className="dark-input resize-none"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </InfoItem>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-gray-950">
          <button
            disabled={isSaving}
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white inline-flex items-center gap-2 disabled:bg-indigo-800"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
