"use client";

import { useState } from "react";
import AddChapterModal from "@/components/Komify/Detail/AddChapterModal";
import { Save, ListOrdered, X } from "lucide-react";

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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-white">Chapters</h2>

        <div className="flex gap-2">
          {!isOrdering && (
            <button
              onClick={onToggleOrder}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-xl
                bg-slate-700 hover:bg-slate-600
                text-white font-medium shadow
                transition
              "
            >
              <ListOrdered size={18} />
              Edit Order
            </button>
          )}

          {isOrdering && (
            <>
              <button
                onClick={onSaveOrder}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-xl
                  bg-emerald-600 hover:bg-emerald-700
                  text-white font-medium shadow
                  transition
                "
              >
                <Save size={18} />
                Save Order
              </button>

              <button
                onClick={onCancelOrder}
                className="
            inline-flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-red-600 hover:bg-red-700
            text-white font-medium shadow
            transition
          "
              >
                <X size={18} />
                Cancel
              </button>
            </>
          )}

          <button
            onClick={() => setOpen(true)}
            className="
              px-4 py-2 rounded-xl
              bg-blue-600 hover:bg-blue-700
              text-white font-medium shadow
              active:scale-95 transition
            "
          >
            + Tambah Chapter
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
