import { Button } from "@star-light/components/Button";
import { Box } from "@star-light/components/Box";

import type { SeriesType } from "../../types/game.types";
import * as s from "./SeriesFilter.css";

type Props = {
  active: SeriesType[];
  onToggle: (series: SeriesType) => void;
};

const SERIES_OPTIONS: { value: SeriesType; label: string }[] = [
  { value: "PRESEASON", label: "시범" },
  { value: "REGULAR_SEASON", label: "정규" },
  { value: "POSTSEASON", label: "포스트" }
];

export function SeriesFilter({ active, onToggle }: Props) {
  return (
    <Box title="시리즈" className={s.group}>
      <div className={s.filters}>
        {SERIES_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            variant={active.includes(value) ? "primary" : "secondary"}
            className={s.btn}
            onClick={() => onToggle(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </Box>
  );
}
