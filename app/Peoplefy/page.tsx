"use client"; // Tambahkan ini karena kita akan pakai Search state

import { Search, Heart, Plus, ArrowLeft, MoreVertical } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PeoplefyHome() {
  const [searchQuery, setSearchQuery] = useState("");

  const people = [
    { id: 1, name: "Budi Santoso", role: "Sahabat Kecil", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
    { id: 2, name: "Siti Aminah", role: "Teman Kuliah", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
    { id: 3, name: "Andi Wijaya", role: "Partner Diskusi", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
    { id: 4, name: "Rina Kartika", role: "Teman Traveling", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
  ];

  // Filter berdasarkan search
  const filteredPeople = people.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition border border-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Peoplefy
          </h1>

          {/* Search Box */}
          <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-700 px-3 py-2 rounded-xl w-64 focus-within:w-80 focus-within:border-blue-500 transition-all duration-300">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Cari sahabat..."
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition border border-transparent hover:border-slate-700">
            <Heart size={20} />
          </button>
          <Link href="/peoplefy/add" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition font-semibold shadow-lg shadow-blue-900/40 active:scale-95">
            <Plus size={18} />
            <span className="hidden sm:inline">Add People</span>
          </Link>
        </div>
      </header>

      {/* BODY / CONTENT */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Info Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">Memori Bersama</h2>
          <p className="text-slate-400 text-sm">Menyimpan kenangan indah bersama mereka yang berarti.</p>
        </div>

        {/* Ganti bagian Grid List kamu menjadi seperti ini */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            /* Pindahkan key ke sini (elemen paling luar) */
            <Link href={`/peoplefy/${person.id}`} key={person.id}>
              <div className="group bg-slate-800/30 rounded-3xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">

                {/* Image Container */}
                <div className="relative h-64 bg-slate-700 overflow-hidden">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                  {/* Badge Role */}
                  <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-wider font-bold bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-300 px-2 py-1 rounded-lg">
                    {person.role}
                  </span>
                </div>

                {/* Info Detail */}
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-xs text-slate-500">Baru saja ditambahkan</p>
                  </div>
                  {/* Tips: Gunakan type="button" agar tidak konflik dengan Link */}
                  <button type="button" className="text-slate-500 hover:text-white transition">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}