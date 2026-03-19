import type { LegendItem } from "../../utils/legendUtils";
import * as shared from "../../styles/shared.css";

type Props = {
  items: LegendItem[];
};

export function Legend({ items }: Props) {
  return (
    <div className={shared.legend}>
      {items.map(item => (
        <div key={item.label} className={shared.legendItem}>
          <div className={shared.swatch} style={{ background: item.color }} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
