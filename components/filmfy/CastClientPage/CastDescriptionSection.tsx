"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Save, X, User } from "lucide-react";

interface CastProfile {
  name: string;
  character?: string;
  description?: string;
  avatar?: string | null;
}

interface CastDescriptionSectionProps {
  profile: CastProfile;
  onSave?: (profile: CastProfile) => void;
}

export default function CastDescriptionSection({
  profile,
  onSave,
}: CastDescriptionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<CastProfile>({
    name: profile.name,
    character: profile.character || "",
    description:
      profile.description ||
      `Daftar film yang dibintangi oleh ${profile.name}.`,
    avatar: profile.avatar || null,
  });

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(form);
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative">
      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 flex items-center gap-1
                   text-sm text-blue-600 hover:underline"
      >
        <Pencil className="w-4 h-4" />
        Edit
      </button>

      <div className="flex gap-6 items-start">
        {/* Avatar */}
        <div
          className="w-32 h-32 rounded-2xl bg-gray-200 dark:bg-gray-700
                     flex items-center justify-center overflow-hidden"
        >
          {form.avatar ? (
            <Image
              src={form.avatar}
              alt={form.name}
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          {!isEditing ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {form.name}
              </h1>

              {form.character && (
                <p className="text-sm text-blue-600 font-medium">
                  Sebagai {form.character}
                </p>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
                {form.description}
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama pemeran"
                className="w-full px-3 py-2 rounded-xl border dark:border-gray-700
                           bg-white dark:bg-gray-900 text-sm"
              />

              <input
                type="text"
                value={form.character}
                onChange={(e) =>
                  setForm({ ...form, character: e.target.value })
                }
                placeholder="Nama karakter (opsional)"
                className="w-full px-3 py-2 rounded-xl border dark:border-gray-700
                           bg-white dark:bg-gray-900 text-sm"
              />

              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Deskripsi pemeran"
                className="w-full px-3 py-2 rounded-xl border dark:border-gray-700
                           bg-white dark:bg-gray-900 text-sm"
              />

              <input
                type="text"
                value={form.avatar || ""}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="URL foto profil"
                className="w-full px-3 py-2 rounded-xl border dark:border-gray-700
                           bg-white dark:bg-gray-900 text-sm"
              />

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1
                             px-4 py-2 rounded-xl bg-blue-600
                             text-white text-sm hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-1
                             px-4 py-2 rounded-xl border
                             text-sm"
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
