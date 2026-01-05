"use client";

import { useState } from "react";
import PrimaryButton from "@/components/UI/PrimaryButton";
import { useRouter } from "next/navigation";

interface Props {
  report: any;
  onClose: () => void;
}

const STATUS_OPTIONS = ["open", "in_progress", "fixed", "rejected"];

export default function ReportDetailModal({ report, onClose }: Props) {
  const [status, setStatus] = useState(report.status);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function updateStatus() {
    setLoading(true);

    await fetch(`/api/komify/report/${report.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setLoading(false);
    onClose();
    router.refresh();
  }

  async function deleteReport() {
    const confirmDelete = confirm("Yakin ingin menghapus report ini?");
    if (!confirmDelete) return;

    setLoading(true);

    await fetch(`/api/komify/report/${report.id}`, {
      method: "DELETE",
    });

    setLoading(false);
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-zinc-100 w-full max-w-xl rounded-xl p-6 border border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">Detail Report</h2>

        <div className="mb-3">
          <div className="text-sm text-zinc-400">Comic</div>
          <div className="font-medium">
            {report.comicTitle} (ID: {report.comicId})
          </div>
        </div>

        {(report.chapterNumber || report.pageFilename) && (
          <div className="mb-3">
            <div className="text-sm text-zinc-400">Lokasi</div>
            <div>
              {report.chapterNumber && (
                <span>Chapter {report.chapterNumber}</span>
              )}
              {report.pageFilename && <span> • {report.pageFilename}</span>}
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="text-sm text-zinc-400">Jenis Masalah</div>
          <div>{report.type}</div>
        </div>

        <div className="mb-3">
          <div className="text-sm text-zinc-400">Judul</div>
          <div className="font-medium">{report.title}</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-zinc-400">Deskripsi</div>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {report.status !== "deleted" && report.screenshot && (
          <div className="mb-4">
            <div className="text-sm text-zinc-400 mb-1">Screenshot</div>
            <img
              src={report.screenshot}
              alt="Screenshot Report"
              className="max-h-64 rounded border border-zinc-700"
            />
          </div>
        )}

        {report.status !== "deleted" && (
          <div className="mb-5">
            <label className="text-sm text-zinc-400 block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {report.status === "deleted" ? (
          <div className="flex justify-end">
            <PrimaryButton onClick={onClose} variant="primary">
              Close
            </PrimaryButton>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <button
              onClick={deleteReport}
              disabled={loading}
              className="text-red-400 text-sm hover:underline"
            >
              Hapus Report
            </button>

            <div className="flex gap-2">
              <PrimaryButton onClick={onClose} variant="primary">
                Batal
              </PrimaryButton>
              <PrimaryButton onClick={updateStatus} disabled={loading}>
                Simpan
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
