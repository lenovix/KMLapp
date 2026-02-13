"use client";

import { X, RotateCcw, RotateCw, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ImageViewerProps {
  src: string;
  onClose: () => void;
}

export default function ImageViewer({ src, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const rotateRImage = useCallback(() => setRotation((prev) => prev + 90), []);
  const rotateLImage = useCallback(() => setRotation((prev) => prev - 90), []);

  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, scale + delta), 5);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "e" || e.key === "R") rotateRImage();
      if (e.key === "q" || e.key === "L") rotateLImage();
      if (e.key === "r") resetTransform();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, rotateRImage, rotateLImage, resetTransform]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md select-none p-4"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-6 right-6 flex gap-3 z-110">
        <button
          onClick={rotateLImage}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/10 shadow-xl"
          title="Rotate Left (L)"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={rotateRImage}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/10 shadow-xl"
          title="Rotate Right (R)"
        >
          <RotateCw size={20} />
        </button>
        <button
          onClick={resetTransform}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-blue-400 transition-all border border-white/10 shadow-xl"
          title="Reset View (0)"
        >
          <RefreshCw size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-all shadow-xl"
          title="Close (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 backdrop-blur-xl pointer-events-none flex gap-6">
        <span className="flex items-center gap-2">
          Zoom: <span className="text-white">{Math.round(scale * 100)}%</span>
        </span>
        <span className="flex items-center gap-2">
          Rotation: <span className="text-white">{rotation}°</span>
        </span>
      </div>

      <div
        className={`relative transition-all duration-300 ease-out ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <img
          src={src}
          alt="Preview"
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
