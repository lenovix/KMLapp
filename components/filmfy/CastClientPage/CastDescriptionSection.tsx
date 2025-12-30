"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Pencil } from "lucide-react";
import CastEditModal, { CastFormData } from "./CastEditModal";

interface CastDescriptionSectionProps {
  profile: CastFormData;
  onSave?: (profile: CastFormData) => void;
}

export default function CastDescriptionSection({
  profile,
  onSave,
}: CastDescriptionSectionProps) {
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<CastFormData>({
    name: profile.name,
    alias: profile.alias || "",
    avatar: profile.avatar || "",
    birthDate: profile.birthDate || "",
    debutReason: profile.debutReason || "",
    debutStart: profile.debutStart || "",
    debutEnd: profile.debutEnd || "",
    description:
      profile.description ||
      `Daftar film yang dibintangi oleh ${profile.name}.`,
  });

  return (
    <>
      {/* DISPLAY SECTION */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 relative">
        {/* Edit Button */}
        <button
          onClick={() => setOpenModal(true)}
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
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {form.name}
            </h1>

            {form.alias && (
              <p className="text-sm text-gray-500">Alias: {form.alias}</p>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl">
              {form.description}
            </p>

            {form.birthDate && (
              <p className="text-xs text-gray-400">Lahir: {form.birthDate}</p>
            )}
          </div>
        </div>
      </section>

      {/* MODAL */}
      <CastEditModal
        open={openModal}
        initialData={form}
        onClose={() => setOpenModal(false)}
        onSave={(data) => {
          setForm(data);
          setOpenModal(false);
          onSave?.(data);
        }}
      />
    </>
  );
}
