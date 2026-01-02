"use client";

import { Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  filmId: number;
}

export default function MovieActionButtons({ filmId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ok = confirm(
      "Yakin ingin menghapus film ini?\n\nData & file fisik akan dihapus permanen."
    );
    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch("/api/filmfy/deleteMovie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: filmId }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Gagal menghapus film");
        return;
      }

      router.push("/filmfy");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => router.push(`/filmfy/edit-movie?id=${filmId}`)}
        className="px-3 py-2 rounded-xl border text-sm
        flex items-center gap-2
        hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Pencil className="w-4 h-4" />
        Edit
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm
        flex items-center gap-2 hover:bg-red-700 transition
        disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
        {loading ? "Menghapus..." : "Hapus"}
      </button>
    </div>
  );
}
