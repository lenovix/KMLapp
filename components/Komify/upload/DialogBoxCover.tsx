"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, UploadCloud, X, Info } from "lucide-react";

interface DialogBoxCoverProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}

export default function DialogBoxCover({
  open,
  onClose,
  onSave,
}: DialogBoxCoverProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return alert("File harus berupa gambar (JPG/PNG/WEBP).");
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert("Ukuran file terlalu besar (Maks 5MB).");
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-tight">
                    Upload Cover
                  </h2>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    Resolution 3:4 recommended
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`
                  border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center 
                  cursor-pointer transition-all duration-300 min-h-[280px]
                  ${
                    preview
                      ? "border-zinc-700 bg-zinc-950/30"
                      : "border-zinc-800 bg-zinc-950/50 hover:border-blue-500/50 hover:bg-blue-500/5"
                  }
                `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => document.getElementById("coverInput")?.click()}
              >
                {!preview ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <UploadCloud size={32} className="text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-zinc-300 text-sm font-semibold">
                        Drop image here
                      </p>
                      <p className="text-zinc-500 text-[11px] mt-1 uppercase tracking-widest font-bold">
                        or click to browse
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-zinc-600">
                      <Info size={12} />
                      <p className="text-[10px]">JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-xl shadow-xl max-h-80 object-cover border border-zinc-800"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest bg-blue-600 px-3 py-1.5 rounded-full">
                        Change Image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                id="coverInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileSelect(e.target.files[0])
                }
              />

              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-800">
                <button
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                  onClick={onClose}
                >
                  CANCEL
                </button>

                <button
                  className={`
                    px-8 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg
                    ${
                      selectedFile
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 active:scale-95"
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed shadow-none"
                    }
                  `}
                  onClick={() => selectedFile && onSave(selectedFile)}
                  disabled={!selectedFile}
                >
                  SAVE COVER
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
