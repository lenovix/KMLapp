"use client";
import { useState } from "react";

export default function ReportDetailModal({ report, onClose, onUpdate }: any) {
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

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Report" : "Detail Report"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <textarea
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-32"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <select
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-blue-400 text-xs font-bold uppercase">
              {report.project} • {report.type}
            </p>
            <h3 className="text-2xl font-bold">{report.title}</h3>
            <p className="text-slate-400">
              {report.description || "No description provided."}
            </p>
            <div className="pt-4 text-[10px] text-slate-500">
              <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
              {report.updatedAt && (
                <p>Updated: {new Date(report.updatedAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="flex-1 bg-blue-600 py-3 rounded-xl font-bold"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-white/10 py-3 rounded-xl font-bold hover:bg-white/20"
            >
              Edit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
