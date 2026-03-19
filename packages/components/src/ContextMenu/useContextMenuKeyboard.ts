import React, { useEffect, useRef } from "react";

export function useContextMenuKeyboard(onClose?: () => void) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-focus first item
  useEffect(() => {
    const firstItem =
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const focusable =
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!focusable || focusable.length === 0) return;

    const focusableItems = Array.from(focusable);
    const currentIndex = focusableItems.indexOf(
      document.activeElement as HTMLElement
    );

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = (currentIndex + 1) % focusableItems.length;
        focusableItems[next].focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev =
          (currentIndex - 1 + focusableItems.length) % focusableItems.length;
        focusableItems[prev].focus();
        break;
      }
      case "Home":
        e.preventDefault();
        focusableItems[0].focus();
        break;
      case "End":
        e.preventDefault();
        focusableItems[focusableItems.length - 1].focus();
        break;
      case "Escape":
        e.preventDefault();
        onClose?.();
        break;
      case "Enter": {
        e.preventDefault();
        if (currentIndex >= 0) {
          focusableItems[currentIndex].click();
        }
        break;
      }
    }
  };

  return { menuRef, handleKeyDown };
}
