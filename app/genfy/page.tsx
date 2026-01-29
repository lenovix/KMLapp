"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Loader2,
  Sliders,
  Cpu,
  Activity,
} from "lucide-react";

export default function GenfyPage() {
  const [modelList, setModelList] = useState<string[]>([]); // State daftar model
  const [modelName, setModelName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    image_base64: string;
    seed: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ ram_gb: 0, vram: 0, cpu: 0 });

  const [steps, setSteps] = useState(25);
  const [cfg, setCfg] = useState(7.0);
  const [seed, setSeed] = useState(-1);

  // Poll Stats & Load Models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch("http://localhost:8000/models");
        const data = await res.json();
        setModelList(data);
        if (data.length > 0) setModelName(data[0]);
      } catch (e) {
        setError("Backend disconnected.");
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/stats");
        const data = await res.json();
        setStats(data);
      } catch (e) {}
    };

    fetchModels();
    const interval = setInterval(fetchStats, 3000); // Update stats tiap 3 detik
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !modelName) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model_name: modelName,
          steps,
          cfg,
          seed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Gagal generate gambar.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.image_base64;
    link.download = `genfy-${result.seed}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      {/* Mini Stats Bar */}
      <div className="max-w-6xl mx-auto flex justify-end gap-4 mb-4 text-[10px] font-mono uppercase text-slate-500">
        <span className="flex items-center gap-1">
          <Activity size={10} /> CPU: {stats.cpu}%
        </span>
        <span className="flex items-center gap-1">
          <Cpu size={10} /> App RAM: {stats.ram_gb} GB
        </span>
        <span className="flex items-center gap-1 text-indigo-400">
          <Cpu size={10} /> VRAM: {stats.vram} GB
        </span>
      </div>
      <header className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          GENFY{" "}
          <span className="text-sm font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">
            PRO
          </span>
        </h1>
        <p className="text-slate-400 font-medium tracking-wide">
          Single File Checkpoint Studio
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-2xl">
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Model Selection DYNAMIC */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-300">
                  <Cpu size={16} className="text-indigo-400" /> Choose
                  Checkpoint (.safetensors)
                </label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer appearance-none"
                >
                  {modelList.length === 0 ? (
                    <option>No models found in folder...</option>
                  ) : (
                    modelList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-slate-300">
                  <Sparkles size={16} className="text-purple-400" /> Deskripsi
                  Gambar (Prompt)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cinematic shot of a cybernetic forest..."
                  className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none placeholder:text-slate-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      Inference Steps:{" "}
                      <span className="text-purple-400">{steps}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      CFG Scale: <span className="text-pink-400">{cfg}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={cfg}
                    onChange={(e) => setCfg(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt || modelList.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-900/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sliders size={18} />
                )}
                {loading ? "Loading Model & Drawing..." : "Generate Magic"}
              </button>
            </form>
          </div>
        </aside>

        {/* RIGHT SECTION (Sama seperti sebelumnya) */}
        <section className="lg:col-span-7 bg-slate-900/30 border border-slate-800 rounded-3xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
          {/* ... (Copy bagian Result Display & Loading Overlay dari page.tsx sebelumnya) ... */}
          {result ? (
            <div className="w-full p-4">
              <img
                src={result.image_base64}
                alt="AI Result"
                className="w-full rounded-2xl shadow-2xl border border-slate-700"
              />
              <div className="mt-4 flex items-center justify-between px-2">
                <p className="text-xs text-slate-400 italic">
                  Seed: {result.seed} • Model: {modelName}
                </p>
                <button
                  onClick={downloadImage}
                  className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center group p-10">
              <ImageIcon className="text-slate-600 mx-auto mb-6" size={48} />
              <h3 className="text-slate-400 font-medium text-lg italic">
                The canvas is empty...
              </h3>
            </div>
          )}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-purple-400 font-bold text-xl animate-pulse">
                  AI is Creating
                </p>
                <p className="text-slate-500 text-xs mt-3 italic">
                  Menyiapkan checkpoint file bergiga-giga...
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
      {/* ... Error Toast ... */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-950 border border-red-500 p-4 rounded-2xl text-white text-sm animate-in slide-in-from-right">
          {error}
        </div>
      )}
    </div>
  );
}
