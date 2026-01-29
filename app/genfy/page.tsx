"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Loader2,
  Cpu,
  Zap,
  ChevronDown,
  Hash,
} from "lucide-react";

export default function GenfyPage() {
  const [modelList, setModelList] = useState<string[]>([]);
  const [modelName, setModelName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    image_base64: string;
    seed: number;
  } | null>(null);
  const [error, setError] = useState("");

  const [steps, setSteps] = useState(25);
  const [cfg, setCfg] = useState(7.0);
  const [seed, setSeed] = useState(-1);

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
    fetchModels();
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
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] pointer-events-none -z-10" />

      <nav className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white italic">
              GENFY<span className="text-indigo-500">.</span>
            </h1>
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Enterprise
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Next-Gen Image Synthesis Studio
          </p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 xl:col-span-4 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] shadow-2xl backdrop-blur-2xl relative overflow-hidden group">
            <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
              {/* Engine Checkpoint */}
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 flex items-center gap-2 px-1">
                  Engine Checkpoint
                </label>
                <div className="relative">
                  <select
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer appearance-none"
                  >
                    {modelList.map((m) => (
                      <option key={m} value={m} className="bg-slate-900">
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Visual Description */}
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 flex items-center gap-2 px-1">
                  Visual Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Cyberpunk samurai in a rain-slicked neon street..."
                  className="w-full h-40 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none placeholder:text-slate-700 text-sm leading-relaxed"
                />
              </div>

              {/* Control Sliders & Seed */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                <ControlSlider
                  label="Precision Steps"
                  value={steps}
                  min={1}
                  max={50}
                  onChange={setSteps}
                  accent="bg-indigo-500"
                />
                <ControlSlider
                  label="Guidance Scale"
                  value={cfg}
                  min={1}
                  max={15}
                  step={0.5}
                  onChange={setCfg}
                  accent="bg-purple-500"
                />

                {/* Seed Implementation */}
                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 flex items-center gap-2 px-1">
                    Identity Seed
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl px-12 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                    <Hash
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                      size={16}
                    />
                    <button
                      type="button"
                      onClick={() => setSeed(-1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"
                    >
                      RANDOM
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-600 px-1 italic">
                    Use -1 for a random result every time.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt}
                className="w-full relative group overflow-hidden bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Sparkles size={18} />
                )}
                {loading
                  ? "INITIALIZING NEURAL NETWORK..."
                  : "GENERATE ARTWORK"}
              </button>
            </form>
          </div>
        </aside>

        {/* Right Result Panel */}
        <section className="lg:col-span-8 xl:col-span-8 space-y-4">
          <div className="relative aspect-square md:aspect-video lg:aspect-auto lg:h-[800px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center overflow-hidden group shadow-inner">
            {result ? (
              <div className="relative w-full h-full p-6 animate-in fade-in zoom-in duration-700">
                <img
                  src={result.image_base64}
                  alt="AI Result"
                  className="w-full h-full object-contain rounded-[1.5rem] shadow-2xl"
                />
                <div className="absolute bottom-10 right-10 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={() => {
                      setSeed(result.seed);
                      alert("Seed copied to control panel!");
                    }}
                    className="p-4 bg-slate-900/80 backdrop-blur-md text-white border border-white/10 rounded-2xl hover:bg-slate-800 transition-colors shadow-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                  >
                    Reuse Seed: {result.seed}
                  </button>
                  <button
                    onClick={downloadImage}
                    className="p-4 bg-white text-black rounded-2xl hover:bg-slate-200 transition-colors shadow-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                  >
                    <Download size={16} /> Save Masterpiece
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-20 flex flex-col items-center">
                <div className="w-24 h-24 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <ImageIcon className="text-slate-800" size={32} />
                </div>
                <h3 className="text-slate-500 font-bold text-lg uppercase tracking-[0.3em]">
                  Awaiting Input
                </h3>
                <p className="text-slate-700 text-xs mt-2">
                  Your GPU is ready for the next generation.
                </p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl flex flex-col items-center justify-center z-50">
                <div className="relative">
                  <div className="w-24 h-24 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <Zap
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse"
                    size={30}
                  />
                </div>
                <div className="mt-8 text-center space-y-2">
                  <p className="text-white font-black text-2xl tracking-[0.2em] italic">
                    PROCESSING
                  </p>
                  <p className="text-indigo-400 text-[10px] font-bold tracking-[0.4em] uppercase">
                    Optimizing 6GB VRAM Pipeline
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-xl px-6 py-4 rounded-2xl text-red-400 text-xs font-bold tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          SYSTEM ERROR: {error}
        </div>
      )}
    </div>
  );
}

function ControlSlider({ label, value, min, max, step = 1, onChange, accent }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-sm font-black text-white bg-white/10 px-2 py-0.5 rounded-md">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-white hover:accent-indigo-400 transition-all`}
      />
    </div>
  );
}
