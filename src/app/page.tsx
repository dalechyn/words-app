"use client";

import { useEffect, useState } from "react";
import { useWordsStore } from "@/store/useWordsStore";
import CsvUpload from "@/components/CsvUpload";
import Flashcard from "@/components/Flashcard";
import CompletionScreen from "@/components/CompletionScreen";
import ResetButton from "@/components/ResetButton";

export default function Home() {
  const { words, completed, reversed, toggleReversed } = useWordsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasWords = words.length > 0;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12 gap-8">
      {hasWords && !completed && (
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button
            onClick={toggleReversed}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <span className={reversed ? "font-semibold text-zinc-800 dark:text-zinc-200" : ""}>RU</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            <span className={!reversed ? "font-semibold text-zinc-800 dark:text-zinc-200" : ""}>PL</span>
          </button>
          <ResetButton />
        </div>
      )}

      {!hasWords && <CsvUpload />}
      {hasWords && !completed && <Flashcard />}
      {hasWords && completed && <CompletionScreen />}
    </div>
  );
}
