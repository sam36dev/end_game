"use client";

import { useState, useEffect } from "react";
import TokenModal from "@/components/TokenModal";
import EntryForm from "@/components/EntryForm";
import LeaderList from "@/components/LeaderList";
import type { Entry } from "@/types";

export default function Home() {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem("endgame_entries");
    if (storedEntries) setEntries(JSON.parse(storedEntries));
  }, []);

  function handleUnlock() {
    setUnlocked(true);
    setShowTokenModal(false);
    setShowForm(true);
  }

  function handleTokenButtonClick() {
    if (unlocked) {
      setShowForm(true);
    } else {
      setShowTokenModal(true);
    }
  }

  function handleAdd(entry: Entry) {
    const updated = [...entries, entry];
    setEntries(updated);
    localStorage.setItem("endgame_entries", JSON.stringify(updated));
    setShowForm(false);
  }

  return (
    <main className="min-h-screen bg-black flex flex-col">
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <button
          onClick={handleTokenButtonClick}
          className={`text-sm uppercase tracking-widest font-semibold px-4 py-2 rounded-lg border transition-all ${
            unlocked
              ? "border-purple-600 text-purple-400 hover:bg-purple-500/10 cursor-pointer"
              : "border-zinc-600 text-zinc-400 hover:bg-zinc-800 cursor-pointer"
          }`}
        >
          {unlocked ? "+ Registrar" : "Token"}
        </button>

        <h1 className="text-2xl font-black tracking-[0.3em] uppercase text-white">
          END GAME
        </h1>

        <div className="w-24" />
      </header>

      <div className="flex-1 flex flex-col items-center gap-8 px-4 py-10">
        <LeaderList entries={entries} />
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <EntryForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
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
