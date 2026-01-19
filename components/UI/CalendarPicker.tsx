"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
}

export default function CalendarPicker({
  value,
  onChange,
  label,
}: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewDate(d);
      }
    } else {
      setViewDate(new Date());
    }
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      const targetDate = value ? new Date(value) : new Date();

      if (!isNaN(targetDate.getTime())) {
        setViewDate(targetDate);
      }
    }
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr = [];
    for (let i = currentYear; i >= 1970; i--) arr.push(i);
    return arr;
  }, []);

  const months = [
    "[1] January",
    "[2] February",
    "[3] March",
    "[4] April",
    "[5] May",
    "[6] June",
    "[7] July",
    "[8] August",
    "[9] September",
    "[10] October",
    "[11] November",
    "[12] December",
  ];

  const calendarDays = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) {
      days.push(new Date(y, m, i, 12, 0, 0));
    }
    return days;
  }, [viewDate]);

  const handleSelect = (d: Date) => {
    const formatted = d.toISOString().split("T")[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition-all group"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <span
            className={`text-sm ${value ? "dark:text-gray-200" : "text-gray-400"}`}
          >
            {value || "Select Date"}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-80 animate-in fade-in zoom-in duration-150">
          <div className="flex gap-2 mb-4">
            <select
              value={viewDate.getFullYear()}
              onChange={(e) =>
                setViewDate(
                  new Date(parseInt(e.target.value), viewDate.getMonth(), 1),
                )
              }
              className="w-24 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-xs font-bold p-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={viewDate.getMonth()}
              onChange={(e) =>
                setViewDate(
                  new Date(viewDate.getFullYear(), parseInt(e.target.value), 1),
                )
              }
              className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-xs font-bold p-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {months.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 mb-2 text-center border-b dark:border-gray-700 pb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span
                key={d}
                className="text-[10px] font-black text-gray-400 uppercase"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              if (!date) return <div key={i} />;
              const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              const isSelected = value === dateString;
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(date)}
                  className={`h-8 text-xs rounded-lg transition-all flex items-center justify-center
                    ${isSelected ? "bg-blue-600 text-white font-bold" : "hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-gray-300"}
                    ${isToday && !isSelected ? "border border-blue-500 text-blue-500" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
