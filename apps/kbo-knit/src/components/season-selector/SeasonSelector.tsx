import { Box } from "@star-light/components/Box";
import { Select } from "@star-light/components/Select";

import { CURRENT_YEAR } from "../../constants/defaults";
import * as s from "./SeasonSelector.css";

type Props = {
  value: number;
  onChange: (season: number) => void;
};

const START_YEAR = 2025;
const YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

export function SeasonSelector({ value, onChange }: Props) {
  return (
    <Box title="시즌" className={s.group}>
      <Select
        value={String(value)}
        onChange={(v: string) => onChange(Number(v))}
        size="lg"
      >
        {YEARS.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </Box>
  );
}
