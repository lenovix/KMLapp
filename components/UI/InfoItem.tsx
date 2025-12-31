import React from "react";
import clsx from "clsx";

interface InfoItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function InfoItem({
  label,
  children,
  className,
}: InfoItemProps) {
  return (
    <div className={clsx("space-y-1", className)}>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
        {children || "-"}
      </div>
    </div>
  );
}
