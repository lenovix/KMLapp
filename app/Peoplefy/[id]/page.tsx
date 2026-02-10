"use client";

import { ArrowLeft, Calendar, MapPin, Heart, Share2, Plus, Camera, Info } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PersonDetail() {
    const params = useParams();

    // Data dummy (Sama seperti sebelumnya)
    const person = {
        id: 1,
        name: "Budi Santoso",
        role: "Sahabat Kecil",
        bio: "Teman dari zaman main kelereng sampai sekarang jadi partner ngopi paling asik. Selalu punya cerita lucu setiap ketemu.",
        profileImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        memories: [
            { id: 101, url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500", date: "12 Jan 2024", location: "Bandung" },
            { id: 102, url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500", date: "05 Feb 2024", location: "Jakarta" },
            { id: 103, url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500", date: "20 Mar 2024", location: "Bali" },
            { id: 104, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500", date: "15 Apr 2024", location: "Jogja" },
            { id: 105, url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500", date: "22 Mei 2024", location: "Surabaya" },
        ]
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {/* HEADER FLOATING */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/peoplefy" className="group flex items-center gap-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 p-2 pr-4 rounded-full text-slate-300 hover:text-white transition">
                        <div className="bg-slate-800 p-1 rounded-full group-hover:bg-blue-600 transition">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="text-sm font-medium">Koleksi</span>
                    </Link>

                    <div className="flex gap-2">
                        <button className="p-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full hover:bg-slate-800 transition">
                            <Share2 size={18} />
                        </button>
                        <button className="p-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full hover:bg-slate-800 transition text-red-400">
                            <Heart size={18} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* TOP PROFILE SECTION */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
                        <img
                            src={person.profileImg}
                            alt={person.name}
                            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full border-4 border-[#020617]">
                            <Camera size={20} className="text-white" />
                        </div>
                    </div>

                    <span className="block text-blue-400 font-bold tracking-[0.2em] text-xs uppercase mb-3">
                        {person.role}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        {person.name}
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic">
                        "{person.bio}"
                    </p>

                    {/* STATS */}
                    <div className="flex justify-center gap-8 mt-10">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">{person.memories.length}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Memori</div>
                        </div>
                        <div className="w-[1px] bg-slate-800 h-10 self-center"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">4</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Kota</div>
                        </div>
                        <div className="w-[1px] bg-slate-800 h-10 self-center"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">2024</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Sejak</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <main className="max-w-6xl mx-auto px-6 pb-24">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                    <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500">Timeline Foto</h2>
                    <div className="h-[1px] flex-1 bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Add New Memory Card */}
                    <button className="group relative aspect-square rounded-3xl border-2 border-dashed border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-slate-500 group-hover:text-blue-400" />
                        </div>
                        <span className="text-slate-500 font-medium group-hover:text-blue-400">Tambah Memori</span>
                    </button>

                    {person.memories.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800"
                        >
                            <img
                                src={photo.url}
                                alt="Memory"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Info Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2 text-white font-semibold mb-1">
                                        <MapPin size={16} className="text-blue-400" />
                                        {photo.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Calendar size={14} />
                                        {photo.date}
                                    </div>
                                </div>
                            </div>

                            {/* Top Action */}
                            <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Info size={16} className="text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}