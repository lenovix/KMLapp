"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Alert from "@/components/UI/Alert";
import LoginModal from "./Auth/LoginModal";
import RegisterModal from "./Auth/RegisterModal";

interface User {
  id: number;
  username: string;
  email: string;
}

export default function HeaderHome() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    setShowAlert(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-black tracking-tighter text-white">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            K<span className="text-blue-500">.</span>PLATFORMS
          </Link>
        </div>

        {!user && (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowLogin(true)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="px-5 py-2 text-sm bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all active:scale-95"
            >
              Register
            </button>
          </div>
        )}

        {user && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white">
                {user.username}
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-[#121212] border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-white/5 bg-white/2">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>

                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                  onClick={handleLogout}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="h-18" />

      {showAlert && (
        <div className="fixed top-20 right-6 z-60">
          <Alert
            type="success"
            title="Logged out successfully"
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
          }}
        />
      )}

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
