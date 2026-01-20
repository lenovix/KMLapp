"use client";

import { Trash2, Pencil, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  filmId: number;
}

export default function MovieActionButtons({ filmId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
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
        setLoading(false);
        setShowConfirm(false);
        return;
      }

      router.push("/filmfy");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {!showConfirm ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => router.push(`/filmfy/edit-movie/${filmId}`)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 shadow-sm"
          >
            <Pencil className="w-4 h-4 text-blue-500" />
            <span>Edit Film</span>
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus</span>
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 animate-in fade-in zoom-in duration-200">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed">
              Semua data dan file fisik akan dihapus permanen. Lanjutkan?
            </p>
          </div>

          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </button>
            <button
              disabled={loading}
              onClick={() => setShowConfirm(false)}
              className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
