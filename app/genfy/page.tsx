"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Play, Cpu, Database, Layers, Settings2, Activity } from "lucide-react";

import Alert from "@/components/UI/Alert";
import PromptNode from "@/components/genfy/nodes/PromptNode";
import ResultNode from "@/components/genfy/nodes/ResultNode";
import HeaderHome from "@/components/Home/headerHome";

export default function GenfyPage() {
  const [hwStats, setHwStats] = useState({ cpu: 0, ram: 0, vram: 0 });
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion v1.5");
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [alert, setAlert] = useState<{
    type: "success" | "warning" | "error" | "onprogress";
    title: string;
    message?: string;
  } | null>(null);

  const [params, setParams] = useState({
    steps: 30,
    cfg: 7.5,
    seed: -1,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "node-1",
      type: "promptNode",
      position: { x: 50, y: 100 },
      data: {
        label: "A cinematic portrait of a neon samurai",
        onChange: (value: string) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === "node-1"
                ? { ...node, data: { ...node.data, label: value } }
                : node
            )
          );
        },
      },
    },
    {
      id: "node-2",
      type: "resultNode",
      position: { x: 500, y: 50 },
      data: { imageUrl: undefined, isLoading: false },
    },
  ]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/stats");
      if (res.ok) {
        const data = await res.json();
        setHwStats(data);
      }
    } catch (err) {
      setAlert({
        type: "error",
        title: "Gagal mengambil data",
        message: "Gagal mengambil stats hardware",
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const nodeTypes = useMemo(
    () => ({ promptNode: PromptNode, resultNode: ResultNode }),
    []
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleGenerate = async () => {
    const promptNode = nodes.find((n) => n.id === "node-1");
    const userPrompt = (promptNode?.data as any)?.label || "";

    if (!userPrompt)
      return setAlert({
        type: "error",
        title: "Prompt empty!",
        message: "Prompt empty! Please enter a prompt to generate an image.",
      });

    setNodes((nds) =>
      nds.map((n) =>
        n.id === "node-2" ? { ...n, data: { ...n.data, isLoading: true } } : n
      )
    );

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          steps: params.steps,
          cfg: params.cfg,
          seed: params.seed,
        }),
      });
      const data = await response.json();
      setNodes((nds) =>
        nds.map((node) =>
          node.id === "node-2"
            ? {
                ...node,
                data: {
                  ...node.data,
                  isLoading: false,
                  imageUrl: data.image_base64,
                  seed: data.seed,
                },
              }
            : node
        )
      );
    } catch (error) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === "node-2"
            ? { ...node, data: { ...node.data, isLoading: false } }
            : node
        )
      );
    }
  };

  return (
    <div className="w-full h-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden">
      <HeaderHome />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-[#0b1120] border-r border-slate-800 p-6 flex flex-col gap-8 shadow-2xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-4 text-violet-400">
              <Settings2 size={18} />
              <h2 className="font-bold uppercase tracking-widest text-xs">
                Model Config
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold">
                  Base Model
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option>Stable Diffusion v1.5</option>
                  <option>FLUX.1 [dev]</option>
                  <option>Animeify XL</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">
                    LoRA Weights
                  </label>
                  <button className="text-[10px] text-violet-400 font-bold hover:underline">
                    + Add
                  </button>
                </div>
                <div className="bg-slate-900/50 border border-dashed border-slate-700 rounded-lg p-4 text-center">
                  <Layers size={20} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-[10px] text-slate-500">
                    No LoRA active in MVP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-2 text-violet-400 mb-2">
              <Settings2 size={16} />
              <h3 className="text-[10px] uppercase font-bold tracking-widest">
                Advanced Params
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span>Inference Steps</span>
                <span className="text-violet-400">{params.steps}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={params.steps}
                onChange={(e) =>
                  setParams({ ...params, steps: parseInt(e.target.value) })
                }
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono">
                <span>Guidance Scale (CFG)</span>
                <span className="text-violet-400">{params.cfg}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={params.cfg}
                onChange={(e) =>
                  setParams({ ...params, cfg: parseFloat(e.target.value) })
                }
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold">
                Seed (-1 for Random)
              </label>
              <input
                type="number"
                value={params.seed}
                onChange={(e) =>
                  setParams({ ...params, seed: parseInt(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>
        </aside>

        <main className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodesDraggable={true}
            nodesConnectable={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e293b" gap={25} size={1} />
            <MiniMap
              position="top-right"
              style={{
                backgroundColor: "#0b1120",
                borderColor: "#334155",
              }}
            />

            <Panel
              position="bottom-left"
              className="w-[calc(100%-40px)] ml-5 mb-5 flex items-center justify-between pointer-events-none"
            >
              <div className="flex gap-4 bg-[#0b1120]/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl pointer-events-auto">
                <div className="flex gap-4 bg-[#0b1120]/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-2xl">
                  <div className="flex items-center gap-3 px-3 border-r border-slate-700">
                    <Cpu size={18} className="text-blue-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                        CPU Load
                      </p>
                      <p className="text-sm font-mono text-slate-100">
                        {hwStats.cpu}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-3 border-r border-slate-700">
                    <Activity size={18} className="text-emerald-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                        VRAM (GPU)
                      </p>
                      <p className="text-sm font-mono text-slate-100">
                        {hwStats.vram} GB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-3">
                    <Database size={18} className="text-orange-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                        System RAM
                      </p>
                      <p className="text-sm font-mono text-slate-100">
                        {hwStats.ram}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="pointer-events-auto group flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white pl-8 pr-6 py-4 rounded-2xl font-black shadow-lg transition-all hover:scale-[1.02] active:scale-95 border-t border-violet-400/50"
              >
                <span className="tracking-[0.2em] text-sm text-white">
                  GENERATE IMAGE
                </span>
                <div className="bg-white/20 p-2 rounded-xl">
                  <Play className="w-5 h-5 fill-current text-white" />
                </div>
              </button>
            </Panel>
          </ReactFlow>
        </main>
      </div>
      {/* ALERT */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={4000}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
