import { RefObject, useEffect } from "react";

interface UseScrollAndSwipeNavigationOptions<T extends HTMLElement> {
  containerRef: RefObject<T | null>;
  cellWidth: number;
  onNext: () => void;
  onPrev: () => void;
  wheelThresholdRatio?: number;
  swipeThreshold?: number;
}

export function useScrollAndSwipeNavigation<T extends HTMLElement>({
  containerRef,
  cellWidth,
  onNext,
  onPrev,
  wheelThresholdRatio = 0.5,
  swipeThreshold = 50,
}: UseScrollAndSwipeNavigationOptions<T>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ---------- WHEEL ---------- */
    let accumulatedDelta = 0;
    const threshold = cellWidth * wheelThresholdRatio;
    let scrollResetTimeout: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (delta !== 0) e.preventDefault();

      accumulatedDelta += delta;

      if (scrollResetTimeout) clearTimeout(scrollResetTimeout);

      scrollResetTimeout = window.setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      if (Math.abs(accumulatedDelta) >= threshold) {
        if (accumulatedDelta > 0) {
          onNext();
        } else {
          onPrev();
        }
        accumulatedDelta = 0;
      }
    };

    /* ---------- TOUCH ---------- */
    let touchStartX = 0;
    let touchEndX = 0;
    let didMove = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchEndX = touchStartX;
      didMove = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
      didMove = true;
    };
    const handleTouchEnd = () => {
      if (!didMove) return;

      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) >= swipeThreshold) {
        if (diff > 0) {
          onNext();
        } else {
          onPrev();
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);

      if (scrollResetTimeout) clearTimeout(scrollResetTimeout);
    };
  }, [
    containerRef,
    cellWidth,
    onNext,
    onPrev,
    wheelThresholdRatio,
    swipeThreshold,
  ]);
}
