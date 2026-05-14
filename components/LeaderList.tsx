"use client";

import type { Entry } from "@/types";

interface LeaderListProps {
  entries: Entry[];
}

export default function LeaderList({ entries }: LeaderListProps) {
  const sorted = [...entries].sort((a, b) => b.numero - a.numero);

  if (sorted.length === 0) {
    return (
      <div className="w-full max-w-md text-center py-16 text-zinc-700 text-xs tracking-widest uppercase">
        Nenhum registro ainda.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      {sorted.map((entry, index) => (
        <div
          key={entry.id}
          className="flex items-center justify-between px-5 py-5 rounded-xl bg-zinc-950 border border-zinc-900"
        >
          <div className="flex items-center gap-4">
            <span className="text-zinc-600 text-sm font-mono w-6 text-right shrink-0">
              {index + 1}
            </span>
            <span className="text-white font-semibold text-lg">
              {entry.nome} {entry.sobrenome}
            </span>
          </div>
          <span className="text-purple-400 font-bold text-2xl tabular-nums">
            {entry.numero.toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  );
}
