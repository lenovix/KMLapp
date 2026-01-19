"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import CalendarPicker from "@/components/UI/CalendarPicker";
import InfoItem from "@/components/UI/InfoItem";

interface Props {
  form: any;
  setForm: (data: any) => void;
}

export default function BasicInfoSection({ form, setForm }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (form?.avatar && !form.avatarFile) {
      setPreview(form.avatar);
    }
  }, [form?.avatar, form?.avatarFile]);

  const handleAvatarChange = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setForm({
      ...form,
      avatarFile: file,
    });
  };

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-sm font-semibold text-gray-300">Informasi Dasar</h2>

      <div className="flex gap-6 items-start">
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
            <div
              className="flex items-center justify-center gap-2
                         w-full px-4 py-2 text-sm rounded-lg
                         border border-gray-700 text-gray-300
                         hover:bg-gray-800"
            >
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Nama Panggung">
          <input
            className="dark-input"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </InfoItem>

        <InfoItem label="Alias">
          <input
            className="dark-input"
            value={form.alias || ""}
            onChange={(e) => setForm({ ...form, alias: e.target.value })}
          />
        </InfoItem>

        <InfoItem label="Birth Date">
          <CalendarPicker
            value={form.birthDate}
            onChange={(val) => setForm({ ...form, birthDate: val })}
          />
        </InfoItem>

        <InfoItem label="Tempat Lahir">
          <input
            className="dark-input"
            value={form.birthplace || ""}
            onChange={(e) => setForm({ ...form, birthplace: e.target.value })}
          />
        </InfoItem>

        <InfoItem label="Zodiak">
          <input
            className="dark-input"
            value={form.sign || ""}
            onChange={(e) => setForm({ ...form, sign: e.target.value })}
          />
        </InfoItem>

        <InfoItem label="Golongan Darah">
          <input
            className="dark-input"
            value={form.blood || ""}
            onChange={(e) => setForm({ ...form, blood: e.target.value })}
          />
        </InfoItem>
      </div>
    </section>
  );
}
