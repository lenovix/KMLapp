import Link from "next/link";

interface CardWebHomeProps {
  logo?: string;
  name: string;
  version?: string;
  link: string;
}

export default function CardWebHome({ logo, name, version, link }: CardWebHomeProps) {
  return (
    <Link
      href={link}
      className="group w-full max-w-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center text-center
             shadow-sm hover:shadow-lg hover:border-blue-500 transition-shadow duration-300"
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

      {/* Version */}
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
        {version}
      </h3>
    </Link>
  );
}
