import React from "react";
import {
  Search,
  Heart,
  Plus,
  MoreVertical,
  Link,
  ArrowLeft,
} from "lucide-react";

export default function PeoplefyHome() {
  // Data dummy tetap sama
  const people = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Developer",
      image: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Siti Aminah",
      role: "Designer",
      image: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Andi Wijaya",
      role: "Photographer",
      image: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Rina Kartika",
      role: "Writer",
      image: "https://i.pravatar.cc/150?u=4",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Peoplefy
            </h1>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex items-center bg-slate-800/50 border border-slate-700 px-3 py-2 rounded-xl w-80 focus-within:border-blue-500 transition">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari orang..."
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400 transition">
            <Heart size={22} />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition font-medium shadow-lg shadow-blue-900/20">
            <Plus size={20} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </header>

      {/* BODY / CONTENT */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="md:hidden">
            <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {people.map((person) => (
            <div
              key={person.id}
              className="bg-slate-800/40 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative h-56 bg-slate-700 overflow-hidden">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-90 group-hover:opacity-100"
                />
                {/* Overlay gradient agar nama lebih terbaca jika nanti ada teks di atas gambar */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info Detail */}
              <div className="p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-sm text-slate-400">{person.role}</p>
                </div>
                <button className="text-slate-500 hover:text-white p-1">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
