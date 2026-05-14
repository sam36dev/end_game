"use client";

import { useState } from "react";
import type { Entry } from "@/types";

interface EntryFormProps {
  token: string;
  onAdd: (entry: Entry) => void;
  onCancel: () => void;
}

export default function EntryForm({ token, onAdd, onCancel }: EntryFormProps) {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !sobrenome.trim() || numero === "") return;
    setLoading(true);
    setError("");

    const entry: Entry = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      numero: Number(numero),
      timestamp: Date.now(),
    };

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, entry }),
      });
      if (res.ok) {
        onAdd(entry);
        setSuccess(true);
      } else if (res.status === 409) {
        setError("Valor indisponível, duas pessoas já escolheram esse valor.");
      } else {
        setError("Erro ao salvar. Tente novamente.");
      }
    } catch {
      setError("Sem conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-sm mx-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-10 shadow-2xl flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-purple-700/20 border border-purple-700 flex items-center justify-center">
          <span className="text-purple-400 text-3xl">✓</span>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-xl">Registrado!</p>
          <p className="text-zinc-500 text-sm mt-1">
            {nome} {sobrenome} — {Number(numero).toLocaleString("pt-BR")}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-4 rounded-lg transition-colors tracking-wider uppercase text-base"
        >
          Ver Lista
        </button>
      </div>
    );
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

      {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors tracking-wider uppercase text-base mt-1"
      >
        {loading ? "Salvando..." : "Confirmar"}
      </button>
    </form>
  );
}
