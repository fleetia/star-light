import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type UseFocusTrapOptions = {
  enabled: boolean;
  onEscape?: () => void;
  initialFocusSelector?: string;
};

export function useFocusTrap({
  enabled,
  onEscape,
  initialFocusSelector
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // Initial focus
    if (initialFocusSelector) {
      requestAnimationFrame(() => {
        const target =
          containerRef.current?.querySelector<HTMLElement>(
            initialFocusSelector
          );
        target?.focus();
      });
    } else {
      const focusable =
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }

      if (e.key === "Tab" && containerRef.current) {
        const focusable =
          containerRef.current.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR
          );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [enabled, onEscape, initialFocusSelector]);

  return containerRef;
}
