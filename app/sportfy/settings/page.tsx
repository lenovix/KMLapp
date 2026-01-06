"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Workout {
  id: number;
  tool: string;
  reps: string;
}

export default function SportfySettingsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, tool: "Dumbbell", reps: "3 x 12" },
    { id: 2, tool: "Treadmill", reps: "15 menit" },
  ]);

  const [tool, setTool] = useState("");
  const [reps, setReps] = useState("");

  const addWorkout = () => {
    if (!tool || !reps) return;

    setWorkouts((prev) => [...prev, { id: Date.now(), tool, reps }]);

    setTool("");
    setReps("");
  };

  const removeWorkout = (id: number) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen  text-zinc-100">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4  border-b border-white">
        <Link
          href="/sportfy"
          className="p-2 rounded-full hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>

      {/* Content */}
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Add Workout */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Tambah Workout</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              placeholder="Nama alat"
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Reps / Durasi"
              className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={addWorkout}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>
        </section>

        {/* Workout List */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Workout List</h2>

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
                  onClick={() => removeWorkout(w.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
