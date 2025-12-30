"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Director {
  id: number;
  name: string;
  avatar?: string;
  films?: number[];
}

export default function DirectorPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/filmfy/director")
      .then((res) => res.json())
      .then((data) => {
        setDirectors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🎬 Director
          </h1>

          <Link
            href="/filmfy/director/create"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            + Tambah Director
          </Link>
        </header>

        {/* Content */}
        {loading ? (
          <p className="text-gray-500">Memuat data director...</p>
        ) : directors.length === 0 ? (
          <p className="text-gray-500">Belum ada director.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {directors.map((director) => (
              <Link
                key={director.id}
                href={`/filmfy/director/${director.id}`}
                className="group bg-white dark:bg-gray-800 border rounded-2xl p-4 hover:shadow-lg transition"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={
                      director.avatar
                        ? `/data/filmfy/directors/${director.avatar}`
                        : "/placeholder/avatar.png"
                    }
                    alt={director.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="mt-3 space-y-1">
                  <h2 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                    {director.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {director.films?.length || 0} film
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
