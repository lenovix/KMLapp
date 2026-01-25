"use client";
import { useEffect, useState } from "react";
import HeaderHome from "@/components/Home/headerHome";
import AddReportModal from "@/components/report/AddReportModal";
import ReportDetailModal from "@/components/report/ReportDetailModal";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("OPEN");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const projects = ["K.Platforms", "Komify", "Filmfy", "Animefy", "Peoplefy"];
  const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"];

  const filtered = reports.filter((r: any) => {
    const typeMatch = filterType === "all" || r.type === filterType;
    const projectMatch = filterProject === "all" || r.project === filterProject;
    const statusMatch = filterStatus === "ALL" || r.status === filterStatus;

    return typeMatch && projectMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-10 px-6 pb-20">
      <HeaderHome />
      <div className="max-w-5xl mx-auto space-y-8 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black">Support Center</h1>
            <p className="text-slate-400">
              Total {reports.length} laporan masuk.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
          >
            + New Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
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
                      ? "bg-white text-black"
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
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none"
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
              className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 outline-none"
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
            filtered.map((r: any) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className="bg-[#121212] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:border-blue-500/50 cursor-pointer transition-all group animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
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
