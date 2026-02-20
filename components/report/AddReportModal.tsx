"use client";

import { useState } from "react";
import Alert from "@/components/UI/Alert";

interface AddReportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddReportModal({
  onClose,
  onSuccess,
}: AddReportModalProps) {
  const [type, setType] = useState("bug");
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    type: "success" | "error" | "onprogress";
    title: string;
    message: string;
  } | null>(null);

  const projects = [
    { id: "1", name: "K.Platforms" },
    { id: "2", name: "Komify" },
    { id: "3", name: "Filmfy" },
    { id: "4", name: "Genfy" },
    { id: "5", name: "Animefy" },
    { id: "6", name: "Peoplefy" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) {
      setAlertConfig({
        show: true,
        type: "error",
        title: "Validation Error",
        message: "Please select a project first.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          project,
          title,
          description,
          urgent,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to submit");

      setAlertConfig({
        show: true,
        type: "success",
        title: "Success",
        message: "Issue has been reported to reports.json",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error: any) {
      setAlertConfig({
        show: true,
        type: "error",
        title: "Submission Failed",
        message: error.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: "bug", label: "Bug", icon: "🐛" },
    { id: "feature", label: "Feature", icon: "✨" },
  ];

  return (
    <>
      {alertConfig?.show && (
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          duration={3000}
          onClose={() => setAlertConfig(null)}
        />
      )}
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Submit Issue</h2>
              <p className="text-xs text-slate-400">
                Help us make our projects better
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setType(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${type === cat.id
                    ? "bg-white/10 border-white/20 ring-1 ring-white/10"
                    : "bg-white/2 border-white/5 opacity-50 hover:opacity-100"
                    }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${type === cat.id ? "text-white" : "text-slate-400"
                      }`}
                  >
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-2 block uppercase tracking-wider">
                  Urgency Level
                </label>
                <div className="flex justify-between gap-2">
                  {["Low", "Medium", "High"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setUrgent(lvl)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${urgent === lvl
                        ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                        }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">
                  Project
                </label>
                <div className="relative">
                  <select
                    required
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#121212]">
                      Select Project
                    </option>
                    {projects.map((p) => (
                      <option
                        key={p.id}
                        value={p.name}
                        className="bg-[#121212]"
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">
                  Subject
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's going on?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1.5 block uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more details..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-white resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-2 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-blue-500"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
