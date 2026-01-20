"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, TriangleAlert, Info } from "lucide-react";

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
  const config = {
    info: {
      icon: <Info className="w-6 h-6 text-blue-400" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      button: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20",
    },
    warning: {
      icon: <TriangleAlert className="w-6 h-6 text-amber-400" />,
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      button: "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20",
    },
    danger: {
      icon: <TriangleAlert className="w-6 h-6 text-rose-400" />,
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      button: "bg-rose-600 hover:bg-rose-500 shadow-rose-900/20",
    },
    success: {
      icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      button: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20",
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className={`p-8 pb-4 flex flex-col items-center text-center`}>
              <div
                className={`mb-4 p-4 rounded-2xl ${config[type].bg} border ${config[type].border}`}
              >
                {config[type].icon}
              </div>

              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                {title}
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                {desc}
              </p>
            </div>

            <div className="p-6 bg-zinc-950/50 flex flex-col gap-2">
              <button
                className={`
                  w-full py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.15em]
                  transition-all shadow-lg ${config[type].button}
                `}
                onClick={onConfirm}
              >
                {confirmText}
              </button>

              {!hideCancel && (
                <button
                  className="
                    w-full py-3 rounded-2xl text-zinc-500 font-bold text-xs uppercase tracking-widest
                    hover:text-zinc-200 hover:bg-zinc-800 transition-all
                  "
                  onClick={onCancel}
                >
                  {cancelText}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
