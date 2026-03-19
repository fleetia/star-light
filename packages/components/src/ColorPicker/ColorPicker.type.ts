export type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  showAlpha?: boolean;
  align?: "left" | "right";
  className?: string;
};

export type DragTarget = "hue" | "triangle" | "alpha" | null;
