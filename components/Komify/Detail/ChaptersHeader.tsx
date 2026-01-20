"use client";

import { useState } from "react";
import AddChapterModal from "@/components/Komify/Detail/AddChapterModal";
import { Save, ListOrdered, X, Plus, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChaptersHeader({
  slug,
  isOrdering,
  onSaveOrder,
  onToggleOrder,
  onCancelOrder,
}: {
  slug: number;
  isOrdering: boolean;
  onSaveOrder: () => void;
  onToggleOrder: () => void;
  onCancelOrder: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Layers size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Chapters
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Manage Content & Sequence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {!isOrdering ? (
              <motion.button
                key="edit-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={onToggleOrder}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-bold transition-all active:scale-95"
              >
                <ListOrdered size={16} />
                EDIT ORDER
              </motion.button>
            ) : (
              <motion.div
                key="order-actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-zinc-950/50 p-1 rounded-2xl border border-zinc-800/50"
              >
                <button
                  onClick={onSaveOrder}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 text-xs font-black transition-all"
                >
                  <Save size={16} />
                  SAVE
                </button>
                <button
                  onClick={onCancelOrder}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 text-xs font-black transition-all"
                >
                  <X size={16} />
                  CANCEL
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-8 w-[1px] bg-zinc-800 mx-1" />

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            ADD CHAPTER
          </button>
        </div>
      </div>

      <AddChapterModal
        slug={slug}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => location.reload()}
      />
    </>
  );
}
