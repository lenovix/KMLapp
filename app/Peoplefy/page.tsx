import { Heart, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PeopleList from "@/components/Peoplefy/PeopleList";

async function fetchPeople() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/peoplefy/people`, {
    cache: 'no-store'
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function PeoplefyHome() {
  const people = await fetchPeople();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition border border-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Peoplefy
          </h1>
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

      <main className="max-w-7xl mx-auto p-6">
        <PeopleList initialPeople={people} />
      </main>
    </div>
  );
}