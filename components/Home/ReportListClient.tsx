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
        const res = await fetch("/api/komify/report", {
          cache: "no-store",
        });
        const json = await res.json();

        if (json.success) {
          setReports(json.data);
        }
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
    <>
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-zinc-400">Filter status:</label>

        <select
          className="bg-zinc-900 border border-zinc-700 text-zinc-100
                     rounded px-2 py-1 text-sm"
          value={statusFilter.join(",")}
          onChange={(e) => setStatusFilter(e.target.value.split(","))}
        >
          <option value="open,in_progress">Open & In Progress</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="fixed">Fixed</option>
          <option value="rejected">Rejected</option>
          <option value="deleted">Deleted</option>
          <option value="open,in_progress,fixed,rejected">All</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredReports.length === 0 && (
          <div className="text-sm text-zinc-400">Tidak ada report.</div>
        )}

        {filteredReports.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelectedReport(r)}
            className="border border-zinc-700 bg-zinc-900 rounded-lg p-3
                       cursor-pointer hover:bg-zinc-800 transition"
          >
            <div className="flex justify-between items-start">
              <div className="font-semibold text-zinc-100">
                {r.comicTitle} (ID: {r.comicId})
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  r.status === "open"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : r.status === "in_progress"
                    ? "bg-blue-500/20 text-blue-400"
                    : r.status === "fixed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {r.status}
              </span>
            </div>

            {r.chapterNumber && (
              <div className="text-sm text-zinc-400">
                Chapter {r.chapterNumber}
                {r.pageFilename && ` • ${r.pageFilename}`}
              </div>
            )}

            <div className="text-sm mt-1 text-zinc-300">{r.title}</div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </>
  );
}
