"use client";

import { useState } from "react";
import Link from "next/link";
import Alert from "@/components/UI/Alert";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export default function HeaderHome({
  isLoggedIn = true,
  username = "Ichsanul Kamil Sudarmi",
}: HeaderProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // Lakukan logic logout di sini
    // ...

    // Tampilkan alert
    setShowAlert(true);
  };
  return (
    <>
      <header className="w-full shadow-md px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <Link href="/">KMLapp</Link>
        </div>
        {/* Logged Out */}
        {!isLoggedIn && (
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}

        {/* Logged In */}
        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <span className="text-gray-900 dark:text-white font-medium">
                {username}
              </span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Profile
                </Link>

                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>
      {showAlert && (
        <Alert
          type="success"
          message="Logout berhasil"
          duration={3000}
        />
      )}
    </>
  );
}
