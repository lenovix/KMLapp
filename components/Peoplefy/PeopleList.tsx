"use client";

import { Search, User, Tag } from "lucide-react";
import Link from "next/link";

interface Person {
  id: number | string;
  name: string;
  tag: string;
  profileImage?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface PeopleListProps {
  initialPeople: Person[];
  searchQuery: string;
}

export default function PeopleList({ initialPeople, searchQuery }: PeopleListProps) {
  const filteredPeople = initialPeople
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  return (
    <div className="space-y-8">
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            <Link href={`/peoplefy/${person.id}`} key={person.id} className="group">
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
                  <h3 className="w-full font-bold text-white text-lg group-hover:text-blue-400 transition-colors truncate text-center">
                    {person.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
          <div className="inline-flex p-4 rounded-full bg-slate-900 mb-4 text-slate-700">
            <Search size={32} />
          </div>
          <h3 className="text-white font-medium">Tidak ada hasil ditemukan</h3>
          <p className="text-slate-500 text-sm mt-1">
            "{searchQuery}" tidak cocok dengan nama atau tag manapun.
          </p>
        </div>
      )}
    </div>
  );
}