"use client";

import { useState } from "react";
import { Search, User, Tag } from "lucide-react";
import Link from "next/link";

interface Person {
  id: number | string;
  name: string;
  tag: string;
  profileImage?: string;
  description?: string;
}

interface PeopleListProps {
  initialPeople: Person[];
}

export default function PeopleList({ initialPeople }: PeopleListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeople = initialPeople.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Cari nama atau kategori (ex: bestie)..."
            className="w-full bg-slate-900/50 border border-slate-800 text-slate-200 text-sm rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="text-sm text-slate-500">
          Menampilkan{" "}
          <span className="text-slate-200 font-medium">
            {filteredPeople.length}
          </span>{" "}
          orang
        </div>
      </div>

      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            <Link
              href={`/peoplefy/${person.id}`}
              key={person.id}
              className="group"
            >
              <div className="bg-slate-800/20 rounded-[2.5rem] border border-slate-800/50 overflow-hidden hover:border-blue-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="relative h-72 bg-slate-900 overflow-hidden">
                  {person.profileImage ? (
                    <img
                      src={person.profileImage}
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <User size={48} className="text-slate-700" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-5 left-5">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold bg-blue-500/10 backdrop-blur-md border border-blue-400/20 text-blue-400 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Tag size={10} />
                      {person.tag}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex justify-between items-center bg-slate-900/40 border-t border-slate-800/50">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors truncate text-center">
                      {person.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
          <div className="inline-flex p-4 rounded-full bg-slate-900 mb-4">
            <Search size={32} className="text-slate-700" />
          </div>
          <h3 className="text-white font-medium">Tidak ada hasil ditemukan</h3>
          <p className="text-slate-500 text-sm mt-1">
            Coba gunakan kata kunci lain untuk mencari seseorang.
          </p>
        </div>
      )}
    </div>
  );
}
