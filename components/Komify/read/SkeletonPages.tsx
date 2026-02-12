"use client";

import { motion } from "framer-motion";

export default function SkeletonPages() {
  return (
    <div className="w-full flex flex-col items-center gap-6 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative w-full max-w-3xl h-[80vh] overflow-hidden rounded-3xl bg-zinc-900/80 border border-white/5 shadow-inner"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="space-y-3 flex flex-col items-center opacity-30">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 animate-spin-slow" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-1.5 bg-zinc-800 rounded-full" />
                <div className="w-16 h-1 bg-zinc-800 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
        </div>
        Loading Content
      </div>
    </div>
  );
}