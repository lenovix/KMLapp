"use client";

import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface AlertProps {
  type: "success" | "warning" | "onprogress" | "error";
  message: string;
  duration?: number; // optional, ms before auto-hide
}

export default function Alert({ type, message, duration = 5000 }: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const typeMap = {
    success: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <CheckCircleIcon className="w-5 h-5" />,
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <ExclamationCircleIcon className="w-5 h-5" />,
    },
    onprogress: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: <InformationCircleIcon className="w-5 h-5 animate-spin" />,
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <XCircleIcon className="w-5 h-5" />,
    },
  };

  const { bg, text, icon } = typeMap[type];

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center gap-3 px-4 py-3 rounded-lg shadow-md ${bg} ${text} z-50`}
    >
      {icon}
      <span className="font-medium">{message}</span>
    </div>
  );
}
