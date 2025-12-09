"use client";

interface InputTextProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function InputText({
  name,
  placeholder,
  value,
  onChange,
  className = "",
}: InputTextProps) {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border p-2 rounded bg-white/20 text-white placeholder-gray-300 w-full ${className}`}
    />
  );
}
