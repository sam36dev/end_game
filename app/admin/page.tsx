"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentToken(data.token);
        setLoggedIn(true);
        setAuthError(false);
      } else {
        setAuthError(true);
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!currentToken) return;
    navigator.clipboard.writeText(currentToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-black tracking-[0.3em] uppercase text-white text-center mb-2">
            END GAME
          </h1>
          <p className="text-zinc-600 text-xs text-center uppercase tracking-widest mb-10">
            Admin
          </p>

          <form
            onSubmit={handleLogin}
            className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 flex flex-col gap-4"
          >
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthError(false);
              }}
              placeholder="Senha"
              className={`bg-zinc-900 border rounded-lg px-4 py-4 text-base text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${
                authError
                  ? "border-red-600 focus:ring-red-600"
                  : "border-zinc-800 focus:ring-purple-600"
              }`}
            />
            {authError && (
              <p className="text-red-500 text-sm -mt-2">Senha incorreta.</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors tracking-wider uppercase text-base"
            >
              {loading ? "..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black tracking-[0.3em] uppercase text-white text-center mb-2">
          END GAME
        </h1>
        <p className="text-zinc-600 text-xs text-center uppercase tracking-widest mb-10">
          Painel Admin
        </p>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">
              Token Atual
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-4 flex items-center justify-between gap-3">
              <span className="font-mono text-purple-400 text-xl tracking-[0.3em] font-bold">
                {currentToken}
              </span>
              <button
                onClick={handleCopy}
                className={`shrink-0 text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-md transition-all ${
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-700"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <p className="text-zinc-700 text-xs text-center leading-relaxed">
            Para gerar um novo token, altere{" "}
            <span className="text-zinc-500 font-mono">ACCESS_TOKEN</span> nas
            variáveis de ambiente da Vercel.
          </p>
        </div>
      </div>
    </main>
  );
}
