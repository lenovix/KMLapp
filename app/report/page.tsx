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
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  updatedAt?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("OPEN");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    };

    loadReports();
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
  const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"];

  const filtered = reports.filter((r: Report) => {
    const typeMatch = filterType === "all" || r.type === filterType;
    const projectMatch = filterProject === "all" || r.project === filterProject;
    const statusMatch = filterStatus === "ALL" || r.status === filterStatus;

    return typeMatch && projectMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span className="text-sm font-bold tracking-tighter uppercase">
              Back to App
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              System Live
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto space-y-8 mt-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black">Support Center</h1>
            <p className="text-slate-400">
              Total {reports.length} laporan masuk dari komunitas Genfy.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
          >
            + New Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">
              Filter Type
            </label>
            <div className="flex gap-2">
              {["all", "bug", "feature"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                    filterType === t
                      ? "bg-white text-black shadow-lg"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">
              Filter Project
            </label>
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer appearance-none"
            >
              <option value="all" className="bg-[#121212]">
                All Projects
              </option>
              {projects.map((p) => (
                <option key={p} value={p} className="bg-[#121212]">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase tracking-tighter">
              Filter Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer appearance-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-[#121212]">
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.length > 0 ? (
            filtered.map((r: Report) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:border-blue-500/50 cursor-pointer transition-all group animate-in fade-in slide-in-from-bottom-2 shadow-sm hover:shadow-blue-500/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${
                      r.type === "bug" ? "bg-red-500/10" : "bg-blue-500/10"
                    }`}
                  >
                    {r.type === "bug" ? "🐛" : "✨"}
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-blue-400 transition-colors">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest">
                        {r.project}
                      </p>
                      <span className="text-slate-700">•</span>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {r.updatedAt
                          ? `Updated ${new Date(r.updatedAt).toLocaleDateString()}`
                          : `Created ${new Date(r.createdAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black border transition-colors ${
                    r.status === "RESOLVED"
                      ? "border-green-500 text-green-500 bg-green-500/5"
                      : r.status === "IN_PROGRESS"
                        ? "border-yellow-500 text-yellow-500 bg-yellow-500/5"
                        : "border-blue-500 text-blue-500 bg-blue-500/5"
                  }`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white/2 rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500">
                No {filterStatus.toLowerCase()} reports found.
              </p>
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
