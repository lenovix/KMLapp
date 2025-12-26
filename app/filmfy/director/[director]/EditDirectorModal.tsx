"use client";

import { X, Save } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface EditDirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  name: string;
  description?: string;
  avatar?: string | null;

  onSave: (data: { name: string; description: string }) => void;
}

export default function EditDirectorModal({
  isOpen,
  onClose,
  slug,
  name: initialName,
  description = "",
  avatar,
  onSave,
}: EditDirectorModalProps) {
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(description);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(avatar || null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900
                   rounded-2xl shadow-xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Director
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo / Avatar
          </label>

          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-800
                         flex items-center justify-center overflow-hidden"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-500">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <label
              className="cursor-pointer text-sm px-4 py-2 rounded-xl
                         border hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Ganti Logo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama Director
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-xl border
                         dark:border-gray-700 bg-white dark:bg-gray-800
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              className="mt-1 w-full px-4 py-2 rounded-xl border
                         dark:border-gray-700 bg-white dark:bg-gray-800
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border
                       dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Batal
          </button>

          <button
            onClick={async () => {
              const formData = new FormData();
              formData.append("slug", slug);
              formData.append("name", name);
              formData.append("description", desc);
              if (avatarFile) formData.append("avatar", avatarFile);

              await fetch("/api/filmfy/director", {
                method: "POST",
                body: formData,
              });

              onSave({ name, description: desc });
              onClose();
            }}
            className="inline-flex items-center gap-2 px-4 py-2
                       rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
