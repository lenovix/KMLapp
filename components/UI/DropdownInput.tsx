"use client";
import React from "react";

interface DropdownInputProps {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
  listId: string;
}

export default function DropdownInput({
  name,
  value,
  placeholder,
  onChange,
  options,
  listId,
}: DropdownInputProps) {
  return (
    <div className="relative">
      <input
        name={name}
        list={listId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border p-2 rounded w-full bg-white/20 text-white placeholder-gray-300"
      />

      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </div>
  );
}
