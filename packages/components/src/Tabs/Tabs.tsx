import React, { useRef } from "react";
import clsx from "clsx";

import * as styles from "./Tabs.css";

export type TabItem = {
  key: string;
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Tabs({
  items,
  activeKey,
  onChange,
  variant = "primary",
  className
}: TabsProps): React.ReactElement {
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const tabs =
        tabsRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs?.[nextIndex]?.focus();
      onChange(items[nextIndex].key);
    }
  };

  const activeItem = items.find(item => item.key === activeKey);

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div ref={tabsRef} role="tablist" className={styles.container[variant]}>
        {items.map((item, index) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            tabIndex={activeKey === item.key ? 0 : -1}
            className={clsx(
              styles.tab[variant],
              activeKey === item.key && styles.tabActive[variant]
            )}
            onClick={() => onChange(item.key)}
            onKeyDown={e => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {activeItem && (
        <div role="tabpanel" className={styles.panel}>
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
