import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WordPair {
  polish: string;
  russian: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface WordsState {
  words: WordPair[];
  order: number[];
  currentIndex: number;
  history: number[];
  completed: boolean;

  importWords: (words: WordPair[]) => void;
  reset: () => void;
  nextWord: () => void;
  prevWord: () => void;
  restartList: () => void;
}

export const useWordsStore = create<WordsState>()(
  persist(
    (set, get) => ({
      words: [],
      order: [],
      currentIndex: 0,
      history: [],
      completed: false,

      importWords: (words) => {
        const order = shuffle(words.map((_, i) => i));
        set({ words, order, currentIndex: 0, history: [], completed: false });
      },

      reset: () => {
        set({
          words: [],
          order: [],
          currentIndex: 0,
          history: [],
          completed: false,
        });
      },

      nextWord: () => {
        const { currentIndex, order, history } = get();
        const nextIndex = currentIndex + 1;
        if (nextIndex >= order.length) {
          set({ completed: true });
        } else {
          set({
            history: [...history, currentIndex],
            currentIndex: nextIndex,
          });
        }
      },

      prevWord: () => {
        const { history } = get();
        if (history.length === 0) return;
        const newHistory = [...history];
        const prevIndex = newHistory.pop()!;
        set({ history: newHistory, currentIndex: prevIndex });
      },

      restartList: () => {
        const { words } = get();
        const order = shuffle(words.map((_, i) => i));
        set({ order, currentIndex: 0, history: [], completed: false });
      },
    }),
    {
      name: "words-storage",
    }
  )
);
