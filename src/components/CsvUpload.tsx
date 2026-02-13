"use client";

import { useCallback, useRef, useState } from "react";
import { useWordsStore, WordPair } from "@/store/useWordsStore";

function parseCsv(text: string): WordPair[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const words: WordPair[] = [];
  for (const line of lines) {
    const idx = line.indexOf(",");
    if (idx === -1) continue;
    const polish = line.slice(0, idx).trim();
    const russian = line.slice(idx + 1).trim();
    if (polish && russian) {
      words.push({ polish, russian });
    }
  }
  return words;
}

export default function CsvUpload() {
  const importWords = useWordsStore((s) => s.importWords);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    (file: File) => {
      setError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const words = parseCsv(text);
        if (words.length === 0) {
          setError(
            "No valid word pairs found. Make sure the format is: polish_word,russian_translation"
          );
          return;
        }
        importWords(words);
      };
      reader.readAsText(file);
    },
    [importWords]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const text = e.clipboardData.getData("text");
      if (text) {
        const words = parseCsv(text);
        if (words.length > 0) {
          e.preventDefault();
          importWords(words);
        }
      }
    },
    [importWords]
  );

  const [textValue, setTextValue] = useState("");

  const handleTextSubmit = () => {
    setError("");
    const words = parseCsv(textValue);
    if (words.length === 0) {
      setError(
        "No valid word pairs found. Make sure the format is: polish_word,russian_translation"
      );
      return;
    }
    importWords(words);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Polish Words</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Upload a CSV file with Polish words and their Russian translations
        </p>
      </div>

      <div
        className={`w-full border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center gap-3">
          <svg
            className="w-10 h-10 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Drop a CSV file here or click to browse
          </p>
          <p className="text-xs text-zinc-400">Format: polish_word,russian_translation</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <div className="w-full flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
        <span className="text-xs text-zinc-400 uppercase">or paste below</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <div className="w-full flex flex-col gap-3">
        <textarea
          className="w-full h-36 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={"urząd,ужонд\nkobieta,кобета\ndom,дом"}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onPaste={handlePaste}
        />
        <button
          onClick={handleTextSubmit}
          disabled={!textValue.trim()}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Import Words
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
}
