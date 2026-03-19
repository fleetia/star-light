export type MarginValues = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type PositionGridProps = {
  value: string;
  options: string[];
  onChange: (pos: string) => void;
  margin?: MarginValues;
  onMarginChange?: (margin: MarginValues) => void;
};
