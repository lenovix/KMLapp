"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

interface PlatformActionsProps {
  platform: string;
  actions: string[];
}

export default function PlatformActions({
  platform,
  actions,
}: PlatformActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Header / Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-gray-900 dark:text-white"
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

      {/* Dropdown content */}
      {open && (
        <div className="mt-2 flex flex-col gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700 transition-all">
          {actions.map((action) => (
            <div
              key={action}
              className="flex items-center justify-between px-3 py-2 rounded-md  transition-colors"
            >
              <span className="text-gray-900 dark:text-white">{action}</span>
              <button className="flex items-center justify-center w-9 h-9 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
