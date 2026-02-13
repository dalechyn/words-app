"use client";

import { useEffect, useState } from "react";
import { useWordsStore } from "@/store/useWordsStore";
import CsvUpload from "@/components/CsvUpload";
import Flashcard from "@/components/Flashcard";
import CompletionScreen from "@/components/CompletionScreen";
import ResetButton from "@/components/ResetButton";

export default function Home() {
  const { words, completed } = useWordsStore();
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
        <div className="absolute top-4 right-4">
          <ResetButton />
        </div>
      )}

      {!hasWords && <CsvUpload />}
      {hasWords && !completed && <Flashcard />}
      {hasWords && completed && <CompletionScreen />}
    </div>
  );
}
