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
  Trash2,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  Compass,
  Activity,
  X,
  Video,
  Mic,
} from "lucide-react";
import ControlSlider from "@/components/genfy/ControlSlider";
import Link from "next/link";

interface SelectedLora {
  name: string;
  weight: number;
}

interface LoraItem {
  name: string;
  arch: string;
}

export default function GenfyPage() {
  const [generationMode, setGenerationMode] = useState("image");
  const [showGuide, setShowGuide] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loraList, setLoraList] = useState<LoraItem[]>([]);
  const [selectedLoras, setSelectedLoras] = useState<SelectedLora[]>([]);
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

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result.image_base64;
    link.download = `genfy-${result.seed}.png`;
    link.click();
  };

  const currentModelArch =
    modelName.toLowerCase().includes("xl") ||
    modelName.toLowerCase().includes("illustrious") ||
    modelName.toLowerCase().includes("pony")
      ? "SDXL"
      : "SD1.5";

  const compatibleLoras = loraList.filter(
    (lora) => lora.arch === currentModelArch,
  );

  const addLora = (name: string) => {
    if (name === "None" || selectedLoras.find((l) => l.name === name)) return;
    setSelectedLoras([...selectedLoras, { name, weight: 0.75 }]);
  };

  const removeLora = (index: number) => {
    setSelectedLoras(selectedLoras.filter((_, i) => i !== index));
  };

  const updateLoraWeight = (index: number, weight: number) => {
    const newLoras = [...selectedLoras];
    newLoras[index].weight = weight;
    setSelectedLoras(newLoras);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !modelName) return;

    setLoading(true);
    setProgress(0);
    setError("");
    setResult(null);

    const ws = new WebSocket("ws://localhost:8000/ws/progress");

    const waitForWs = new Promise((resolve) => {
      ws.onopen = () => {
        console.log("WebSocket Connected");
        resolve(true);
      };
    });

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.progress !== undefined) {
        setProgress(Math.round(data.progress * 100));
      }
    };

    try {
      await waitForWs;

      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model_name: modelName,
          active_loras: selectedLoras,
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
      setTimeout(() => ws.close(), 500);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />

      <nav className="max-w-[1600px] mx-auto flex flex-col xl:flex-row justify-between items-center gap-8 mb-10 border-b border-white/5 pb-8">
        <div className="flex flex-col items-center md:items-start shrink-0">
          <div className="flex items-center gap-4 mb-1">
            <Link
              href="/"
              className="group/back flex items-center gap-3 bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <div className="relative w-6 h-6">
                <Zap
                  size={24}
                  className="text-white fill-white absolute inset-0 transition-all duration-300 group-hover/back:opacity-0 group-hover/back:rotate-90"
                />
                <ArrowLeft
                  size={24}
                  className="text-white absolute inset-0 opacity-0 -rotate-90 transition-all duration-300 group-hover/back:opacity-100 group-hover/back:rotate-0"
                />
              </div>
            </Link>
            <h1 className="text-4xl font-black tracking-tighter text-white italic drop-shadow-sm select-none">
              GENFY<span className="text-indigo-500">.</span>
            </h1>
          </div>
          <p className="text-slate-500 text-[11px] uppercase tracking-[0.3em] font-bold ml-[3.25rem]">
            Next-Gen Synthesis Studio
          </p>
        </div>

        <div className="flex items-center bg-white/[0.03] border border-white/10 p-1.5 rounded-[2rem] backdrop-blur-md shadow-inner">
          {[
            { id: "image", label: "Image", icon: ImageIcon },
            { id: "video", label: "Video", icon: Video, locked: true },
            { id: "audio", label: "Audio", icon: Mic, locked: true },
          ].map((item) => (
            <button
              key={item.id}
              disabled={item.locked}
              onClick={() => setGenerationMode(item.id)}
              className={`
          relative flex items-center gap-3 px-6 py-3 rounded-[1.5rem] transition-all duration-500 group
          ${
            generationMode === item.id
              ? "bg-white shadow-[0_10px_20px_rgba(255,255,255,0.1)] text-black"
              : "text-slate-500 hover:text-white hover:bg-white/5"
          }
          ${item.locked ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
        `}
            >
              <item.icon
                size={18}
                className={
                  generationMode === item.id
                    ? "text-indigo-600"
                    : "text-slate-500 group-hover:text-indigo-400"
                }
              />
              <span className="text-xs font-black uppercase tracking-widest">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setShowGuide(true)}
            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            <div className="bg-indigo-500/20 p-1.5 rounded-lg group-hover:bg-indigo-500/40 transition-colors">
              <HelpCircle size={18} className="text-indigo-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              System Guide
            </span>
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-5 xl:col-span-5 order-1">
          <div className="relative aspect-square w-full h-full xl:h-[700px] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[3rem] flex items-center justify-center overflow-hidden shadow-2xl group transition-all duration-500 hover:border-indigo-500/30">
            {result ? (
              <div className="relative w-full h-full p-4 animate-in fade-in zoom-in duration-1000">
                <Image
                  src={result.image_base64}
                  alt="AI Masterpiece"
                  className="w-full h-full object-contain rounded-[2rem] shadow-2xl"
                  width={1024}
                  height={1024}
                  unoptimized
                />

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                  <button
                    onClick={() => {
                      setSeed(result.seed);
                      alert("Seed synced!");
                    }}
                    className="px-6 py-3 bg-slate-900/90 backdrop-blur-xl text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors"
                  >
                    Reuse Seed: {result.seed}
                  </button>
                  <button
                    onClick={downloadImage}
                    className="px-6 py-3 bg-white text-black rounded-2xl shadow-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    <Download size={14} /> Export 4K
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-20 flex flex-col items-center">
                <div className="w-32 h-32 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <ImageIcon className="text-slate-800" size={48} />
                </div>
                <h3 className="text-slate-600 font-black text-xl uppercase tracking-[0.4em] italic">
                  Canvas Ready
                </h3>
                <p className="text-slate-700 text-xs mt-3 font-medium">
                  Configure parameters to begin synthesis
                </p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl flex flex-col items-center justify-center z-50">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="110"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={690.8}
                      strokeDashoffset={690.8 - (690.8 * progress) / 100}
                      className="text-indigo-500 transition-all duration-700 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black italic text-white tracking-tighter">
                      {progress}%
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold tracking-[0.3em] mt-2 animate-pulse">
                      SYNTHESIZING
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="lg:col-span-5 xl:col-span-7 space-y-6 order-2 lg:sticky lg:top-8">
          <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] shadow-3xl backdrop-blur-3xl overflow-hidden">
            <div className="flex p-2 gap-1 bg-black/40 m-4 rounded-[2rem] border border-white/5">
              {[
                { id: "model", icon: Layers, label: "Engine" },
                { id: "prompt", icon: Type, label: "Prompt" },
                { id: "size", icon: Maximize, label: "Canvas" },
                { id: "settings", icon: Settings2, label: "Config" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white text-black shadow-xl scale-[1.02]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider hidden xl:block">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <form
              onSubmit={handleGenerate}
              className="p-8 pt-2 flex flex-col h-[610px]"
            >
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8 mb-6">
                <div className="min-h-[400px]">
                  {activeTab === "model" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-400 px-1">
                          Neural Checkpoint
                        </label>
                        <div className="relative group">
                          <select
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none focus:border-indigo-500/50 transition-all cursor-pointer"
                          >
                            {modelList.map((m) => (
                              <option
                                key={m}
                                value={m}
                                className="bg-slate-900"
                              >
                                {m}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-indigo-400 transition-colors"
                            size={18}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-black text-purple-400 px-1">
                          Visual Extensions (Multi-LoRA)
                        </label>

                        <div className="relative group">
                          <select
                            value="None"
                            onChange={(e) => addLora(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none appearance-none focus:border-purple-500/50 transition-all cursor-pointer group-hover:border-white/20"
                          >
                            <option value="None">+ Add Extension...</option>
                            {compatibleLoras.map((l) => (
                              <option
                                key={l.name}
                                value={l.name}
                                className="bg-slate-950"
                              >
                                {l.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 size={16}" />
                        </div>

                        <div className="space-y-3 mt-4">
                          {selectedLoras.map((lora, index) => (
                            <div
                              key={lora.name}
                              className="bg-white/[0.03] border border-white/10 p-5 rounded-[1.5rem] space-y-4"
                            >
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-white">
                                  {lora.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeLora(index)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <ControlSlider
                                label="Weight"
                                value={lora.weight}
                                min={0}
                                max={1.5}
                                step={0.05}
                                onChange={(val) => updateLoraWeight(index, val)}
                                accent="bg-purple-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "prompt" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-400 px-1">
                        Visual Manifest
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-80 bg-black/40 border border-white/10 rounded-[2rem] p-6 text-white focus:border-indigo-500/50 outline-none resize-none text-sm shadow-inner"
                        placeholder="Describe the impossible..."
                      />
                    </div>
                  )}

                  {activeTab === "size" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <ControlSlider
                        label="Width"
                        value={width}
                        min={256}
                        max={1024}
                        step={64}
                        onChange={setWidth}
                        accent="bg-indigo-500"
                      />
                      <ControlSlider
                        label="Height"
                        value={height}
                        min={256}
                        max={1024}
                        step={64}
                        onChange={setHeight}
                        accent="bg-purple-500"
                      />
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <ControlSlider
                        label="Sampling Steps"
                        value={steps}
                        min={1}
                        max={50}
                        onChange={setSteps}
                        accent="bg-emerald-500"
                      />

                      <ControlSlider
                        label="Guidance Scale"
                        value={cfg}
                        min={1}
                        max={15}
                        step={0.5}
                        onChange={setCfg}
                        accent="bg-amber-500"
                      />

                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-400">
                            Neural Seed
                          </label>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            {seed === -1 ? "Randomized" : "Fixed Mode"}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <div className="relative flex-1 group">
                            <input
                              type="number"
                              value={seed}
                              onChange={(e) =>
                                setSeed(parseInt(e.target.value))
                              }
                              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all font-mono"
                              placeholder="Enter seed..."
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => setSeed(-1)}
                            className={`px-6 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                              seed === -1
                                ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                                : "bg-black/40 border-white/10 text-slate-500 hover:border-blue-500/30 hover:text-blue-400"
                            }`}
                            title="Set to Random (-1)"
                          >
                            <RefreshCw
                              size={18}
                              className={
                                seed === -1
                                  ? "animate-spin-slow"
                                  : "group-hover/btn:rotate-180 transition-transform duration-500"
                              }
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">
                              Random
                            </span>
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-600 px-1 italic">
                          *Use -1 for a unique generation every time.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !prompt}
                className="w-full relative group overflow-hidden h-20 flex-shrink-0 bg-white text-black rounded-[1.5rem] transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-30 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative flex items-center justify-center gap-4">
                  {loading ? (
                    <Loader2
                      className="animate-spin text-indigo-600"
                      size={24}
                    />
                  ) : (
                    <Sparkles size={22} />
                  )}
                  <span className="text-base font-black uppercase tracking-[0.2em]">
                    {loading ? "Processing..." : "Generate Art"}
                  </span>
                </div>
              </button>
            </form>
          </div>
        </aside>
      </main>

      {error && (
        <div className="fixed bottom-10 left-10 right-10 md:left-auto md:right-10 md:w-96 bg-red-950/40 border border-red-500/50 backdrop-blur-2xl p-6 rounded-[2rem] text-red-400 animate-in slide-in-from-right-10 duration-500 z-[100] shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-500/20 rounded-full animate-pulse">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                System Fault
              </p>
              <p className="text-sm font-bold leading-tight">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowGuide(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-12 pb-6 flex justify-between items-start bg-[#0a0a0c]/80 backdrop-blur-md z-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white italic tracking-tight">
                  NEURAL PARAMETERS
                </h2>
                <p className="text-indigo-400 text-[10px] uppercase tracking-[0.3em] font-bold">
                  Calibration Documentation
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-10 md:px-12 space-y-6 custom-scrollbar">
              <div className="grid gap-6">
                <div className="group bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Activity size={20} />
                    </div>
                    <h3 className="font-bold text-white tracking-wide">
                      Sampling Steps
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Menentukan berapa kali AI akan menyempurnakan gambar dari
                    noise.
                    <span className="block mt-2 text-emerald-500/80 font-medium">
                      Tip: 20-30 sudah cukup untuk kebanyakan model. Nilai lebih
                      tinggi menambah detail tapi memperlambat proses.
                    </span>
                  </p>
                </div>

                <div className="group bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Compass size={20} />
                    </div>
                    <h3 className="font-bold text-white tracking-wide">
                      Guidance Scale (CFG)
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Mengontrol seberapa patuh AI terhadap prompt teks Anda.
                    <span className="block mt-2 text-amber-500/80 font-medium">
                      Tip: Gunakan 7-9 untuk hasil kreatif. Di atas 12 gambar
                      mungkin terlihat terlalu tajam (burnt).
                    </span>
                  </p>
                </div>

                <div className="group bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Hash size={20} />
                    </div>
                    <h3 className="font-bold text-white tracking-wide">
                      Neural Seed
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Sidik jari digital sebuah gambar. Angka yang sama akan
                    menghasilkan gambar yang identik.
                    <span className="block mt-2 text-blue-500/80 font-medium">
                      Tip: Set ke -1 (Random) untuk eksplorasi. Catat Seed untuk
                      modifikasi nanti.
                    </span>
                  </p>
                </div>

                <div className="group bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Layers size={20} />
                    </div>
                    <h3 className="font-bold text-white tracking-wide">
                      Influence Weight (LoRA)
                    </h3>
                  </div>
                  <div className="text-slate-400 text-sm leading-relaxed">
                    Mengatur seberapa kuat karakter tambahan diterapkan pada
                    model utama.
                    <span className="block mt-2 text-purple-500/80 font-medium italic text-[13px]">
                      Skala Kekuatan:
                    </span>
                    <ul className="mt-1 space-y-1 text-[13px] text-slate-500">
                      <li>
                        • <span className="text-slate-300">0.1 - 0.4:</span>{" "}
                        Sentuhan halus.
                      </li>
                      <li>
                        • <span className="text-slate-300">0.5 - 0.8:</span>{" "}
                        Keseimbangan ideal.
                      </li>
                      <li>
                        • <span className="text-slate-300">0.9 - 1.2:</span>{" "}
                        Sangat dominan.
                      </li>
                    </ul>
                    <span className="block mt-2 text-red-400/80 font-medium text-[12px]">
                      Note: Nilai di atas 1.2 seringkali membuat gambar pecah.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
