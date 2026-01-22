"use client";

import { useState, useEffect } from "react";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      onClose();
      location.reload();
    } catch (err) {
      setError("Connection error. Try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#121212] border border-white/10 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">
            Please enter your details to sign in
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Username
            </label>
            <input
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-400 text-xs py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-8">
            <button
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-slate-200 active:scale-[0.98] transition-all"
              onClick={handleLogin}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
