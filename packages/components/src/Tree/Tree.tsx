import React, { useRef, useCallback } from "react";
import clsx from "clsx";

import type { TreeItem, TreeProps } from "./Tree.type";
import { TreeLevel } from "./TreeLevel";
import * as styles from "./Tree.css";

export type { TreeItem, TreeProps };

export function Tree({
  items,
  onToggle,
  onReorder,
  onVisibilityToggle,
  renderItem,
  className
}: TreeProps): React.ReactElement {
  const treeRef = useRef<HTMLDivElement>(null);

  const handleTreeKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const row = target.closest<HTMLElement>('[role="treeitem"]');
      if (!row) return;

      const allRows =
        treeRef.current?.querySelectorAll<HTMLElement>('[role="treeitem"]');
      if (!allRows) return;

      const rowArray = Array.from(allRows);
      const currentIndex = rowArray.indexOf(row);
      if (currentIndex === -1) return;

      const itemId = row.dataset.itemId;
      const hasChildren = row.dataset.hasChildren === "true";
      const isExpanded = row.getAttribute("aria-expanded") === "true";

      let handled = true;

      switch (e.key) {
        case "ArrowDown": {
          const next = rowArray[currentIndex + 1];
          next?.focus();
          break;
        }
        case "ArrowUp": {
          const prev = rowArray[currentIndex - 1];
          prev?.focus();
          break;
        }
        case "ArrowRight":
          if (hasChildren && !isExpanded && itemId) {
            onToggle(itemId);
          } else if (hasChildren && isExpanded) {
            const next = rowArray[currentIndex + 1];
            next?.focus();
          }
          break;
        case "ArrowLeft":
          if (hasChildren && isExpanded && itemId) {
            onToggle(itemId);
          } else {
            const prev = rowArray[currentIndex - 1];
            prev?.focus();
          }
          break;
        case "Home":
          rowArray[0]?.focus();
          break;
        case "End":
          rowArray[rowArray.length - 1]?.focus();
          break;
        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
      }
    },
    [onToggle]
  );

  return (
    <div
      ref={treeRef}
      role="tree"
      className={clsx(styles.tree, className)}
      onKeyDown={handleTreeKeyDown}
    >
      <TreeLevel
        items={items}
        parentId={null}
        depth={0}
        onToggle={onToggle}
        onReorder={onReorder}
        onVisibilityToggle={onVisibilityToggle}
        renderItem={renderItem}
        firstItemId={items[0]?.id}
      />
    </div>
  );
}
