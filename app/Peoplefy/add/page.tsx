"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save, X, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";

export default function AddPeoplePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        birthPlace: "",
        tag: "family",
        description: "",
        profileImage: ""
    });

    interface Chapter {
        id: number;
        title: string;
        description: string;
        images: string[];
    }

    const [chapters, setChapters] = useState<Chapter[]>([{ id: 1, title: "", description: "", images: [] }]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addChapter = () => {
        setChapters([...chapters, { id: Date.now(), title: "", description: "", images: [] }]);
    };

    const updateChapter = (id: number, data: any) => {
        setChapters(chapters.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const removeChapter = (id: number) => {
        if (chapters.length > 1) setChapters(chapters.filter(c => c.id !== id));
    };

    const handleImageUpload = (chapterId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setChapters(prev => prev.map(ch => {
                    if (ch.id === chapterId) {
                        return { ...ch, images: [...(ch.images || []), base64String] };
                    }
                    return ch;
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (chapterId: number, imgIndex: number) => {
        setChapters(prev => prev.map(ch => {
            if (ch.id === chapterId) {
                const updatedImages = ch.images.filter((_, i) => i !== imgIndex);
                return { ...ch, images: updatedImages };
            }
            return ch;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return alert("Nama wajib diisi!");

        setLoading(true);
        try {
            const response = await fetch("/api/peoplefy/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    chapters: chapters
                }),
            });

            if (response.ok) {
                router.push("/peoplefy");
                router.refresh();
            }
        } catch (err) {
            alert("Terjadi kesalahan saat menyimpan data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/peoplefy" className="p-2 hover:bg-slate-800 rounded-lg transition">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Add New Profile</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                            Publish Profile
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
                                <input
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 outline-none text-sm" placeholder="Enter name..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Birth Date</label>
                                    <input name="birthDate" value={formData.birthDate} onChange={handleInputChange} type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="17 Aug 1945" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Birth Place</label>
                                    <input name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none" placeholder="City..." />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Tag / Category</label>
                                <select name="tag" value={formData.tag} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none appearance-none">
                                    <option value="family">Family</option>
                                    <option value="bestie">Bestie</option>
                                    <option value="colleague">Colleague</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" placeholder="Description..."></textarea>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Profile Content</h2>
                        <button
                            onClick={addChapter}
                            className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                        >
                            <Plus size={14} /> Add Block
                        </button>
                    </div>

                    {chapters.map((chapter, index) => (
                        <div key={chapter.id} className="group relative bg-slate-800/20 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition">
                            <div className="flex items-start gap-3">
                                <div className="mt-2 text-slate-600 group-hover:text-slate-400 cursor-grab">
                                    <GripVertical size={18} />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={chapter.title}
                                            onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                                            className="w-full bg-transparent border-none p-0 text-lg font-bold text-white placeholder:text-slate-600 focus:ring-0 outline-none"
                                            placeholder={`Block Title #${index + 1}`}
                                        />
                                        <textarea
                                            value={chapter.description}
                                            onChange={(e) => updateChapter(chapter.id, { description: e.target.value })}
                                            className="w-full bg-transparent border-none p-0 text-slate-400 placeholder:text-slate-700 focus:ring-0 outline-none resize-none"
                                            rows={2}
                                            placeholder="Write details or descriptions here..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-3">
                                            {chapter.images && chapter.images.map((imgUrl, imgIndex) => (
                                                <div key={imgIndex} className="relative w-24 h-24 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden group/img shadow-lg">
                                                    <img
                                                        src={imgUrl}
                                                        alt="preview"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center">
                                                        <button
                                                            onClick={() => removeImage(chapter.id, imgIndex)}
                                                            className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-transform transform hover:scale-110"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition cursor-pointer group/add">
                                                <div className="p-2 bg-slate-800 rounded-full group-hover/add:bg-blue-500/20 transition">
                                                    <Upload size={18} className="text-slate-500 group-hover/add:text-blue-400" />
                                                </div>
                                                <span className="text-[10px] font-medium text-slate-500 mt-2 group-hover/add:text-blue-300">Upload</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(chapter.id, e)}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeChapter(chapter.id)}
                                    className="text-slate-600 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {chapters.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-800/5">
                            <div className="inline-flex p-4 rounded-full bg-slate-800/50 mb-4">
                                <Plus size={24} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 text-sm">No content blocks yet.<br />Click "Add Block" to start documenting memories.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 text-center">Profile Photo</h2>
                        <div className="aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition cursor-pointer relative overflow-hidden">
                            {formData.profileImage ? (
                                <>
                                    <img src={formData.profileImage} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, profileImage: "" }))}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center group-hover:scale-105 transition">
                                    <Upload size={32} className="text-slate-500 mb-2 group-hover:text-blue-400" />
                                    <span className="text-xs text-slate-400">Upload Photo</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleProfileImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}