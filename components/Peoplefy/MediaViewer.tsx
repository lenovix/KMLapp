"use client";

import {
  X,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

interface MediaViewerProps {
  src: string;
  onClose: () => void;
}

export default function MediaViewer({ src, onClose }: MediaViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = src.match(/\.(mp4|webm|ogg)$/i);

  const rotateRImage = useCallback(() => setRotation((prev) => prev + 90), []);
  const rotateLImage = useCallback(() => setRotation((prev) => prev - 90), []);

  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
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
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, isPlaying]);

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 backdrop-blur-xl select-none p-4"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="absolute top-6 right-6 flex gap-3 z-210">
        {isVideo && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all border border-white/10"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}
        <button
          onClick={rotateLImage}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/10"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={rotateRImage}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white border border-white/10"
        >
          <RotateCw size={20} />
        </button>
        <button
          onClick={resetTransform}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-blue-400 border border-white/10"
        >
          <RefreshCw size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full text-white shadow-xl"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className={`relative transition-all duration-300 ease-out ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
        }}
        onMouseDown={handleMouseDown}
      >
        {isVideo ? (
          <div className="relative group/video">
            <video
              ref={videoRef}
              src={src}
              autoPlay
              loop
              muted={isMuted}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl pointer-events-none"
            />
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity cursor-pointer"
            >
              <div className="bg-black/50 p-6 rounded-full backdrop-blur-sm">
                {isPlaying ? (
                  <Pause size={40} className="text-white" />
                ) : (
                  <Play size={40} className="text-white" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <img
            src={src}
            alt="Preview"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl pointer-events-none"
            draggable={false}
          />
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 flex gap-4 backdrop-blur-md">
        <span>{isVideo ? "Video Mode" : "Image Mode"}</span>
        <span>{Math.round(scale * 100)}% Zoom</span>
      </div>
    </div>
  );
}
