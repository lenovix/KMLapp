"use client";

import { Handle, Position } from "@xyflow/react";
import { ImageIcon, Download, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ResultNode({
  data,
}: {
  data: { imageUrl?: string; isLoading?: boolean };
}) {
  return (
    <div className="bg-slate-900 border-2 border-emerald-500 rounded-xl shadow-2xl min-w-[300px] overflow-hidden">
      <div className="bg-emerald-500/10 border-b border-emerald-500/30 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
            Output Result
          </span>
        </div>
        {data.imageUrl && (
          <button className="text-emerald-400 hover:text-emerald-300 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-1">
        <div className="bg-slate-800 rounded-lg min-h-[200px] flex flex-col items-center justify-center border border-dashed border-slate-700 overflow-hidden relative">
          {data.isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-xs text-slate-400 animate-pulse">
                Generating magic...
              </p>
            </div>
          ) : data.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt="AI Generated"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="text-center p-4">
              <p className="text-xs text-slate-500 italic">
                Connect a prompt and click generate to see the result
              </p>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-emerald-500 border-2 border-slate-900 !-left-1.5"
      />
    </div>
  );
}
