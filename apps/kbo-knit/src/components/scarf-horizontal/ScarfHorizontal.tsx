import { Box } from "@star-light/components/Box";

import type { ScarfRow, ScarfColors, SeriesType } from "../../types/game.types";
import { buildLegend } from "../../utils/legendUtils";
import { Legend } from "../legend/Legend";
import * as s from "./ScarfHorizontal.css";

const REGULAR_SEASON_GAMES = 144;

type Props = {
  rows: ScarfRow[];
  colors: ScarfColors;
  awaySame: boolean;
  series: SeriesType[];
  showCancelLegend?: boolean;
};

export function ScarfHorizontal({
  rows,
  colors,
  awaySame,
  series,
  showCancelLegend
}: Props) {
  const legend = buildLegend(colors, awaySame, showCancelLegend);
  const hasRegular = series.includes("REGULAR_SEASON");
  const emptyCount = hasRegular
    ? Math.max(0, REGULAR_SEASON_GAMES - rows.length)
    : 0;

  return (
    <Box title="가로 미리보기" className={s.container}>
      <div className={s.scarf}>
        {rows.map(r => (
          <div
            key={r.rowKey}
            className={s.col}
            style={{ background: r.color }}
          />
        ))}
        {emptyCount > 0 &&
          Array.from({ length: emptyCount }, (_, i) => (
            <div key={`empty-${i}`} className={`${s.col} ${s.empty}`} />
          ))}
      </div>

      <Legend items={legend} />
    </Box>
  );
}
