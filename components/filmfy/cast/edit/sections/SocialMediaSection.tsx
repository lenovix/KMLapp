"use client";

import InfoItem from "@/components/UI/InfoItem";
import { Plus, Trash2 } from "lucide-react";
import metadata from "@/data/filmfy/metadata-cast.json";

export default function SocialMediaSection({ form, setForm }: any) {
  const socialOptions =
    metadata.find((m) => m.category === "Social Media")?.options || [];
  const socials = Array.isArray(form.socialMedia) ? form.socialMedia : [];

  const addField = () => {
    setForm({
      ...form,
      socialMedia: [...socials, { platform: "Homepage", url: "" }],
    });
  };

  const removeField = (index: number) => {
    const updated = socials.filter((_: any, i: number) => i !== index);
    setForm({ ...form, socialMedia: updated });
  };

  const updateField = (
    index: number,
    key: "platform" | "url",
    value: string,
  ) => {
    const updated = socials.map((item: any, i: number) =>
      i === index ? { ...item, [key]: value } : item,
    );
    setForm({ ...form, socialMedia: updated });
  };

  return (
    <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-300">Social Media</h2>
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
        >
          <Plus className="w-3 h-3" />
          Tambah Sosmed
        </button>
      </div>

      <div className="space-y-4">
        {socials.length === 0 && (
          <p className="text-xs text-gray-500 italic text-center py-4 border border-dashed border-gray-800 rounded-xl">
            Belum ada social media yang ditambahkan.
          </p>
        )}

        {socials.map((item: any, index: number) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-gray-950/50 p-3 rounded-xl border border-gray-800"
          >
            <div className="w-full sm:w-1/3">
              <InfoItem label="Platform">
                <select
                  value={item.platform}
                  onChange={(e) =>
                    updateField(index, "platform", e.target.value)
                  }
                  className="w-full bg-gray-900 border border-gray-800 text-gray-200 text-sm rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {socialOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </InfoItem>
            </div>

            <div className="w-full sm:flex-1">
              <InfoItem label="URL / Username">
                <input
                  type="text"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => updateField(index, "url", e.target.value)}
                  className="dark-input w-full"
                />
              </InfoItem>
            </div>

            <button
              type="button"
              onClick={() => removeField(index)}
              className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
              title="Hapus"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
