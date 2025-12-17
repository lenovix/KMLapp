"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import Alert from "@/components/UI/Alert";
import DialogBox from "@/components/UI/DialogBox";

interface PlatformActionsProps {
  platform: string;
  actions: string[];
}

type AlertState = {
  type: "success" | "error" | "onprogress";
  title: string;
  message?: string;
};

export default function PlatformActions({
  platform,
  actions,
}: PlatformActionsProps) {
  const [open, setOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const resolveEndpoint = (action: string) => {
    if (platform === "Komify") {
      if (action === "Delete Comic") {
        return "/api/komify/settings/delete-comics";
      }

      if (action === "Delete Tmp_Folder" || action === "Delete Comic Cache") {
        return "/api/komify/settings/clear-cache";
      }
    }
    return null;
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    const endpoint = resolveEndpoint(confirmAction);
    if (!endpoint) {
      setAlert({
        type: "error",
        title: "Action tidak tersedia",
        message: confirmAction,
      });
      setConfirmAction(null);
      return;
    }

    try {
      setLoadingAction(confirmAction);
      setConfirmAction(null);

      setAlert({
        type: "onprogress",
        title: "Memproses...",
        message: confirmAction,
      });

      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Gagal menjalankan aksi");
      }

      setAlert({
        type: "success",
        title: "Berhasil",
        message: data.message || confirmAction,
      });
    } catch (err: any) {
      console.error(err);
      setAlert({
        type: "error",
        title: "Terjadi Kesalahan",
        message: err.message || "Request gagal",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header / Dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3
        bg-gray-100 dark:bg-gray-700 rounded-lg
        hover:bg-gray-200 dark:hover:bg-gray-600
        transition-colors font-medium text-gray-900 dark:text-white"
      >
        {platform}
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {/* Actions */}
      {open && (
        <div
          className="mt-2 flex flex-col gap-3 bg-white dark:bg-gray-800
          rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700"
        >
          {actions.map((action) => (
            <div
              key={action}
              className="flex items-center justify-between px-3 py-2"
            >
              <span className="text-gray-900 dark:text-white">{action}</span>

              <button
                onClick={() => setConfirmAction(action)}
                disabled={loadingAction === action}
                className={`w-9 h-9 rounded-md flex items-center justify-center
                ${
                  loadingAction === action
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }
                text-white transition`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
      <DialogBox
        open={!!confirmAction}
        type="danger"
        title="Konfirmasi Aksi"
        desc={`Yakin ingin melakukan "${confirmAction}" pada ${platform}? Aksi ini tidak bisa dibatalkan.`}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
        onConfirm={executeAction}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
