"use client";

import type { Entry } from "@/types";

interface LeaderListProps {
  entries: Entry[];
  encerrados: number;
}

export default function LeaderList({ entries, encerrados }: LeaderListProps) {
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
      {sorted.map((entry, index) => {
        const eliminado = encerrados > entry.numero;
        return (
          <div
            key={entry.id}
            className={`flex items-center justify-between px-5 py-5 rounded-xl border ${
              eliminado
                ? "bg-red-950/30 border-red-900/50"
                : "bg-zinc-950 border-zinc-900"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-zinc-600 text-sm font-mono w-6 text-right shrink-0">
                {index + 1}
              </span>
              <div className="flex flex-col">
                <span className={`font-semibold text-lg ${eliminado ? "text-red-400" : "text-white"}`}>
                  {entry.nome} {entry.sobrenome}
                </span>
                {eliminado && (
                  <span className="text-red-500 text-xs font-bold uppercase tracking-widest">
                    — Eliminado
                  </span>
                )}
              </div>
            </div>
            <span className={`font-bold text-2xl tabular-nums ${eliminado ? "text-red-500" : "text-purple-400"}`}>
              {entry.numero.toLocaleString("pt-BR")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
