"use client";

import { X } from "lucide-react";

interface InputTextProps {
  name: string;
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  onClear?: () => void;
  disabled?: boolean;
}

export default function InputText({
  name,
  placeholder,
  value,
  onChange,
  className = "",
  onClear,
  disabled,
}: InputTextProps) {
  const clearValue = () => {
    if (disabled) return;

    if (onClear) {
      onClear();
      return;
    }

    const event = {
      target: { name, value: "" },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(event);
  };

  return (
    <div
      className={`relative w-full ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        className={`border p-2 pr-8 rounded bg-white/20 text-white placeholder-gray-300 w-full transition-all focus:outline-none ${
          disabled
            ? "border-zinc-800 pointer-events-none select-none"
            : "focus:border-blue-500"
        } ${className}`}
      />

      {value && !disabled && (
        <button
          type="button"
          onClick={clearValue}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
          aria-label={`Clear ${name}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
