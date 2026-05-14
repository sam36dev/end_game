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

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      if (res.ok) setEntries(await res.json());
    } catch {
      // silently ignore network errors
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    const interval = setInterval(fetchEntries, 3000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

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
    fetchEntries();
  }

  function handleDone() {
    setShowForm(false);
    setRegistered(true);
  }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        {!registered && (
          <button
            onClick={handleTokenButtonClick}
            className={`text-sm uppercase tracking-widest font-semibold px-4 py-2 rounded-lg border transition-all ${
              accessToken
                ? "border-purple-600 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
                : "border-zinc-600 text-zinc-400 hover:bg-zinc-800 cursor-pointer"
            }`}
          >
            {accessToken ? "+ Registrar" : "Token"}
          </button>
        )}
        {registered && <div className="w-24" />}

        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-white">
          END GAME
        </h1>

        <div className="w-24" />
      </header>

      <div className="flex-1 flex flex-col items-center gap-8 px-4 py-10">
        <LeaderList entries={entries} />
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
