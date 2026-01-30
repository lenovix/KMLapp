"use client";

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  accent: string;
}

export default function ControlSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  accent,
}: ControlSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
          {label}
        </span>
        <span className="text-sm font-black text-white bg-white/10 px-2 py-0.5 rounded-md tabular-nums">
          {value}
        </span>
      </div>
      <div className="relative flex items-center group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`
            w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer 
            transition-all duration-300 outline-none
            focus:ring-2 focus:ring-white/10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,255,255,0.5)]
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125
            ${accent}
          `}
        />
      </div>
    </div>
  );
}
