"use client";

import React, { useRef } from "react";

interface FileUploadInputProps {
  label?: string;
  multiple?: boolean;
  accept?: string;
  onChange: (files: FileList | null) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "filled";
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  text?: string;
  countFile: string | number | React.ReactNode;
}

export default function FileUploadInput({
  label,
  multiple = false,
  accept = "*/*",
  onChange,
  size = "md",
  variant = "default",
  disabled = false,
  required = false,
  icon,
  text = "Upload File ",
  countFile,
}: FileUploadInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline:
      "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    filled: "bg-gray-700 hover:bg-gray-800 text-white",
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-gray-300">{label}</label>}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`
          flex items-center gap-2 rounded justify-center
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {icon}
        {text}({countFile} file{Number(countFile) !== 1 ? "s" : ""})
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        required={required}
        onChange={(e) => onChange(e.target.files)}
      />
    </div>
  );
}
