"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReaderImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function ReaderImage({
  src,
  alt,
  priority = false,
}: ReaderImageProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setStatus("loading");
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      <div
        className={`relative w-full overflow-hidden rounded-xl transition-all duration-500 border border-white/5 
        ${status === "loading" ? "bg-zinc-900 animate-pulse min-h-[500px]" : "bg-transparent"}`}
      >
        <AnimatePresence>
          {status === "loading" && (
            <motion.div
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            >
              <ImageIcon className="text-zinc-700 animate-bounce" size={32} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                Rendering Page...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {status === "error" && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 bg-zinc-900/50">
            <AlertCircle className="text-rose-500" size={40} />
            <div className="text-center">
              <p className="text-sm font-bold text-white">
                Gagal memuat halaman
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                Koneksi terputus atau file hilang
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        )}

        <Image
          key={`${src}-${retryCount}`}
          src={src}
          alt={alt}
          width={1200}
          height={1800}
          priority={priority}
          unoptimized={true}
          onLoadingComplete={() => setStatus("success")}
          onError={() => setStatus("error")}
          className={`
            w-full h-auto
            transition-all duration-700 ease-out
            ${status === "success" ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"}
          `}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none group-hover:bg-blue-500/[0.02] transition-colors duration-500" />
    </div>
  );
}
