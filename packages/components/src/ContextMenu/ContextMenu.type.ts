export type ContextMenuItem = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
};

export type ContextMenuProps = {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose?: () => void;
};
