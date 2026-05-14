"use client";

import { useState } from "react";

interface TokenModalProps {
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export default function TokenModal({ onSuccess, onClose }: TokenModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: value.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        onSuccess(value.trim());
      } else {
        setError(true);
        setValue("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-bold text-purple-400 uppercase tracking-widest mb-1">
          Token de Acesso
        </h2>
        <p className="text-zinc-600 text-sm mb-6">
          Insira o token para liberar o formulário.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            placeholder="Digite o token..."
            className={`w-full bg-zinc-900 border rounded-lg px-4 py-4 text-base text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${
              error
                ? "border-red-600 focus:ring-red-600"
                : "border-zinc-800 focus:ring-purple-600"
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm -mt-2">Token inválido.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors tracking-wider uppercase text-base"
          >
            {loading ? "..." : "Confirmar"}
          </button>
        </form>
      </div>
    </div>
  );
}
