import { type RefObject, useEffect } from "react";

export function useViewportClamp(
  ref: RefObject<HTMLElement | null>,
  x: number,
  y: number
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      el.style.left = `${x - (rect.right - window.innerWidth)}px`;
    }
    if (rect.bottom > window.innerHeight) {
      el.style.top = `${y - (rect.bottom - window.innerHeight)}px`;
    }
  }, [ref, x, y]);
}
