import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardWebHomeProps {
  logo?: string;
  name: string;
  status?: "release" | "development" | "not-started";
  version?: string;
  link: string;
}

export default function CardWebHome({
  logo,
  name,
  status,
  version,
  link,
}: CardWebHomeProps) {
  const badgeText =
    status === "release" && version
      ? `v${version}`
      : status === "development"
      ? "On Development"
      : status === "not-started"
      ? "Not Started"
      : null;

  const badgeStyle =
    status === "release"
      ? "bg-green-100 text-green-700 border-green-300"
      : status === "development"
      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
      : status === "not-started"
      ? "bg-gray-200 text-gray-700 border-gray-300"
      : "";

  return (
    <Link
      href={link}
      className="group w-full max-w-xs bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-xl p-6 flex flex-col items-center text-center
        shadow-sm hover:shadow-lg hover:border-blue-500 transition"
    >
      {/* Logo */}
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="w-24 h-24 object-cover mb-4 rounded-full
            bg-gray-100 dark:bg-gray-700"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 mb-4" />
      )}

      {/* Name */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {name}
      </h2>

      {/* Status Badge */}
      {badgeText && (
        <span
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full border",
            badgeStyle
          )}
        >{badgeText}
        </span>
      )}
    </Link>
  );
}
