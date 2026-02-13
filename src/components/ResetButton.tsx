"use client";

import { useState } from "react";
import { useWordsStore } from "@/store/useWordsStore";

export default function ResetButton() {
  const reset = useWordsStore((s) => s.reset);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500">Reset all words?</span>
        <button
          onClick={() => {
            reset();
            setConfirming(false);
          }}
          className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium transition-colors hover:bg-red-700"
        >
          Yes, reset
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      Reset
    </button>
  );
}
