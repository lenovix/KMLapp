"use client";

import { useEffect, useMemo, useState } from "react";
import ReportDetailModal from "@/components/Home/ReportDetailModal";

interface Props {
  reports: any[];
}

export default function ReportListClient({ reports: initialReports }: Props) {
  const [reports, setReports] = useState<any[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "open",
    "in_progress",
  ]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/komify/report", { cache: "no-store" });
        const json = await res.json();
        if (json.success) setReports(json.data);
      } catch (err) {
        console.error("Gagal fetch report", err);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  function getReportTime(r: any) {
    return new Date(r.updatedAt || r.createdAt || 0).getTime();
  }

  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => statusFilter.includes(r.status))
      .sort((a, b) => getReportTime(b) - getReportTime(a));
  }, [reports, statusFilter]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white/2 border border-white/5 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Live Reports
          </span>
        </div>

        <div className="relative group w-full sm:w-auto">
          <select
            className="w-full sm:w-auto appearance-none bg-[#0a0a0a] border border-white/10 text-slate-200 text-xs font-medium rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
            value={statusFilter.join(",")}
            onChange={(e) => setStatusFilter(e.target.value.split(","))}
          >
            <option value="open,in_progress">Open & In Progress</option>
            <option value="open">Open Only</option>
            <option value="in_progress">In Progress Only</option>
            <option value="fixed">Fixed</option>
            <option value="rejected">Rejected</option>
            <option value="open,in_progress,fixed,rejected">
              Show All Reports
            </option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
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

      <div className="space-y-4 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white/1 border border-dashed border-white/10 rounded-3xl">
            <p className="text-slate-500 text-sm italic">
              No reports found in this category.
            </p>
          </div>
        ) : (
          filteredReports.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className="group relative border border-white/5 bg-[#161616]/40 rounded-2xl p-5 cursor-pointer hover:bg-white/5 hover:border-white/10 hover:-translate-x-1 transition-all duration-300 shadow-lg"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {r.comicTitle}
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter">
                      #{r.comicId}
                    </span>
                  </div>

                  {r.chapterNumber && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-slate-400">
                        CH {r.chapterNumber}
                      </span>
                      {r.pageFilename && (
                        <span className="truncate max-w-37.5">
                          • {r.pageFilename}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${
                    r.status === "open"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : r.status === "in_progress"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : r.status === "fixed"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}
                >
                  {r.status.replace("_", " ")}
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-300 leading-relaxed line-clamp-2 italic border-l-2 border-white/10 pl-4 group-hover:border-blue-500/50 transition-colors">
                "{r.title}"
              </div>
            </div>
          ))
        )}
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
