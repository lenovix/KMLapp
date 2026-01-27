"use client";

import { Handle, Position } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";

export default function PromptNode({
  data,
}: {
  data: { label: string; onChange: (val: string) => void };
}) {
  return (
    <div className="bg-slate-900 border-2 border-violet-500 rounded-xl shadow-2xl min-w-[250px] overflow-hidden">
      <div className="bg-violet-500/10 border-b border-violet-500/30 p-2 flex items-center gap-2">
        <MessageSquareText className="w-4 h-4 text-violet-400" />
        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">
          Prompt Input
        </span>
      </div>

      <div className="p-3">
        <textarea
          className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
          rows={3}
          placeholder="Describe what you want to generate..."
          onChange={(e) => data.onChange(e.target.value)}
          defaultValue={data.label}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-violet-500 border-2 border-slate-900 !-right-1.5"
      />
    </div>
  );
}
