"use client";

interface FilterGroupProps {
  label: string;
  options: string[];
  selectedValues?: string[];
  onToggleValue?: (value: string) => void;
  selectedValue?: string | null;
  onChangeValue?: (value: string | null) => void;
  withAll?: boolean;
  activeColor?: "blue" | "emerald";
}

export default function FilterGroup({
  label,
  options,
  selectedValues = [],
  onToggleValue,
  selectedValue,
  onChangeValue,
  withAll = false,
  activeColor = "blue",
}: FilterGroupProps) {
  const activeStyles = {
    blue: "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]",
    emerald:
      "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_15px_rgba(5,150,105,0.3)]",
  };

  const inactiveClass =
    "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700";

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">
          {label}
        </span>
        <div className="h-[1px] flex-1 bg-zinc-800/50"></div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {withAll && onChangeValue && (
          <button
            onClick={() => onChangeValue(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 active:scale-95
              ${selectedValue === null ? activeStyles[activeColor] : inactiveClass}`}
          >
            All
          </button>
        )}

        {options.map((opt) => {
          const isMulti = !!onToggleValue;
          const active = isMulti
            ? selectedValues.includes(opt)
            : selectedValue === opt;

          return (
            <button
              key={opt}
              onClick={() =>
                isMulti ? onToggleValue?.(opt) : onChangeValue?.(opt)
              }
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 active:scale-95
                ${active ? activeStyles[activeColor] : inactiveClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
