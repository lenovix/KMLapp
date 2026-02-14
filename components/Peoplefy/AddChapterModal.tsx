"use client";

import { X, FolderPlus } from "lucide-react";
import { useState } from "react";

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}

export default function AddChapterModal({
  isOpen,
  onClose,
  onSave,
}: AddChapterModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.title.trim()) return alert("Judul wajib diisi!");
    onSave(formData);
    setFormData({ title: "", description: "" });
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderPlus className="text-blue-500" /> Chapter Baru
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                Judul Chapter
              </label>
              <input
                type="text"
                placeholder="Contoh: Masa Kuliah"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                Deskripsi
              </label>
              <textarea
                placeholder="Ceritakan sedikit tentang memori ini..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 mt-4"
            >
              Simpan Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
