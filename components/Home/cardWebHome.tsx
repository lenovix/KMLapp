import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardWebHomeProps {
  logo?: string;
  name: string;
  version?: string;
  link: string;
}

export default function CardWebHome({
  logo,
  name,
  version,
  link,
}: CardWebHomeProps) {
  const isDev = version?.toLowerCase() === "on development";
  const isNotStarted = version?.toLowerCase() === "not started";

  return (
    <Link
      href={link}
      className="group w-full max-w-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover:border-blue-500 transition-shadow duration-300"
    >
      {/* Logo */}
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="w-24 h-24 object-cover mb-4 rounded-full bg-gray-100 dark:bg-gray-700"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 mb-4"></div>
      )}

      {/* Nama Web */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {name}
      </h2>

      {/* Version / Status */}
      {version && (
        <span
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full",
            isDev && "bg-yellow-100 text-yellow-700 border border-yellow-300",
            isNotStarted && "bg-gray-200 text-gray-700 border border-gray-300",
            !isDev && !isNotStarted && "text-gray-500 dark:text-gray-300"
          )}
        >
          {version}
        </span>
      )}
    </Link>
  );
}
