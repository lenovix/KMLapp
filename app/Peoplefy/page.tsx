"use client";

import { Heart, Plus, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PeopleList from "@/components/Peoplefy/PeopleList";

export default function PeoplefyHome() {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await fetch(`/api/peoplefy/people`, { cache: 'no-store' });
        const data = await res.json();
        setPeople(data);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-8 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <Link href="/" className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition border border-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="hidden md:block text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Peoplefy
          </h1>
        </div>

        <div className="flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau kategori..."
            className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-2xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button className="hidden sm:flex p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition border border-transparent hover:border-slate-700">
            <Heart size={20} />
          </button>
          <Link href="/peoplefy/add" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition font-semibold shadow-lg shadow-blue-900/40 active:scale-95 text-sm">
            <Plus size={18} />
            <span className="hidden sm:inline">Add People</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Memuat data...</div>
        ) : (
          <PeopleList initialPeople={people} searchQuery={searchQuery} />
        )}
      </main>
    </div>
  );
}