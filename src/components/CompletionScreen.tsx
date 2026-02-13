"use client";

import { useWordsStore } from "@/store/useWordsStore";

export default function CompletionScreen() {
  const { words, restartList, reset } = useWordsStore();

  return (
    <div className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
      <div className="text-6xl">&#127881;</div>
      <h2 className="text-3xl font-bold">Great job!</h2>
      <p className="text-zinc-500 dark:text-zinc-400">
        You&apos;ve gone through all {words.length} words. Want to keep practicing
        or try a new list?
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={restartList}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700"
        >
          Go Again
        </button>
        <button
          onClick={reset}
          className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Upload New List
        </button>
      </div>
    </div>
  );
}
