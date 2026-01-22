import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardWebHomeProps {
  logo?: string;
  name: string;
  status?: "release" | "development" | "not-started";
  version?: string;
  link: string;
  startDate?: string;
  endDate?: string;
}

function calculateDuration(start: string, end: string) {
  const finalEnd = end === "Present" ? new Date().toISOString() : end;
  const startDate = new Date(start);
  const endDate = new Date(finalEnd);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0
    ).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (days > 0) parts.push(`${days}d`);

  return parts.join(" ");
}

export default function CardWebHome({
  logo,
  name,
  status,
  version,
  link,
  startDate,
  endDate,
}: CardWebHomeProps) {
  const isRelease = status === "release";
  const isDev = status === "development";

  const badgeText =
    isRelease && version ? `v${version}` : isDev ? "In Progress" : "Upcoming";

  const duration = startDate
    ? calculateDuration(startDate, endDate ?? "Present")
    : null;

  return (
    <Link
      href={link}
      className="group relative w-full bg-[#111111]/50 backdrop-blur-xl border border-white/5 
                 rounded-2xl p-8 flex flex-col items-center text-center
                 transition-all duration-500 hover:border-blue-500/50 hover:bg-[#161616]
                 hover:-translate-y-2 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
    >
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="relative w-24 h-24 object-cover rounded-2xl border border-white/10 
                       bg-black/20 group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-2xl font-black text-white/20">{name[0]}</span>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
        {name}
      </h2>

      <div className="flex items-center gap-2 mt-3">
        <span
          className={cn(
            "px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold rounded-full border",
            isRelease
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
          )}
        >
          {badgeText}
        </span>
      </div>

      {startDate && (
        <div className="mt-6 pt-6 border-t border-white/5 w-full">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
            Development Period
          </p>
          <p className="text-xs text-slate-300 font-medium">
            {startDate} —{" "}
            <span className={endDate === "Present" ? "text-blue-400" : ""}>
              {endDate}
            </span>
          </p>
          {duration && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400">
              Time: {duration}
            </span>
          )}
        </div>
      )}

      <div className="mt-6 text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </Link>
  );
}
