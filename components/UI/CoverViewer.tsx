"use client";

import { useState, useEffect, useRef } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CoverViewerProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function CoverViewer({
  open,
  src,
  alt,
  onClose,
}: CoverViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      setScale((prev) => Math.min(5, Math.max(0.5, prev + delta)));
    };

    if (open) {
      container.addEventListener("wheel", handleWheelNative, {
        passive: false,
      });
      document.body.style.overflow = "hidden";
    }

    return () => {
      container.removeEventListener("wheel", handleWheelNative);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const manualZoom = (type: "in" | "out") => {
    setScale((prev) => {
      const step = 0.25;
      const newScale = type === "in" ? prev + step : prev - step;
      return Math.min(5, Math.max(0.5, newScale));
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newScale = Math.min(5, Math.max(0.5, scale + delta));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md flex items-center justify-center overflow-hidden"
      >
        <div
          className={`absolute inset-0 flex items-center justify-center ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: dragging
                ? "none"
                : "transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)",
            }}
            className="max-h-[85vh] w-auto shadow-2xl rounded-sm select-none pointer-events-none"
          />
        </div>

        <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-white/10 rounded-2xl backdrop-blur-xl pointer-events-auto shadow-2xl">
            <button
              onClick={() => manualZoom("in")}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => manualZoom("out")}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ZoomOut size={20} />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button
              onClick={resetView}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-3 bg-zinc-900/80 hover:bg-rose-500 text-white rounded-full transition-all pointer-events-auto active:scale-95 border border-white/10"
          >
            <X size={24} />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-zinc-900/50 px-6 py-3 rounded-full border border-white/5 pointer-events-none">
          <span className="flex items-center gap-2">
            <Move size={12} /> Drag to pan
          </span>
          <div className="w-1 h-1 bg-zinc-700 rounded-full" />
          <span className="flex items-center gap-2">
            <Maximize size={12} /> Scroll to zoom
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
