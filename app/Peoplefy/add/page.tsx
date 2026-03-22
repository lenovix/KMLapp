"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  Briefcase,
  Users,
  Tag,
  Globe,
} from "lucide-react";
import Link from "next/link";
import CalendarPicker from "@/components/UI/CalendarPicker";
import config from "@/data/peoplefy/config.json";

export default function AddPeoplePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthPlace: "",
    status: config.statusOptions[0],
    lastPosition: "",
    lastCompany: "",
    lastEducation: "",
    tag: config.categoryTags[0],
    description: "",
    profileImage: "",
    socials: [] as { platform: string; url: string }[],
  });

  const [family, setFamily] = useState<{ name: string; relation: string }[]>(
    [],
  );
  const [newsLinks, setNewsLinks] = useState<string[]>([]);
  const [chapters, setChapters] = useState([
    { id: 1, title: "", description: "", images: [] as string[] },
  ]);

  const convertHeicToJpeg = async (file: File): Promise<File | Blob> => {
    const isHEIC = file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic";

    if (isHEIC && typeof window !== "undefined") {
      try {
        const heic2any = (await import("heic2any")).default;

        console.log(`Mengonversi ${file.name}...`);
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.7,
        });

        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

        return new File([finalBlob], file.name.replace(/\.heic$/i, ".jpg"), {
          type: "image/jpeg",
        });
      } catch (error) {
        console.warn("HEIC conversion failed, using original file:", error);
        return file;
      }
    }
    return file;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const processedFile = await convertHeicToJpeg(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
        setLoading(false);
      };
      reader.readAsDataURL(processedFile);
    }
  };

  const addFamilyMember = () =>
    setFamily([...family, { name: "", relation: config.relationOptions[0] }]);
  const addNewsLink = () => setNewsLinks([...newsLinks, ""]);
  const addChapter = () =>
    setChapters([
      ...chapters,
      { id: Date.now(), title: "", description: "", images: [] },
    ]);

  const updateChapter = (id: number, data: any) => {
    setChapters(chapters.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const removeChapter = (id: number) => {
    if (chapters.length > 1) setChapters(chapters.filter((c) => c.id !== id));
  };

  const handleImageUpload = async (
    chapterId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      let processedFile: File | Blob = file;

      if (file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".heic")) {
        processedFile = await convertHeicToJpeg(file);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setChapters((prev) =>
          prev.map((ch) =>
            ch.id === chapterId
              ? { ...ch, images: [...ch.images, reader.result as string] }
              : ch,
          ),
        );
      };
      reader.readAsDataURL(processedFile);
    }
    e.target.value = "";
  };

  const removeImage = (chapterId: number, imgIndex: number) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, images: ch.images.filter((_, i) => i !== imgIndex) }
          : ch,
      ),
    );
  };

  const addSocial = () => {
    setFormData((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        { platform: config.socialPlatforms[0].id, url: "" },
      ],
    }));
  };

  const removeSocial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  };

  const updateSocial = (
    index: number,
    field: "platform" | "url",
    value: string,
  ) => {
    const newSocials = [...formData.socials];
    newSocials[index][field] = value;
    setFormData((prev) => ({ ...prev, socials: newSocials }));
  };

  const removeFamilyMember = (index: number) => {
    setFamily(family.filter((_, i) => i !== index));
  };

  const removeNewsLink = (index: number) => {
    setNewsLinks(newsLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Nama wajib diisi!");
    setLoading(true);
    try {
      const response = await fetch("/api/peoplefy/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, family, newsLinks, chapters }),
      });
      if (response.ok) {
        router.push("/peoplefy");
        router.refresh();
      }
    } catch (err) {
      alert("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/peoplefy"
              className="p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-white">Add New Profile</h1>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Publish Profile
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">
              Basic Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-blue-500"
                  placeholder="Full Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CalendarPicker
                  label="Birth Date"
                  value={formData.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, birthDate: date }))
                  }
                />
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 appearance-none"
                  >
                    {config.statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                  <Tag size={12} /> Category Tag
                </label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {config.categoryTags.map((t) => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
              <Briefcase size={16} /> Career & Education
            </h2>
            <div className="space-y-4">
              <input
                name="lastPosition"
                value={formData.lastPosition}
                onChange={handleInputChange}
                placeholder="Last Position"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
              <input
                name="lastCompany"
                value={formData.lastCompany}
                onChange={handleInputChange}
                placeholder="Last Company"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
              <input
                name="lastEducation"
                value={formData.lastEducation}
                onChange={handleInputChange}
                placeholder="Education"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none"
              />
            </div>
          </section>

          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users size={16} /> Family Tree
              </span>
              <button
                onClick={addFamilyMember}
                type="button"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                <Plus size={16} />
              </button>
            </h2>
            <div className="space-y-3">
              {family.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-3 bg-slate-900/30 border border-slate-700/50 rounded-xl relative group"
                >
                  <div className="flex gap-2">
                    <input
                      placeholder="Name"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                      value={f.name}
                      onChange={(e) => {
                        const newFam = [...family];
                        newFam[i].name = e.target.value;
                        setFamily(newFam);
                      }}
                    />
                    <button
                      onClick={() => removeFamilyMember(i)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <select
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase outline-none focus:border-blue-500"
                    value={f.relation}
                    onChange={(e) => {
                      const newFam = [...family];
                      newFam[i].relation = e.target.value;
                      setFamily(newFam);
                    }}
                  >
                    {config.relationOptions.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {family.length === 0 && (
                <p className="text-[10px] text-slate-600 text-center italic">
                  No family members added
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Timeline & Memories
            </h2>
            <button
              onClick={addChapter}
              className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
            >
              <Plus size={14} /> Add Block
            </button>
          </div>
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="group relative bg-slate-800/20 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition"
            >
              <div className="flex items-start gap-3">
                <div className="mt-2 text-slate-600 group-hover:text-slate-400 cursor-grab">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1 space-y-4">
                  <input
                    value={chapter.title}
                    onChange={(e) =>
                      updateChapter(chapter.id, { title: e.target.value })
                    }
                    className="w-full bg-transparent border-none p-0 text-lg font-bold text-white placeholder:text-slate-600 focus:ring-0 outline-none"
                    placeholder="Event Title"
                  />
                  <textarea
                    value={chapter.description}
                    onChange={(e) =>
                      updateChapter(chapter.id, { description: e.target.value })
                    }
                    className="w-full bg-transparent border-none p-0 text-slate-400 placeholder:text-slate-700 focus:ring-0 outline-none resize-none"
                    rows={2}
                    placeholder="Details..."
                  />
                  <div className="flex flex-wrap gap-3">
                    {chapter.images?.map((url, imgIndex) => {
                      const isVideo = url.startsWith("data:video/") || url.endsWith(".mp4");

                      return (
                        <div key={imgIndex} className="relative w-20 h-20 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden group/img">
                          {isVideo ? (
                            <video src={url} className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} className="w-full h-full object-cover" />
                          )}
                          <button
                            onClick={() => removeImage(chapter.id, imgIndex)}
                            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl hover:border-blue-500/50 cursor-pointer">
                      <Upload size={16} className="text-slate-500" />
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*,video/*,.heic"
                        onChange={(e) => handleImageUpload(chapter.id, e)}
                      />
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => removeChapter(chapter.id)}
                  className="text-slate-600 hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Profile Photo
            </h2>
            <div className="aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              {formData.profileImage ? (
                <>
                  <img
                    src={formData.profileImage}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, profileImage: "" }));
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white z-20 hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload
                    size={32}
                    className="text-slate-500 mb-2 group-hover:text-blue-400"
                  />
                  <span className="text-xs text-slate-400">Upload Photo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*,.heic"
                onChange={handleProfileImage}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>
          </section>

          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={16} /> Social Media
              </div>
              <button
                onClick={addSocial}
                type="button"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                <Plus size={16} />
              </button>
            </h2>

            <div className="space-y-3">
              {formData.socials.map((social, index) => (
                <div
                  key={index}
                  className="group flex flex-col gap-2 p-3 bg-slate-900/30 border border-slate-700/50 rounded-xl relative"
                >
                  <div className="flex items-center gap-2">
                    <select
                      value={social.platform}
                      onChange={(e) =>
                        updateSocial(index, "platform", e.target.value)
                      }
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider outline-none focus:border-blue-500"
                    >
                      {config.socialPlatforms.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeSocial(index)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={social.url}
                    onChange={(e) => updateSocial(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              ))}

              {formData.socials.length === 0 && (
                <p className="text-[10px] text-slate-600 text-center italic">
                  No links added
                </p>
              )}
            </div>
          </section>

          <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe size={16} /> News Links
              </span>
              <button
                onClick={addNewsLink}
                type="button"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                <Plus size={14} />
              </button>
            </h2>
            <div className="space-y-2">
              {newsLinks.map((link, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...newsLinks];
                        newLinks[i] = e.target.value;
                        setNewsLinks(newLinks);
                      }}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 pl-8"
                      placeholder="https://news-article.com/..."
                    />
                    <Globe
                      className="absolute left-2.5 top-2 text-slate-600"
                      size={12}
                    />
                  </div>
                  <button
                    onClick={() => removeNewsLink(i)}
                    className="text-slate-600 hover:text-red-400 transition p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {newsLinks.length === 0 && (
                <p className="text-[10px] text-slate-600 text-center italic">
                  No links added
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
