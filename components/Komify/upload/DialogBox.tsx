"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, TriangleAlert, Info, X } from "lucide-react";

interface DialogBoxProps {
  open: boolean;
  title: string;
  desc: string;
  type?: "info" | "warning" | "danger" | "success";
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DialogBox({
  open,
  title,
  desc,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideCancel = false,
  onConfirm,
  onCancel,
}: DialogBoxProps) {
  const theme = {
    info: {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      btn: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20",
    },
    warning: {
      icon: <TriangleAlert className="w-5 h-5 text-yellow-400" />,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-400",
      btn: "bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/20",
    },
    danger: {
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      btn: "bg-red-600 hover:bg-red-500 shadow-red-900/20",
    },
    success: {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      btn: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20",
    },
  };

  const currentTheme = theme[type];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-110 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0" onClick={onCancel} />

          <motion.div
            className="relative bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
          >
            <div className="p-6">
              <div className="flex flex-col items-center text-center gap-4 mb-6">
                <div
                  className={`p-4 rounded-2xl ${currentTheme.bg} border ${currentTheme.border}`}
                >
                  {currentTheme.icon}
                </div>
                <div>
                  <h2
                    className={`text-lg font-black uppercase tracking-tight text-white`}
                  >
                    {title}
                  </h2>
                  <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className={`
                    w-full py-3 rounded-xl text-xs font-black transition-all shadow-lg text-white
                    ${currentTheme.btn}
                  `}
                  onClick={onConfirm}
                >
                  {confirmText.toUpperCase()}
                </button>

                {!hideCancel && (
                  <button
                    className="w-full py-3 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all uppercase"
                    onClick={onCancel}
                  >
                    {cancelText}
                  </button>
                )}
              </div>
            </div>

            <div
              className={`h-1 w-full ${currentTheme.bg.replace("/10", "/30")}`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
