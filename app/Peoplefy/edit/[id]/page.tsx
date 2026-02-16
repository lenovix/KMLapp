"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, Plus, Trash2, Briefcase, Users, Globe, Upload, ChevronDown } from "lucide-react";
import CalendarPicker from "@/components/UI/CalendarPicker";
import config from "@/data/peoplefy/config.json";

export default function EditPeoplePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

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

    const [family, setFamily] = useState<{ name: string; relation: string }[]>([]);
    const [newsLinks, setNewsLinks] = useState<string[]>([]);
    const [chapters, setChapters] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/peoplefy/people/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || "",
                        birthDate: data.birthDate || "",
                        birthPlace: data.birthPlace || "",
                        status: data.status || config.statusOptions[0],
                        lastPosition: data.lastPosition || "",
                        lastCompany: data.lastCompany || "",
                        lastEducation: data.lastEducation || "",
                        tag: data.tag || config.categoryTags[0],
                        description: data.description || "",
                        profileImage: data.profileImage || "",
                        socials: data.socials || [],
                    });
                    setFamily(data.family || []);
                    setNewsLinks(data.newsLinks || []);
                    setChapters(data.chapters || []);
                }
            } catch (err) {
                console.error("Failed to fetch data");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addFamilyMember = () =>
        setFamily([...family, { name: "", relation: config.relationOptions[0] }]);
    const addNewsLink = () => setNewsLinks([...newsLinks, ""]);

    const removeFamilyMember = (index: number) => {
        setFamily(family.filter((_, i) => i !== index));
    };

    const removeNewsLink = (index: number) => {
        setNewsLinks(newsLinks.filter((_, i) => i !== index));
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

    const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    profileImage: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return alert("Nama wajib diisi!");
        setLoading(true);

        try {
            const response = await fetch(`/api/peoplefy/people/${id}/edit`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, family, newsLinks, chapters }),
            });

            if (response.ok) {
                router.push(`/peoplefy/${id}`);
                router.refresh();
            }
        } catch (err) {
            alert("Error updating data");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading data...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 selection:bg-blue-500/30">
            <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-[#0f172a]/70 backdrop-blur-xl px-6 py-4 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200 border border-transparent hover:border-slate-700"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-0.5">Editor Mode</p>
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                Edit Profile: <span className="text-slate-400 font-medium">{formData.name}</span>
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>Save Changes</span>
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-8">

                    <section className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Users size={20} />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">Basic Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">FULL NAME</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-900/40 border border-slate-700/60 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-5 py-3.5 outline-none transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <CalendarPicker
                                label="BIRTH DATE"
                                value={formData.birthDate}
                                onChange={(date) => setFormData((prev) => ({ ...prev, birthDate: date }))}
                            />

                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">CURRENT STATUS</label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-900/40 border border-slate-700/60 focus:border-blue-500/50 rounded-2xl px-5 py-3.5 text-sm outline-none appearance-none cursor-pointer"
                                    >
                                        {config.statusOptions.map((opt) => (
                                            <option key={opt} value={opt} className="bg-[#0f172a]">{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                    <Users size={20} />
                                </div>
                                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-400">Family Tree</h2>
                            </div>
                            <button
                                onClick={addFamilyMember}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700/40 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all text-slate-300"
                            >
                                <Plus size={14} /> Add Member
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {family.map((f, i) => (
                                <div key={i} className="group p-4 bg-slate-900/40 border border-slate-700/40 rounded-2xl hover:border-slate-600 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <input
                                            placeholder="Member Name"
                                            className="flex-1 bg-transparent border-b border-slate-700 focus:border-blue-500 px-1 py-1 text-sm outline-none transition-all"
                                            value={f.name}
                                            onChange={(e) => {
                                                const newFam = [...family];
                                                newFam[i].name = e.target.value;
                                                setFamily(newFam);
                                            }}
                                        />
                                        <button onClick={() => removeFamilyMember(i)} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <select
                                        className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                                        value={f.relation}
                                        onChange={(e) => {
                                            const newFam = [...family];
                                            newFam[i].relation = e.target.value;
                                            setFamily(newFam);
                                        }}
                                    >
                                        {config.relationOptions.map((rel) => (
                                            <option key={rel} value={rel}>{rel}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-8 text-center">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Profile Photo</h2>
                        <div className="relative group mx-auto w-48 h-48">
                            <div className="w-full h-full rounded-3xl overflow-hidden border-2 border-dashed border-slate-700 group-hover:border-blue-500/50 transition-all bg-slate-900 flex flex-col items-center justify-center">
                                {formData.profileImage ? (
                                    <>
                                        <img src={formData.profileImage} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, profileImage: "" }))}
                                                className="p-3 bg-red-500 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center p-6">
                                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload size={24} className="text-slate-400 group-hover:text-blue-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">CLICK TO UPLOAD</span>
                                    </div >
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleProfileImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    </section>

                    <section className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                            <Briefcase size={14} /> Career & Education
                        </h2>
                        <div className="space-y-4">
                            {(['lastPosition', 'lastCompany', 'lastEducation'] as const).map((field) => (
                                <input
                                    key={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    placeholder={field.replace('last', 'Last ')}
                                    className="w-full bg-slate-900/40 border border-slate-700/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                />
                            ))}
                        </div>
                    </section>

                    <section className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                <Globe size={14} /> Social Connections
                            </h2>
                            <button onClick={addSocial} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                                <Plus size={14} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.socials.map((social, index) => (
                                <div key={index} className="p-3 bg-slate-900/40 border border-slate-700/30 rounded-xl space-y-2">
                                    <div className="flex gap-2">
                                        <select
                                            value={social.platform}
                                            onChange={(e) => updateSocial(index, "platform", e.target.value)}
                                            className="flex-1 bg-slate-800 text-[10px] font-bold uppercase p-1.5 rounded-lg outline-none"
                                        >
                                            {config.socialPlatforms.map((p) => (
                                                <option key={p.id} value={p.id}>{p.label}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => removeSocial(index)} className="text-slate-600 hover:text-red-400"><X size={14} /></button>
                                    </div>
                                    <input
                                        value={social.url}
                                        onChange={(e) => updateSocial(index, "url", e.target.value)}
                                        placeholder="Profile URL"
                                        className="w-full bg-transparent border-b border-slate-700 focus:border-blue-500 text-xs py-1 outline-none"
                                    />
                                </div>
                            ))}
                        </div>

                    </section>
                    <section className="bg-slate-800/30 border border-slate-700/40 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                <Globe size={14} /> News Links
                            </h2>
                            <button onClick={addNewsLink} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                                <Plus size={14} />
                            </button>
                        </div>
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