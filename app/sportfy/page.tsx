"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, Circle, Settings } from "lucide-react";
import Link from "next/link";

const todayWorkouts = [
  { id: 1, tool: "Dumbbell", reps: "3 x 12", done: false },
  { id: 2, tool: "Treadmill", reps: "15 menit", done: true },
  { id: 3, tool: "Leg Press", reps: "3 x 10", done: false },
];

export default function SportfyHome() {
  const [workouts, setWorkouts] = useState(todayWorkouts);

  const toggleDone = (id: number) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, done: !w.done } : w))
    );
  };

  return (
    <div className="min-h-screen  text-zinc-100">
      <header className="flex items-center justify-between px-6 py-4  border-b border-white">
        <Link href="/" className=" rounded-2xl hover:bg-zinc-500 p-1">
          <ArrowLeft />
        </Link>
        <h1 className="text-xl font-bold tracking-wide">
          Sportfy :: Workout Timeline
        </h1>
        <button className="p-2 rounded-full hover:bg-zinc-500 transition">
          <Link href="/sportfy/settings">
            <Settings className="w-5 h-5 text-zinc-300" />
          </Link>
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <section className="md:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-lg font-semibold mb-4">Workout Today</h2>
          <ul className="space-y-3">
            {workouts.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800"
              >
                <div>
                  <p className="font-medium">{w.tool}</p>
                  <p className="text-sm text-zinc-400">{w.reps}</p>
                </div>
                <button
                  onClick={() => toggleDone(w.id)}
                  className="hover:scale-110 transition"
                >
                  {w.done ? (
                    <CheckCircle className="text-emerald-400" />
                  ) : (
                    <Circle className="text-zinc-600" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <aside className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-lg font-semibold mb-4">Calendar</h2>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 cursor-pointer transition"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
