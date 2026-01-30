"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Sparkles,
  Download,
  Loader2,
  Zap,
  ChevronDown,
  Hash,
  Settings2,
  Type,
  Layers,
  Maximize,
} from "lucide-react";
import ControlSlider from "@/components/genfy/ControlSlider";

export default function GenfyPage() {
  const [loraList, setLoraList] = useState<string[]>([]);
  const [loraName, setLoraName] = useState("None");
  const [loraWeight, setLoraWeight] = useState(0.75);
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

  const [activeTab, setActiveTab] = useState("model");
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);

  useEffect(() => {
    const fetchModelsAndLoras = async () => {
      try {
        const [modelRes, loraRes] = await Promise.all([
          fetch("http://localhost:8000/models"),
          fetch("http://localhost:8000/loras"),
        ]);
        const models = await modelRes.json();
        const loras = await loraRes.json();
        setModelList(models);
        if (models.length > 0) setModelName(models[0]);
        setLoraList(loras);
      } catch (e) {
        setError("Backend disconnected. Error: " + e);
      }
    };
    fetchModelsAndLoras();
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
          lora_name: loraName,
          lora_weight: loraWeight,
          steps,
          cfg,
          seed,
          width,
          height,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Gagal generate gambar.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem.",
      );
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
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Next-Gen Image Synthesis Studio
          </p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        <section className="lg:col-span-7 xl:col-span-7 space-y-4">
          <div className="relative aspect-square lg:h-[600px] bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center overflow-hidden group shadow-inner">
            {result ? (
              <div className="relative w-full h-full p-6 animate-in fade-in zoom-in duration-700">
                <Image
                  src={result.image_base64}
                  alt="AI Result"
                  className="w-full h-full object-contain rounded-[1.5rem]"
                  width={800}
                  height={800}
                  unoptimized
                />
                <div className="absolute bottom-10 right-10 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <button
                    onClick={() => {
                      setSeed(result.seed);
                      alert("Seed copied!");
                    }}
                    className="p-4 bg-slate-900/80 backdrop-blur-md text-white border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider"
                  >
                    Reuse Seed: {result.seed}
                  </button>
                  <button
                    onClick={downloadImage}
                    className="p-4 bg-white text-black rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
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
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl flex flex-col items-center justify-center z-50">
                <div className="w-24 h-24 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="mt-8 text-white font-black text-2xl tracking-[0.2em] italic">
                  PROCESSING
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="lg:col-span-5 xl:col-span-5 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 p-2 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl">
            <div className="grid grid-cols-4 gap-1 mb-4 p-1 bg-black/20 rounded-[2rem]">
              {[
                { id: "model", icon: Layers },
                { id: "prompt", icon: Type },
                { id: "size", icon: Maximize },
                { id: "settings", icon: Settings2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-3 rounded-[1.5rem] transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-black shadow-lg"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-[9px] font-bold uppercase mt-1 tracking-tighter">
                    {tab.id}
                  </span>
                </button>
              ))}
            </div>

            <form onSubmit={handleGenerate} className="p-6 space-y-6">
              {activeTab === "model" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500 px-1">
                      Engine Checkpoint
                    </label>
                    <div className="relative">
                      <select
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none appearance-none focus:ring-2 focus:ring-indigo-500/50"
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

                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500 px-1">
                      Visual Extension (LoRA)
                    </label>
                    <div className="relative">
                      <select
                        value={loraName}
                        onChange={(e) => setLoraName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none appearance-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        {loraList.map((l) => (
                          <option key={l} value={l} className="bg-slate-900">
                            {l}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                        size={16}
                      />
                    </div>
                    {loraName !== "None" && (
                      <ControlSlider
                        label="LoRA Strength"
                        value={loraWeight}
                        min={0}
                        max={1.5}
                        step={0.05}
                        onChange={setLoraWeight}
                        accent="bg-purple-500"
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === "prompt" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500 px-1">
                    Visual Description
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g. Cyberpunk samurai in a rain-slicked neon street..."
                    className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none placeholder:text-slate-700 text-sm leading-relaxed"
                  />
                </div>
              )}

              {activeTab === "size" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ControlSlider
                    label="Image Width"
                    value={width}
                    min={256}
                    max={1024}
                    step={64}
                    onChange={setWidth}
                    accent="bg-blue-500"
                  />
                  <ControlSlider
                    label="Image Height"
                    value={height}
                    min={256}
                    max={1024}
                    step={64}
                    onChange={setHeight}
                    accent="bg-blue-500"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      [512, 512],
                      [512, 768],
                      [768, 512],
                    ].map(([w, h]) => (
                      <button
                        key={`${w}x${h}`}
                        type="button"
                        onClick={() => {
                          setWidth(w);
                          setHeight(h);
                        }}
                        className="text-[10px] font-bold p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"
                      >
                        {w} x {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <ControlSlider
                    label="Precision Steps"
                    value={steps}
                    min={1}
                    max={50}
                    onChange={setSteps}
                    accent="bg-indigo-500"
                  />
                  <ControlSlider
                    label="Guidance Scale (CFG)"
                    value={cfg}
                    min={1}
                    max={15}
                    step={0.5}
                    onChange={setCfg}
                    accent="bg-purple-500"
                  />
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500 px-1">
                      Identity Seed
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <Hash
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                        size={16}
                      />
                      <button
                        type="button"
                        onClick={() => setSeed(-1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-white/10 px-2 py-1 rounded hover:bg-white/20"
                      >
                        RANDOM
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !prompt}
                className="w-full relative group overflow-hidden bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Sparkles size={18} />
                )}
                {loading ? "INITIALIZING..." : "GENERATE ARTWORK"}
              </button>
            </form>
          </div>
        </aside>
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
