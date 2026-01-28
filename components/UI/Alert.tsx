"use client";

import { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  TriangleAlert,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface AlertProps {
  type?: "success" | "warning" | "error" | "onprogress";
  title: string;
  message?: string;
  duration?: number;
  progress?: number;
  onClose: () => void;
}

export default function Alert({
  type = "error",
  title,
  message,
  duration = 0,
  progress = 0,
  onClose,
}: AlertProps) {
  const [countdown, setCountdown] = useState(
    duration && duration > 0 ? Math.ceil(duration / 1000) : 0
  );
  const calledCloseRef = useRef(false);

  useEffect(() => {
    if (duration <= 0 || type === "onprogress") return;

    const countdownSeconds = Math.ceil(duration / 1000);
    setCountdown(countdownSeconds);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      if (!calledCloseRef.current) {
        calledCloseRef.current = true;
        onClose();
      }
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [duration, type, onClose]);

  const themes = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      border: "border-emerald-500/20",
      bg: "bg-zinc-900/90",
      accent: "bg-emerald-500",
      text: "text-emerald-400",
    },
    warning: {
      icon: <TriangleAlert className="w-5 h-5 text-yellow-400" />,
      border: "border-yellow-500/20",
      bg: "bg-zinc-900/90",
      accent: "bg-yellow-500",
      text: "text-yellow-400",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      border: "border-red-500/20",
      bg: "bg-zinc-900/90",
      accent: "bg-red-500",
      text: "text-red-400",
    },
    onprogress: {
      icon: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
      border: "border-blue-500/20",
      bg: "bg-zinc-900/90",
      accent: "bg-blue-500",
      text: "text-blue-400",
    },
  };

  const theme = themes[type];

  return (
    <div
      className={`
        fixed bottom-8 right-8 z-200
        w-[calc(100%-4rem)] max-w-sm
        p-5 rounded-2xl border backdrop-blur-xl shadow-2xl
        flex flex-col gap-4 animate-in slide-in-from-right-10 duration-300
        ${theme.bg} ${theme.border}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10`}>
          {theme.icon}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4
              className={`font-black text-xs uppercase tracking-widest ${theme.text}`}
            >
              {title}
            </h4>
            {type !== "onprogress" && (
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {message && (
            <p className="text-sm text-zinc-300 mt-1 font-medium leading-relaxed">
              {message}
            </p>
          )}

          {type === "success" && duration > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                Auto-closing in {countdown}s
              </p>
            </div>
          )}
        </div>
      </div>

      {type === "onprogress" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter text-zinc-500">
            <span>Progress Upload</span>
            <span className={theme.text}>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${theme.accent} transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
