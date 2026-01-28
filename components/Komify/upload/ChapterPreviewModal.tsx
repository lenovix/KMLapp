"use client";

import { X, Save, LayoutGrid, Info } from "lucide-react";
import ChapterImageGrid from "./ChapterImageGrid";

interface ChapterPreviewModalProps {
  visible: boolean;
  chapter: { title: string; number: number; files: File[] };
  onCancel: () => void;
  onReorder: (files: File[]) => void;
  onSave: () => void;
}

export default function ChapterPreviewModal({
  visible,
  chapter,
  onCancel,
  onReorder,
  onSave,
}: ChapterPreviewModalProps) {
  if (!visible || !chapter) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-100 p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-slate-200 dark:border-slate-800 w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Chapter {chapter.number}
                </span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tight">
                  • {chapter.files.length} Images Loaded
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight line-clamp-1">
                {chapter.title || "Untitled Chapter"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Discard
            </button>

            <button
              onClick={onSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Apply Changes
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50/30 dark:bg-transparent">
          <div className="mx-auto">
            <ChapterImageGrid files={chapter.files} onReorder={onReorder} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
}
