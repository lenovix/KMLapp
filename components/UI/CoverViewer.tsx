"use client";

import { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

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

  if (!open) return null;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) =>
      Math.min(3, Math.max(0.5, prev + (e.deltaY < 0 ? 0.1 : -0.1)))
    );
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white"
      >
        <X size={28} />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-zinc-900/80 border border-white/10 rounded-lg p-2">
        <button
          onClick={() => setScale((s) => Math.min(3, s + 0.2))}
          className="p-2 hover:bg-white/10 rounded"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
          className="p-2 hover:bg-white/10 rounded"
        >
          <ZoomOut size={18} />
        </button>
        <button onClick={resetView} className="p-2 hover:bg-white/10 rounded">
          <RotateCcw size={18} />
        </button>
      </div>

      <div
        className="
            w-screen h-screen
            overflow-hidden
            cursor-grab
            flex items-center justify-center"
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
          }}
          className="select-none transition-transform duration-75"
        />
      </div>

      <p className="absolute bottom-4 text-xs text-gray-400">
        Scroll untuk zoom • Drag untuk geser
      </p>
    </div>
  );
}
