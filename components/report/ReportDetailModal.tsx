"use client";
import { useState } from "react";
import { X, Calendar, Edit3, Save, Tag, Info } from "lucide-react";

interface Report {
  id: string;
  type: "bug" | "feature";
  project: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  updatedAt?: string;
}

interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ReportDetailModal({
  report,
  onClose,
  onUpdate,
}: ReportDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(report);

  const handleUpdate = async () => {
    const res = await fetch("/api/reports", {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      onUpdate();
      onClose();
    }
  };

  const statusColors = {
    OPEN: "bg-red-500/10 text-red-400 border-red-500/20",
    IN_PROGRESS: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              {isEditing ? (
                <Edit3 size={20} className="text-indigo-400" />
              ) : (
                <Info size={20} className="text-indigo-400" />
              )}
              {isEditing ? "EDIT REPORT" : "REPORT DETAILS"}
            </h2>
            <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mt-1">
              ID: {report.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {isEditing ? (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Report Title
                </label>
                <input
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 h-32 resize-none transition-all"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <select
                    className="w-full bg-slate-900 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "OPEN"
                          | "IN_PROGRESS"
                          | "RESOLVED",
                      })
                    }
                  >
                    <option value="OPEN">🔴 OPEN</option>
                    <option value="IN_PROGRESS">🟡 IN PROGRESS</option>
                    <option value="RESOLVED">🟢 RESOLVED</option>
                  </select>
                </div>
                <div className="space-y-2 opacity-50">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                    Project
                  </label>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 text-sm italic cursor-not-allowed">
                    {report.project}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[report.status]}`}
                >
                  {report.status.replace("_", " ")}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  {report.project}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-slate-400 border border-white/10 uppercase tracking-wider">
                  {report.type}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white leading-tight">
                  {report.title}
                </h3>
                <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                  <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                    {report.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-500">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                      Date Created
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {report.updatedAt && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-slate-500">
                      <Tag size={14} />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                        Last Update
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(report.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-black/20 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Save size={16} /> Save Master Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-white text-black hover:bg-slate-200 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
            >
              <Edit3 size={16} /> Edit Report Information
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
