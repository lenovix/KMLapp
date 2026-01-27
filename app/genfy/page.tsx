"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import PromptNode from "@/components/genfy/nodes/PromptNode";
import ResultNode from "@/components/genfy/nodes/ResultNode";
import { Play } from "lucide-react";
import HeaderHome from "@/components/Home/headerHome";

type CustomNode = Node<
  | { label: string; onChange: (val: string) => void }
  | { imageUrl?: string; isLoading?: boolean }
>;

type CustomEdge = Edge;

export default function GenfyPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([
    {
      id: "node-1",
      type: "promptNode",
      position: { x: 100, y: 200 },
      data: {
        label: "A futuristic cyberpunk city",
        onChange: (value: string) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === "node-1"
                ? { ...node, data: { ...node.data, label: value } }
                : node,
            ),
          );
        },
      },
    },
    {
      id: "node-2",
      type: "resultNode",
      position: { x: 600, y: 150 },
      data: { imageUrl: undefined, isLoading: false },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);

  const nodeTypes = useMemo(
    () => ({
      promptNode: PromptNode,
      resultNode: ResultNode,
    }),
    [],
  );

  const onConnect = useCallback(
    (params: Parameters<typeof addEdge>[0]) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleGenerate = async () => {
    const promptNode = nodes.find((n) => n.id === "node-1");
    const userPrompt =
      promptNode && "label" in promptNode.data
        ? (
            promptNode.data as {
              label: string;
              onChange: (val: string) => void;
            }
          ).label
        : "";

    if (!userPrompt) {
      alert("Isi prompt dulu ya!");
      return;
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === "node-2"
          ? {
              ...node,
              data: { ...node.data, isLoading: true, imageUrl: undefined },
            }
          : node,
      ),
    );

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) throw new Error("Gagal menyambung ke server AI");

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
                },
              }
            : node,
        ),
      );
    } catch (error) {
      console.error("Generate Error:", error);
      alert("Gagal generate: Pastikan backend Python sudah running!");

      setNodes((nds) =>
        nds.map((node) =>
          node.id === "node-2"
            ? { ...node, data: { ...node.data, isLoading: false } }
            : node,
        ),
      );
    }
  };

  return (
    <div className="w-full h-screen bg-[#020617]">
      <HeaderHome />
      <div className="w-full h-[calc(100vh-64px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Panel position="top-right">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-violet-500/20 transition-all hover:scale-105 active:scale-95 border border-violet-400/30"
            >
              <Play className="w-5 h-5 fill-current" />
              GENERATE IMAGE
            </button>
          </Panel>
          <Background color="#1e293b" gap={25} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
