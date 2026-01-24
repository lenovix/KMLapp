"use client";

import { useEffect, useState, useCallback } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { Sparkles, X, RotateCcw, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  value: string;
  onApply: (value: string) => void;
  onClose: () => void;
}

export default function FixParagraphModal({
  open,
  value,
  onApply,
  onClose,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const fixParagraph = useCallback((text: string) => {
    if (!text) return "";
    let result = text;

    ["|", "♀", "♂", "•", "−"].forEach((s) => {
      result = result.replaceAll(s, ",");
    });

    const parts = result
      .split(/\d+K?|\d+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 1);

    if (parts.length === 0) return "";

    const joined = parts.join(", ").replace(/,\s*,/g, ",");
    return joined.endsWith(",") ? joined : joined + ",";
  }, []);

  useEffect(() => {
    if (open) {
      setInput(value || "");
      setOutput(fixParagraph(value || ""));
    }
  }, [open, value, fixParagraph]);

  useEffect(() => {
    setOutput(fixParagraph(input));
  }, [input, fixParagraph]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.ctrlKey && e.key === "Enter") onApply(output);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, output, onClose, onApply]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-tight">
                Format Fixer
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium">
                Automatic tags & metadata formatter
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

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Raw Input
            </label>
            <textarea
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder:text-zinc-700 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all resize-none"
              rows={5}
              placeholder="Paste raw text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-1">
              <CheckCircle2 size={12} /> Formatted Result
            </label>
            <div className="relative group">
              <textarea
                className="w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-100 placeholder:text-zinc-800 outline-none resize-none font-medium"
                rows={3}
                readOnly
                placeholder="Resulting format..."
                value={output}
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] bg-blue-500 text-white px-2 py-1 rounded-md font-bold italic">
                  AUTO-FIXED
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setInput("")}
            className="flex items-center gap-2 text-[11px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-tighter"
          >
            <RotateCcw size={14} /> Clear All
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              CANCEL
            </button>
            <PrimaryButton
              onClick={() => onApply(output)}
              className="bg-blue-600 hover:bg-blue-500 px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/20"
            >
              APPLY CHANGES
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
