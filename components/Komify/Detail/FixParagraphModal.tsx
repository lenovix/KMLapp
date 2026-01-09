"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";

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

  const fixParagraph = (text: string) => {
    let result = text;

    ["|", "♀", "♂"].forEach((s) => {
      result = result.replaceAll(s, ",");
    });

    const parts = result
      .split(/\d+K?|\d+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];

    return parts.join(", ") + ",";
  };

  useEffect(() => {
    if (open) {
      setInput(value || "");
      setOutput(fixParagraph(value || ""));
    }
  }, [open, value]);

  useEffect(() => {
    setOutput(fixParagraph(input));
  }, [input]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, input]);

  if (!open) return null;

  const handleSubmit = () => {
    onApply(output);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-semibold text-white">
          Fix Paragraph Tool
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          Convert paragraf → format koma otomatis
        </p>

        <textarea
          className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={4}
          placeholder="Masukkan paragraf di sini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <textarea
          className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-emerald-400"
          rows={3}
          readOnly
          placeholder="Hasil akan muncul di sini..."
          value={output}
        />

        <div className="flex justify-between">
          <button
            onClick={handleClear}
            className="text-sm text-slate-400 hover:text-white"
          >
            Clear
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-white"
            >
              Close
            </button>

            <PrimaryButton size="sm" onClick={handleSubmit}>
              Replace
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
