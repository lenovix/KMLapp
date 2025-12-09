"use client";
import React from "react";

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
    <div className="relative w-full">
      {/* Icon */}
      {icon && (
        <span
          className={`absolute top-1/2 -translate-y-1/2 text-gray-300 ${
            iconPosition === "left" ? "left-3" : "right-8"
          }`}
        >
          {icon}
        </span>
      )}

      <input
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
          ${icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""}
          text-${textAlign}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      />

      {/* Tombol X */}
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();

            onChange({
              target: { name, value: "" },
            } as React.ChangeEvent<HTMLInputElement>);

            // agar datalist muncul lagi setelah clear
            const inputEl =
              e.currentTarget.parentElement!.querySelector("input");
            setTimeout(() => inputEl?.focus(), 10);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>
      )}

      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </div>
  );
}
