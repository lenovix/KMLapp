"use client";

import { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  TriangleAlert,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

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
      setCountdown((prev) => prev - 1);
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

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-600 mt-1" />,
    warning: <TriangleAlert className="w-6 h-6 text-yellow-600 mt-1" />,
    error: <AlertCircle className="w-6 h-6 text-red-600 mt-1" />,
    onprogress: <Loader2 className="w-6 h-6 text-blue-600 mt-1 animate-spin" />,
  };

  const styles = {
    success: {
      border: "border-green-300",
      bg: "bg-green-50",
      title: "text-green-800",
    },
    warning: {
      border: "border-yellow-300",
      bg: "bg-yellow-50",
      title: "text-yellow-800",
    },
    error: {
      border: "border-red-300",
      bg: "bg-red-50",
      title: "text-red-800",
    },
    onprogress: {
      border: "border-blue-300",
      bg: "bg-blue-50",
      title: "text-blue-800",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        fixed bottom-6 right-6
        w-[90%] max-w-md
        p-4 rounded-xl border shadow-md 
        flex flex-col gap-3 z-50
        transition-all duration-300
        ${style.bg} ${style.border}
      `}
      onClick={type !== "onprogress" ? onClose : undefined}
    >
      <div className="flex items-start gap-3">
        {icons[type]}

        <div className="flex-1">
          <h4 className={`font-bold text-lg ${style.title}`}>{title}</h4>
          {message && <p className="text-sm text-gray-700">{message}</p>}

          {type == "success" && duration > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Redirecting in {countdown}s...
            </p>
          )}
        </div>
      </div>

      {type === "onprogress" && (
        <div className="w-full h-2 bg-white rounded-full border border-blue-200 overflow-hidden mt-2">
          <div
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
