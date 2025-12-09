"use client";
import React, { useRef } from "react";

interface DropdownInputProps {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  listId: string;

  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "filled";
  disabled?: boolean;
  required?: boolean;
  className?: string;
  textAlign?: "left" | "center" | "right";
  autoComplete?: "on" | "off";

  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function DropdownInput({
  name,
  value,
  placeholder,
  onChange,
  options,
  listId,

  size = "md",
  variant = "default",
  disabled = false,
  required = false,
  className = "",
  textAlign = "left",
  autoComplete = "off",
  icon,
  iconPosition = "left",
}: DropdownInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "bg-white/20 border border-gray-300",
    outline: "border border-blue-500 bg-transparent",
    filled: "bg-gray-700 border border-gray-600",
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Input */}
      <input
        ref={inputRef}
        name={name}
        list={listId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          w-full rounded text-white placeholder-gray-300 focus:outline-none
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          pr-16
          ${icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""}
          text-${textAlign}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      />

      {/* ICON kiri */}
      {icon && iconPosition === "left" && (
        <span className="absolute left-3 text-gray-300 pointer-events-none">
          {icon}
        </span>
      )}

      {/* Tombol clear (hapus) */}
      {value && (
        <button
          type="button"
          onClick={() => {
            const fakeEvent = {
              target: { name, value: "" },
            } as any;
            onChange(fakeEvent);
          }}
          className="absolute right-10 text-gray-300 hover:text-white"
        >
          ✕
        </button>
      )}

      {/* Tombol buka list */}
      <button
        type="button"
        onClick={() => {
          inputRef.current?.focus();
          inputRef.current?.setAttribute("list", listId);
        }}
        className="absolute right-3 text-gray-300 hover:text-white"
      >
        ▼
      </button>

      {/* datalist */}
      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </div>
  );
}
