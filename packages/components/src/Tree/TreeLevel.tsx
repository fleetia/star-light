import React, { useState } from "react";
import clsx from "clsx";

import { useTranslation } from "../i18n";

import type { TreeLevelProps } from "./Tree.type";
import * as styles from "./Tree.css";

export function TreeLevel({
  items,
  parentId,
  depth,
  onToggle,
  onReorder,
  onVisibilityToggle,
  renderItem,
  firstItemId
}: TreeLevelProps): React.ReactElement {
  const { t } = useTranslation();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDrop = (toIndex: number) => {
    if (onReorder && dragIndex != null && dragIndex !== toIndex) {
      const ids = items.map(item => item.id);
      const [moved] = ids.splice(dragIndex, 1);
      ids.splice(toIndex, 0, moved);
      onReorder(parentId, ids);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div role="group">
      {items.map((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = item.expanded ?? false;
        const isVisible = item.visible ?? true;

        const defaultLabel = (
          <span className={styles.itemLabel}>{item.label}</span>
        );

        return (
          <div key={item.id}>
            <div
              role="treeitem"
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-label={item.label}
              data-item-id={item.id}
              data-has-children={hasChildren ? "true" : "false"}
              tabIndex={item.id === firstItemId ? 0 : -1}
              className={clsx(
                styles.row,
                onReorder && styles.rowDraggable,
                dragOverIndex === index && styles.rowDragOver,
                !isVisible && styles.rowHidden
              )}
              style={{ paddingLeft: `${(depth + 1) * 16}px` }}
              draggable={!!onReorder}
              onDragStart={() => setDragIndex(index)}
              onDragOver={e => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
              }}
            >
              {hasChildren ? (
                <button
                  className={styles.expandButton}
                  onClick={e => {
                    e.stopPropagation();
                    onToggle(item.id);
                  }}
                  tabIndex={-1}
                  aria-label={
                    isExpanded ? t("tree.collapse") : t("tree.expand")
                  }
                >
                  {isExpanded ? "\u25BC" : "\u25B6"}
                </button>
              ) : (
                <span className={styles.expandPlaceholder} />
              )}
              {renderItem ? renderItem(item, defaultLabel) : defaultLabel}
              {onVisibilityToggle && (
                <button
                  className={styles.actionButton}
                  onClick={e => {
                    e.stopPropagation();
                    onVisibilityToggle(item.id);
                  }}
                  tabIndex={-1}
                  title={isVisible ? t("tree.hide") : t("tree.show")}
                  aria-label={isVisible ? t("tree.hide") : t("tree.show")}
                >
                  {isVisible ? "\u25C9" : "\u25CE"}
                </button>
              )}
              {onReorder && (
                <span
                  className={styles.dragHandle}
                  title={t("tree.dragToReorder")}
                >
                  &#x2630;
                </span>
              )}
            </div>
            {hasChildren && isExpanded && (
              <TreeLevel
                items={item.children!}
                parentId={item.id}
                depth={depth + 1}
                onToggle={onToggle}
                onReorder={onReorder}
                onVisibilityToggle={onVisibilityToggle}
                renderItem={renderItem}
                firstItemId={firstItemId}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
