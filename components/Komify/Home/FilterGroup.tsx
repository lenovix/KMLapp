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
  const activeClass =
    activeColor === "emerald"
      ? "bg-emerald-600 text-white border-emerald-600"
      : "bg-blue-600 text-white border-blue-600";

  const inactiveClass = "border-slate-600 text-slate-300 hover:bg-slate-700";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-400 mr-2">{label}:</span>

      {withAll && onChangeValue && (
        <button
          onClick={() => onChangeValue(null)}
          className={`px-3 py-1 rounded-lg text-sm border transition
            ${selectedValue === null ? activeClass : inactiveClass}`}
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
            className={`px-3 py-1 rounded-lg text-sm border transition
              ${active ? activeClass : inactiveClass}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
