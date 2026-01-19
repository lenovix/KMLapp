"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";

import BasicInfoSection from "@/components/filmfy/cast/edit/sections/BasicInfoSection";
import PhysicalSection from "@/components/filmfy/cast/edit/sections/PhysicalSection";
import ProfileSection from "@/components/filmfy/cast/edit/sections/ProfileSection";
import SocialMediaSection from "@/components/filmfy/cast/edit/sections/SocialMediaSection";
import DebutSection from "@/components/filmfy/cast/edit/sections/DebutSection";
import TagsSection from "@/components/filmfy/cast/edit/sections/TagsSection";

export interface SocialMediaItem {
  platform: string;
  url: string;
}

export interface CastFormData {
  slug: string;
  name: string;
  alias?: string;
  avatar?: string;
  avatarFile?: File | null;

  birthDate?: string;
  age?: string;
  birthplace?: string;
  sign?: string;
  blood?: string;

  physical?: {
    height?: string;
    measurements?: string;
    cup?: string;
    shoeSize?: string;
    hairLength?: string;
    hairColor?: string;
  };

  profile?: {
    hobbies?: string;
    specialSkills?: string;
  };

  tags?: string[];

  socialMedia?: SocialMediaItem[];

  debut?: {
    reason?: string;
    start?: string;
    end?: string;
  };

  description?: string;
}

export default function CastEditForm({
  initialData,
}: {
  initialData: CastFormData;
}) {
  const [form, setForm] = useState<CastFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append("slug", form.slug);
      formData.append("name", form.name);
      if (form.alias) formData.append("alias", form.alias);
      if (form.birthDate) formData.append("birthDate", form.birthDate);
      if (form.age) formData.append("age", form.age);
      if (form.birthplace) formData.append("birthplace", form.birthplace);
      if (form.sign) formData.append("sign", form.sign);
      if (form.blood) formData.append("blood", form.blood);
      if (form.description) formData.append("description", form.description);

      if (form.avatarFile) {
        formData.append("avatar", form.avatarFile);
      }

      if (form.physical) {
        Object.entries(form.physical).forEach(([k, v]) => {
          if (v) formData.append(`physical.${k}`, v);
        });
      }
      if (form.profile) {
        Object.entries(form.profile).forEach(([k, v]) => {
          if (v) formData.append(`profile.${k}`, v);
        });
      }

      if (form.socialMedia && form.socialMedia.length > 0) {
        formData.append("socialMedia", JSON.stringify(form.socialMedia));
      }

      if (form.debut) {
        Object.entries(form.debut).forEach(([k, v]) => {
          if (v) formData.append(`debut.${k}`, v);
        });
      }

      if (form.tags?.length) {
        formData.append("tags", form.tags.join(","));
      }

      const res = await fetch("/api/filmfy/cast", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result?.error || "Failed to save cast");
      }

      router.push(`/filmfy/cast/${form.slug}`);
      router.refresh();
    } catch (err) {
      console.error("SAVE CAST ERROR:", err);
      alert("Gagal menyimpan data cast");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <BasicInfoSection form={form} setForm={setForm} />
      <DebutSection form={form} setForm={setForm} />
      <PhysicalSection form={form} setForm={setForm} />
      <TagsSection form={form} setForm={setForm} />
      <SocialMediaSection form={form} setForm={setForm} />
      <ProfileSection form={form} setForm={setForm} />

      <div className="flex justify-end pb-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white
                     flex items-center gap-2 disabled:opacity-60 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Save size={18} />
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
