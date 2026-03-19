import React from "react";
import { clsx } from "clsx";

import type { ContextMenuItem, ContextMenuProps } from "./ContextMenu.type";
import { useContextMenuKeyboard } from "./useContextMenuKeyboard";
import { useViewportClamp } from "./useViewportClamp";
import * as styles from "./ContextMenu.css";

export type { ContextMenuItem, ContextMenuProps };

function ContextMenu({
  x,
  y,
  items,
  onClose
}: ContextMenuProps): React.ReactElement {
  const { menuRef, handleKeyDown } = useContextMenuKeyboard(onClose);
  useViewportClamp(menuRef, x, y);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ left: x, top: y }}
      role="menu"
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => (
        <button
          key={index}
          role="menuitem"
          tabIndex={-1}
          onClick={() => {
            item.onClick();
            onClose?.();
          }}
          className={clsx(
            styles.contextMenuItem,
            item.variant === "danger" && styles.deleteVariant
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export { ContextMenu };
