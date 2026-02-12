"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save, X, Plus, Trash2, GripVertical } from "lucide-react";
import Link from "next/link";

export default function AddPeoplePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State untuk konten dinamis (seperti chapter)
    const [chapters, setChapters] = useState([{ id: 1, title: "", body: "" }]);

    const addChapter = () => {
        setChapters([...chapters, { id: Date.now(), title: "", body: "" }]);
    };

    const removeChapter = (id: number) => {
        if (chapters.length > 1) {
            setChapters(chapters.filter(c => c.id !== id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push("/peoplefy");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            {/* Header Sticky */}
            <header className="sticky top-0 z-10 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/peoplefy" className="p-2 hover:bg-slate-800 rounded-lg transition">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-white">Add New Profile</h1>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/peoplefy" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition">
                            Cancel
                        </Link>
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

                {/* KOLOM KIRI: Detail Info (4/12) */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Full Name</label>
                                <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="Enter name..." />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Role</label>
                                <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="e.g. Designer" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
                                <input type="email" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/50 outline-none" placeholder="email@domain.com" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* KOLOM TENGAH: Content/Chapters (5/12) */}
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
                                {/* Handle Drag */}
                                <div className="mt-2 text-slate-600 group-hover:text-slate-400 cursor-grab">
                                    <GripVertical size={18} />
                                </div>

                                <div className="flex-1 space-y-4">
                                    {/* Judul & Deskripsi */}
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-none p-0 text-lg font-bold placeholder:text-slate-600 focus:ring-0 outline-none"
                                            placeholder={`Block Title #${index + 1}`}
                                        />
                                        <textarea
                                            className="w-full bg-transparent border-none p-0 text-slate-400 placeholder:text-slate-700 focus:ring-0 outline-none resize-none"
                                            rows={2}
                                            placeholder="Write details or descriptions here..."
                                        />
                                    </div>

                                    {/* Multi Image Upload Area */}
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Preview Gambar (Simulasi) */}
                                            {/* Nanti di sini mapping dari state images chapter tersebut */}
                                            <div className="relative w-20 h-20 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden group/img">
                                                <img src="https://via.placeholder.com/80" alt="preview" className="w-full h-full object-cover opacity-50" />
                                                <button className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-md opacity-0 group-hover/img:opacity-100 transition">
                                                    <X size={12} className="text-white" />
                                                </button>
                                            </div>

                                            {/* Tombol Tambah Gambar */}
                                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/5 transition cursor-pointer group/add">
                                                <Upload size={16} className="text-slate-600 group-hover/add:text-blue-400" />
                                                <span className="text-[10px] text-slate-500 mt-1">Add Image</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        // Logika handle multiple files di sini
                                                        console.log(e.target.files);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Block */}
                                <button
                                    onClick={() => removeChapter(chapter.id)}
                                    className="text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State jika belum ada chapter */}
                    {chapters.length === 0 && (
                        <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-2xl">
                            <p className="text-slate-500 text-sm">No content blocks yet. Click "Add Block" to start.</p>
                        </div>
                    )}
                </div>

                {/* KOLOM KANAN: Upload & Actions (3/12) */}
                <div className="lg:col-span-3 space-y-6">
                    <section className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 text-center">Profile Photo</h2>
                        <div className="aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition cursor-pointer relative overflow-hidden">
                            <div className="flex flex-col items-center group-hover:scale-105 transition">
                                <Upload size={32} className="text-slate-500 mb-2 group-hover:text-blue-400" />
                                <span className="text-xs text-slate-400">JPG, PNG up to 5MB</span>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </section>

                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                        <p className="text-[11px] text-blue-300/70 leading-relaxed text-center">
                            Make sure all information is correct before publishing. This profile will be visible to all members.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
}