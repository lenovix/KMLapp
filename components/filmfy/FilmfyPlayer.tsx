"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Play, Pause, RotateCcw, RotateCw, Maximize, 
  Minimize, Volume2, VolumeX, Captions, CaptionsOff 
} from "lucide-react";

interface Props {
  src: string;
  filmId: number;
  subtitleSrc?: string; // Tambahkan prop untuk subtitle (opsional)
}

export default function FilmfyPlayer({ src, filmId, subtitleSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  const storageKey = `filmfy-progress-${filmId}-${src}`;
  const SKIP_TIME = 5;

  // --- Logika Core & Save Progress ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) video.currentTime = Number(savedTime);

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
      localStorage.setItem(storageKey, String(video.currentTime));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [storageKey]);

  // --- Keyboard & Auto-hide UI ---
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) return;
      
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight") skip(SKIP_TIME);
      if (e.key === "ArrowLeft") skip(-SKIP_TIME);
      if (e.key === "f") toggleFullscreen();
      if (e.key === "m") setIsMuted(!isMuted);
      if (e.key === "c") toggleSubtitles(); // Shortcut 'c' untuk Captions
    };

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => { if (isPlaying) setShowControls(false) }, 3000);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPlaying, isMuted, showSubtitles]);

  // --- Actions ---
  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const skip = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime += time;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (Number(e.target.value) / 100) * (videoRef.current?.duration || 0);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleSubtitles = () => {
    const video = videoRef.current;
    if (video && video.textTracks.length > 0) {
      const mode = showSubtitles ? "disabled" : "showing";
      video.textTracks[0].mode = mode;
      setShowSubtitles(!showSubtitles);
    }
  };

  // --- Double Tap / Klik Logic ---
  const [clickCount, setClickCount] = useState(0);
  const handleContainerClick = (e: React.MouseEvent) => {
    // Timer untuk membedakan Single Click (Play/Pause) dan Double Click (Skip)
    setClickCount((prev) => prev + 1);
    
    setTimeout(() => {
      if (clickCount === 1) {
        togglePlay(); // Single click: Play/Pause
      } else if (clickCount === 2) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) skip(-SKIP_TIME); // Tap Kiri
        else skip(SKIP_TIME); // Tap Kanan
      }
      setClickCount(0);
    }, 250);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative group w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        muted={isMuted}
        className="w-full h-full"
        onClick={handleContainerClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous" // Penting untuk memuat subtitle dari domain berbeda
      >
        {subtitleSrc && (
          <track 
            kind="subtitles" 
            src={subtitleSrc} 
            srcLang="id" 
            label="Indonesia" 
            default={showSubtitles} 
          />
        )}
      </video>

      {/* Overlay Kontrol */}
      <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${showControls ? "opacity-100" : "opacity-0"}`}>
        
        {/* Kontrol Bawah */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-auto">
          
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 accent-red-600 cursor-pointer appearance-none rounded-lg hover:h-2 transition-all"
          />

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-5">
              <button onClick={togglePlay} className="hover:scale-110 transition active:scale-95">
                {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
              </button>
              
              <div className="flex items-center gap-4">
                <button onClick={() => skip(-SKIP_TIME)} className="hover:text-red-500 transition"><RotateCcw size={22} /></button>
                <button onClick={() => skip(SKIP_TIME)} className="hover:text-red-500 transition"><RotateCw size={22} /></button>
              </div>
              
              <button onClick={() => setIsMuted(!isMuted)} className="hover:text-red-500 transition">
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            </div>

            <div className="flex items-center gap-5">
              {/* Fitur Subtitle Toggle */}
              {subtitleSrc && (
                <button onClick={toggleSubtitles} className={`transition ${showSubtitles ? "text-red-500" : "text-white hover:text-gray-400"}`}>
                  {showSubtitles ? <Captions size={22} /> : <CaptionsOff size={22} />}
                </button>
              )}

              <span className="text-sm font-mono tracking-tighter">
                {videoRef.current ? formatTime(videoRef.current.currentTime) : "00:00"} / {videoRef.current ? formatTime(videoRef.current.duration) : "00:00"}
              </span>

              <button onClick={toggleFullscreen} className="hover:text-red-500 transition">
                {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper untuk format waktu 00:00
function formatTime(seconds: number) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}