"use client";

import { useCallback, useRef, useState } from "react";
import { useWordsStore } from "@/store/useWordsStore";

const SWIPE_THRESHOLD = 60;

export default function Flashcard() {
  const { words, order, currentIndex, history, reversed, nextWord, prevWord } =
    useWordsStore();

  const [flipped, setFlipped] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const mouseStart = useRef<number | null>(null);

  const wordIndex = order[currentIndex];
  const word = words[wordIndex];
  const progress = currentIndex + 1;
  const total = order.length;

  const handleSwipeComplete = useCallback(
    (dir: "left" | "right") => {
      setExitDir(dir);
      setTimeout(() => {
        if (dir === "left") {
          nextWord();
        } else {
          prevWord();
        }
        setFlipped(false);
        setSwipeX(0);
        setExitDir(null);
      }, 200);
    },
    [nextWord, prevWord]
  );

  const applyDampen = (dx: number) => {
    // Dampen right swipe when no history (can't go back)
    if (dx > 0 && history.length === 0) return dx * 0.2;
    return dx;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    setSwipeX(applyDampen(dx));
  };

  const onTouchEnd = () => {
    setSwiping(false);
    if (swipeX < -SWIPE_THRESHOLD) {
      handleSwipeComplete("left");
    } else if (swipeX > SWIPE_THRESHOLD && history.length > 0) {
      handleSwipeComplete("right");
    } else {
      setSwipeX(0);
    }
    touchStart.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    mouseStart.current = e.clientX;
    setSwiping(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseStart.current === null) return;
    const dx = e.clientX - mouseStart.current;
    setSwipeX(applyDampen(dx));
  };

  const onMouseUp = () => {
    setSwiping(false);
    if (mouseStart.current === null) return;
    if (swipeX < -SWIPE_THRESHOLD) {
      handleSwipeComplete("left");
    } else if (swipeX > SWIPE_THRESHOLD && history.length > 0) {
      handleSwipeComplete("right");
    } else {
      setSwipeX(0);
    }
    mouseStart.current = null;
  };

  const onMouseLeave = () => {
    if (mouseStart.current !== null) {
      setSwiping(false);
      setSwipeX(0);
      mouseStart.current = null;
    }
  };

  const handleClick = () => {
    if (Math.abs(swipeX) < 5) {
      setFlipped((f) => !f);
    }
  };

  if (!word) return null;

  const frontLabel = reversed ? "Russian" : "Polish";
  const backLabel = reversed ? "Polish" : "Russian";
  const frontText = reversed ? word.russian : word.polish;
  const backText = reversed ? word.polish : word.russian;

  const exitTransform =
    exitDir === "right"
      ? "translateX(120vw) rotate(15deg)"
      : exitDir === "left"
      ? "translateX(-120vw) rotate(-15deg)"
      : undefined;

  const rotation = (swipeX / 600) * 10;
  const opacity = exitDir ? 0 : 1 - Math.abs(swipeX) / 800;

  return (
    <div className="flex flex-col items-center gap-6 w-full select-none">
      {/* Progress */}
      <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          {progress} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(progress / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-72 h-96 sm:w-80 sm:h-[28rem] cursor-pointer"
        style={{
          perspective: "1200px",
          transform: exitTransform ?? `translateX(${swipeX}px) rotate(${rotation}deg)`,
          opacity,
          transition: swiping ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 px-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
              {frontLabel}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-center break-words leading-tight">
              {frontText}
            </span>
            <span className="text-xs text-zinc-400 mt-6">Tap to flip</span>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl px-6"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs uppercase tracking-widest text-blue-200 mb-4">
              {backLabel}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-center break-words leading-tight">
              {backText}
            </span>
            <span className="text-xs text-blue-200 mt-6">Tap to flip back</span>
          </div>
        </div>
      </div>

      {/* Swipe hints */}
      <div className="flex justify-between w-72 sm:w-80 text-xs text-zinc-400">
        <span>&larr; Next</span>
        <span className={history.length === 0 ? "opacity-30" : ""}>
          Previous &rarr;
        </span>
      </div>
    </div>
  );
}
