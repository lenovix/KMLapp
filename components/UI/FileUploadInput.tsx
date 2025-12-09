"use client";

import React, { useState } from "react";

interface FileUploadInputProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  onChange: (files: FileList | null) => void;
  className?: string;
  fullWidth?: boolean;

  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "filled";
  disabled?: boolean;
  required?: boolean;

  icon?: React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

export default function FileUploadInput({
  label = "",
  multiple = false,
  accept = "*/*",
  onChange,
  className = "",
  fullWidth = true,

  size = "md",
  variant = "default",
  disabled = false,
  required = false,

  icon,
  textAlign = "left",
}: FileUploadInputProps) {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "bg-white/20 border border-gray-400",
    filled: "bg-gray-700 border border-gray-700",
    outline: "bg-transparent border border-blue-500",
  };

  const handleChange = (files: FileList | null) => {
    onChange(files);
    setFileNames(files ? Array.from(files).map((f) => f.name) : []);
  };

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""}`}>
      {label && <label className="text-sm text-gray-300">{label}</label>}

      <div className="relative">
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          required={required}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.files)}
          className={`
            w-full rounded text-white cursor-pointer
            file:bg-blue-600 file:text-white file:px-3 file:py-1 file:rounded file:border-0 file:mr-3
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            text-${textAlign}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
        />

        {/* ICON DI KIRI */}
        {icon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none">
            {icon}
          </span>
        )}
      </div>

      {/* Menampilkan nama file */}
      {/* {fileNames.length > 0 && (
        <div className="flex justify-between items-center mt-1 bg-white/10 p-2 rounded">
          <p className="text-xs text-gray-200 truncate">
            {fileNames.length === 1
              ? fileNames[0]
              : `${fileNames.length} files selected`}
          </p>
          <button
            type="button"
            className="text-red-400 text-sm hover:text-red-300"
            onClick={() => {
              handleChange(null);
            }}
          >
            Clear
          </button>
        </div>
      )} */}
    </div>
  );
}
