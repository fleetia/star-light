import type React from "react";

export type TreeItem = {
  id: string;
  label: string;
  children?: TreeItem[];
  expanded?: boolean;
  visible?: boolean;
};

export type TreeProps = {
  items: TreeItem[];
  onToggle: (id: string) => void;
  onReorder?: (parentId: string | null, orderedIds: string[]) => void;
  onVisibilityToggle?: (id: string) => void;
  renderItem?: (
    item: TreeItem,
    defaultLabel: React.ReactNode
  ) => React.ReactNode;
  className?: string;
};

export type TreeLevelProps = {
  items: TreeItem[];
  parentId: string | null;
  depth: number;
  onToggle: (id: string) => void;
  onReorder?: (parentId: string | null, orderedIds: string[]) => void;
  onVisibilityToggle?: (id: string) => void;
  renderItem?: (
    item: TreeItem,
    defaultLabel: React.ReactNode
  ) => React.ReactNode;
  firstItemId?: string;
};
