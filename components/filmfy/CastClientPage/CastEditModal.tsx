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

  socialMedia?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };

  debut?: {
    reason?: string;
    start?: string;
    end?: string;
  };

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

                <InfoItem label="Tempat Lahir">
                  <input
                    className="dark-input"
                    value={form.birthplace || ""}
                    onChange={(e) =>
                      setForm({ ...form, birthplace: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, blood: e.target.value })
                    }
                  />
                </InfoItem>
              </div>

              <h3 className="text-sm font-semibold text-gray-300 mt-6">
                Physical
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Height">
                  <input
                    className="dark-input"
                    value={form.physical?.height || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        physical: { ...form.physical, height: e.target.value },
                      })
                    }
                  />
                </InfoItem>

                <InfoItem label="Measurements">
                  <input
                    className="dark-input"
                    value={form.physical?.measurements || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        physical: {
                          ...form.physical,
                          measurements: e.target.value,
                        },
                      })
                    }
                  />
                </InfoItem>

                <InfoItem label="Cup">
                  <input
                    className="dark-input"
                    value={form.physical?.cup || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        physical: { ...form.physical, cup: e.target.value },
                      })
                    }
                  />
                </InfoItem>

                <InfoItem label="Shoe Size">
                  <input
                    className="dark-input"
                    value={form.physical?.shoeSize || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        physical: {
                          ...form.physical,
                          shoeSize: e.target.value,
                        },
                      })
                    }
                  />
                </InfoItem>
              </div>

              <InfoItem label="Hobbies">
                <textarea
                  rows={2}
                  className="dark-input resize-none"
                  value={form.profile?.hobbies || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      profile: { ...form.profile, hobbies: e.target.value },
                    })
                  }
                />
              </InfoItem>

              <InfoItem label="Special Skills">
                <textarea
                  rows={2}
                  className="dark-input resize-none"
                  value={form.profile?.specialSkills || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      profile: {
                        ...form.profile,
                        specialSkills: e.target.value,
                      },
                    })
                  }
                />
              </InfoItem>

              <h3 className="text-sm font-semibold text-gray-300 mt-6">
                Social Media
              </h3>

              <InfoItem label="Instagram">
                <input
                  className="dark-input"
                  value={form.socialMedia?.instagram || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialMedia: {
                        ...form.socialMedia,
                        instagram: e.target.value,
                      },
                    })
                  }
                />
              </InfoItem>
            </div>

            <h3 className="text-sm font-semibold text-gray-300 mt-6">Debut</h3>

            <InfoItem label="Alasan Debut">
              <textarea
                rows={2}
                className="dark-input"
                value={form.debut?.reason || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    debut: { ...form.debut, reason: e.target.value },
                  })
                }
              />
            </InfoItem>

            <InfoItem label="Debut Mulai">
              <input
                className="dark-input"
                value={form.debut?.start || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    debut: { ...form.debut, start: e.target.value },
                  })
                }
              />
            </InfoItem>

            <InfoItem label="Debut Selesai">
              <input
                className="dark-input"
                value={form.debut?.end || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    debut: { ...form.debut, end: e.target.value },
                  })
                }
              />
            </InfoItem>
          </div>

          <InfoItem label="Tags">
            <input
              className="dark-input"
              placeholder="actor, model, content creator"
              value={(form.tags || []).join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
          </InfoItem>
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
