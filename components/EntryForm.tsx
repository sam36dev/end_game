"use client";

import { useState } from "react";
import type { Entry } from "@/types";

interface EntryFormProps {
  onAdd: (entry: Entry) => void;
  onCancel: () => void;
}

export default function EntryForm({ onAdd, onCancel }: EntryFormProps) {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [numero, setNumero] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !sobrenome.trim() || numero === "") return;

    onAdd({
      id: crypto.randomUUID(),
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      numero: Number(numero),
      timestamp: Date.now(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-5"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-purple-400 uppercase tracking-widest">
          Registrar
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-zinc-600 hover:text-zinc-400 text-xl leading-none transition-colors"
        >
          ×
        </button>
      </div>

      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome"
        required
        autoFocus
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-4 text-base text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
      />
      <input
        type="text"
        value={sobrenome}
        onChange={(e) => setSobrenome(e.target.value)}
        placeholder="Sobrenome"
        required
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-4 text-base text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
      />
      <input
        type="number"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder="Número"
        required
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-4 text-base text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
      />

      <button
        type="submit"
        className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-4 rounded-lg transition-colors tracking-wider uppercase text-base mt-1"
      >
        Confirmar
      </button>
    </form>
  );
}
