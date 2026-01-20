"use client";

import { motion } from "framer-motion";

export default function SkeletonPages() {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative w-full max-w-3xl h-[80vh] overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
            <div className="w-12 h-1 bg-zinc-800 rounded-full mb-2 animate-pulse" />
            <div className="w-24 h-1 bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 animate-pulse">
        <span className="w-2 h-2 bg-blue-500 rounded-full" />
        Preparing Pages
      </div>
    </div>
  );
}
