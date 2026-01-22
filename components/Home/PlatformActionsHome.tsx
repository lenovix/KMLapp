"use client";

import { useState } from "react";
import { TrashIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
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
      if (action === "Delete Comic")
        return "/api/komify/settings/delete-comics";
      if (action === "Delete Tmp_Folder" || action === "Delete Comic Cache")
        return "/api/komify/settings/clear-cache";
    }
    return null;
  };

  const executeAction = async () => {
    if (!confirmAction) return;
    const endpoint = resolveEndpoint(confirmAction);

    if (!endpoint) {
      setAlert({
        type: "error",
        title: "Action not available",
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
        title: "Processing...",
        message: confirmAction,
      });

      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Action failed");

      setAlert({
        type: "success",
        title: "Success",
        message: data.message || confirmAction,
      });
    } catch (err: any) {
      setAlert({
        type: "error",
        title: "System Error",
        message: err.message || "Request failed",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full mb-4 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center px-5 py-4 rounded-2xl transition-all duration-300 border ${
          open
            ? "bg-white/10 border-white/20 shadow-lg"
            : "bg-white/3 border-white/5 hover:bg-white/5"
        }`}
      >
        <span className="text-sm font-bold tracking-tight text-white uppercase">
          {platform}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
            open ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden space-y-2 px-1">
          {actions.map((action) => (
            <div
              key={action}
              className="group flex items-center justify-between pl-5 pr-2 py-2.5 bg-white/2 border border-white/5 rounded-xl hover:border-red-500/30 hover:bg-red-500/2 transition-all"
            >
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                {action}
              </span>

              <button
                onClick={() => setConfirmAction(action)}
                disabled={loadingAction === action}
                className="relative w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-30"
              >
                {loadingAction === action ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <DialogBox
        open={!!confirmAction}
        type="danger"
        title="Critical Action"
        desc={`Are you sure you want to perform "${confirmAction}" on ${platform}? This process is irreversible.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={executeAction}
        onCancel={() => setConfirmAction(null)}
      />

      {alert && (
        <div className="fixed bottom-6 right-6 z-100 animate-in slide-in-from-right-10">
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
    </div>
  );
}
