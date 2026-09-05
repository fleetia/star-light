import { FieldGroup, Select } from "@fleetia/lagrange";

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
    <FieldGroup legend="시즌" className={s.group}>
      <Select
        value={String(value)}
        onChange={event => onChange(Number(event.currentTarget.value))}
        aria-label="시즌"
      >
        {YEARS.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </FieldGroup>
  );
}
