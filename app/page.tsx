"use client";

import { useState, useEffect, useCallback } from "react";
import TokenModal from "@/components/TokenModal";
import EntryForm from "@/components/EntryForm";
import LeaderList from "@/components/LeaderList";
import type { Entry } from "@/types";

export default function Home() {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [configNumber, setConfigNumber] = useState<number>(0);

  const fetchData = useCallback(async () => {
    try {
      const [entriesRes, configRes] = await Promise.all([
        fetch("/api/entries"),
        fetch("/api/config"),
      ]);
      if (entriesRes.ok) setEntries(await entriesRes.json());
      if (configRes.ok) {
        const data = await configRes.json();
        setConfigNumber(data.number);
      }
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  function handleUnlock(token: string) {
    setAccessToken(token);
    setShowTokenModal(false);
    setShowForm(true);
  }

  function handleTokenButtonClick() {
    if (accessToken) {
      setShowForm(true);
    } else {
      setShowTokenModal(true);
    }
  }

  function handleAdd() {
    fetchData();
  }

  function handleDone() {
    setShowForm(false);
    setRegistered(true);
  }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      <header className="w-full flex items-center px-4 py-5 border-b border-zinc-900">
        <div className="w-28 flex items-center">
          {!registered && (
            <button
              onClick={handleTokenButtonClick}
              className={`text-xs uppercase tracking-widest font-semibold px-3 py-2 rounded-lg border transition-all whitespace-nowrap ${
                accessToken
                  ? "border-purple-600 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                  : "border-zinc-600 text-zinc-400 hover:bg-zinc-800 cursor-pointer"
              }`}
            >
              {accessToken ? "+ Registrar" : "Token"}
            </button>
          )}
        </div>

        <h1 className="flex-1 text-center text-2xl font-black tracking-[0.3em] uppercase text-white">
          END GAME
        </h1>

        <div className="w-28" />
      </header>

      <div className="flex-1 flex flex-col items-center gap-6 px-4 py-10">
        {/* Número configurável pelo admin */}
        <div className="w-full max-w-md">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl px-6 py-5 flex items-center justify-between">
            <span className="text-zinc-500 text-xs uppercase tracking-widest font-semibold">
              Encerrados
            </span>
            <span className="text-white font-black text-4xl tabular-nums">
              {configNumber.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>

        <LeaderList entries={entries} encerrados={configNumber} />
      </div>

      {showForm && accessToken && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EntryForm
              token={accessToken}
              onAdd={handleAdd}
              onCancel={handleDone}
            />
          </div>
        </div>
      )}

      {showTokenModal && (
        <TokenModal
          onSuccess={handleUnlock}
          onClose={() => setShowTokenModal(false)}
        />
      )}
    </main>
  );
}
