"use client";
import { useEffect, useState } from "react";
import AddReportModal from "@/components/report/AddReportModal";
import ReportDetailModal from "@/components/report/ReportDetailModal";
import Link from "next/link";

interface Report {
  id: string;
  type: "bug" | "feature";
  project: string;
  title: string;
  description: string;
  urgent: "High" | "Medium" | "Low";
  status: "OPEN" | "RESOLVED" | "CANCEL";
  createdAt: string;
  updatedAt?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("OPEN");
  const [filterUrgent, setFilterUrgent] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data);
  };

  const projects = [
    "K.Platforms",
    "Komify",
    "Filmfy",
    "Genfy",
    "Animefy",
    "Peoplefy",
  ];
  const statuses = ["ALL", "OPEN", "RESOLVED", "CANCEL"];

  const filtered = reports.filter((r: Report) => {
    const typeMatch = filterType === "all" || r.type === filterType;
    const projectMatch = filterProject === "all" || r.project === filterProject;
    const statusMatch = filterStatus === "ALL" || r.status === filterStatus;
    const urgentMatch = filterUrgent === "all" || r.urgent === filterUrgent;

    return typeMatch && projectMatch && statusMatch && urgentMatch;
  });

  return (
    <div className="min-h-screen text-white pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-bold tracking-tighter uppercase">Back to App</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Live</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto space-y-8 mt-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black">Support Center</h1>
            <p className="text-slate-400">Total {reports.length} laporan masuk dari komunitas.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            + New Report
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer appearance-none text-white"
            >
              <option value="all" className="bg-[#121212]">All Types</option>
              <option value="bug" className="bg-[#121212]">Bug</option>
              <option value="feature" className="bg-[#121212]">Feature</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">Project</label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer appearance-none text-white"
            >
              <option value="all" className="bg-[#121212]">All Projects</option>
              {projects.map((p) => (
                <option key={p} value={p} className="bg-[#121212]">{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer appearance-none text-white"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#121212]">{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">Urgency</label>
            <select
              value={filterUrgent}
              onChange={(e) => setFilterUrgent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer appearance-none text-white"
            >
              <option value="all" className="bg-[#121212]">All Priority</option>
              <option value="High" className="bg-[#121212]">High</option>
              <option value="Medium" className="bg-[#121212]">Medium</option>
              <option value="Low" className="bg-[#121212]">Low</option>
            </select>
          </div>

        </div>

        <div className="grid gap-3">
          {filtered.length > 0 ? (
            filtered.map((r: Report) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:border-blue-500/50 cursor-pointer transition-all group animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${r.type === "bug" ? "bg-red-500/10" : "bg-blue-500/10"
                    }`}>
                    {r.type === "bug" ? "🐛" : "✨"}
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-blue-400 transition-colors">{r.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest">{r.project}</p>
                      <span className="text-slate-700">•</span>
                      <p className="text-[10px] text-slate-500">
                        {r.updatedAt
                          ? `Updated ${new Date(r.updatedAt).toLocaleDateString()}`
                          : `Created ${new Date(r.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter flex items-center gap-1 ${r.urgent === "High"
                    ? "bg-red-500/20 text-red-500 border border-red-500/20"
                    : r.urgent === "Medium"
                      ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/20"
                      : "bg-slate-500/20 text-slate-400 border border-white/5"
                    }`}>
                    {r.urgent}
                  </span>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border transition-colors ${r.status === "RESOLVED"
                    ? "border-emerald-500 text-emerald-500 bg-emerald-500/5"
                    : r.status === "CANCEL"
                      ? "border-slate-500 text-slate-500 bg-slate-500/5"
                      : "border-red-500 text-red-500 bg-red-500/5"
                    }`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white/2 rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500">No reports found.</p>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddReportModal
          onClose={() => setShowAdd(false)}
          onSuccess={fetchReports}
        />
      )}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdate={fetchReports}
        />
      )}
    </div>
  );
}