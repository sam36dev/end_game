"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [configNumber, setConfigNumber] = useState("");
  const [savingNumber, setSavingNumber] = useState(false);
  const [savedNumber, setSavedNumber] = useState(false);
  const [storedPassword, setStoredPassword] = useState("");

  useEffect(() => {
    if (loggedIn) {
      fetch("/api/config")
        .then((r) => r.json())
        .then((d) => setConfigNumber(String(d.number)));
    }
  }, [loggedIn]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        setCurrentToken(data.token);
        setStoredPassword(password);
        setLoggedIn(true);
        setAuthError("");
      } else if (res.status === 401) {
        setAuthError("Senha incorreta.");
        setPassword("");
      } else {
        setAuthError(`Erro ${res.status}: ${data.error ?? "tente novamente"}`);
        setPassword("");
      }
    } catch {
      setAuthError("Erro de conexão. Tente novamente.");
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

  async function handleSaveNumber(e: React.FormEvent) {
    e.preventDefault();
    setSavingNumber(true);
    try {
      await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: storedPassword, number: Number(configNumber) }),
      });
      setSavedNumber(true);
      setTimeout(() => setSavedNumber(false), 2000);
    } finally {
      setSavingNumber(false);
    }
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
                setAuthError("");
              }}
              placeholder="Senha"
              className={`bg-zinc-900 border rounded-lg px-4 py-4 text-base text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all ${
                authError
                  ? "border-red-600 focus:ring-red-600"
                  : "border-zinc-800 focus:ring-purple-600"
              }`}
            />
            {authError && (
              <p className="text-red-500 text-sm -mt-2">{authError}</p>
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
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-[0.3em] uppercase text-white mb-1">
            END GAME
          </h1>
          <p className="text-zinc-600 text-xs uppercase tracking-widest">
            Painel Admin
          </p>
        </div>

        {/* Token */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-widest text-zinc-600">
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

        {/* Número configurável */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-widest text-zinc-600">
            Encerrados
          </p>
          <form onSubmit={handleSaveNumber} className="flex gap-3">
            <input
              type="number"
              value={configNumber}
              onChange={(e) => setConfigNumber(e.target.value)}
              placeholder="0"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
            <button
              type="submit"
              disabled={savingNumber}
              className={`px-5 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                savedNumber
                  ? "bg-green-600 text-white"
                  : "bg-purple-700 hover:bg-purple-600 text-white"
              }`}
            >
              {savedNumber ? "Salvo!" : "Salvar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
