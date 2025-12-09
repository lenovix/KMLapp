"use client";

import { X } from "lucide-react";

interface InputTextProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  // optional clear callback jika parent mau handle differently
  onClear?: () => void;
}

export default function InputText({
  name,
  placeholder,
  value,
  onChange,
  className = "",
  onClear,
}: InputTextProps) {
  // helper to trigger onChange with empty value (keeps existing signature)
  const clearValue = () => {
    // jika parent memberikan onClear, panggil itu (lebih fleksibel)
    if (onClear) {
      onClear();
      return;
    }

    // buat synthetic event untuk dipassing ke onChange
    const fakeEvent = {
      target: { name, value: "" },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(fakeEvent);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border p-2 pr-8 rounded bg-white/20 text-white placeholder-gray-300 w-full ${className}`}
      />

      {/* Tombol X untuk hapus */}
      {value && (
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
