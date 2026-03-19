import { Box } from "@star-light/components/Box";
import { Select } from "@star-light/components/Select";

import type { TeamCode } from "../../types/game.types";
import { TEAM_CODES, TEAM_NAMES } from "../../constants/teams";
import * as s from "./TeamSelector.css";

type Props = {
  value: TeamCode;
  onChange: (team: TeamCode) => void;
};

export function TeamSelector({ value, onChange }: Props) {
  return (
    <Box title="팀 선택" className={s.group}>
      <Select
        value={value}
        onChange={(v: string) => onChange(v as TeamCode)}
        size="lg"
      >
        {TEAM_CODES.map(code => (
          <option key={code} value={code}>
            {TEAM_NAMES[code]}
          </option>
        ))}
      </Select>
    </Box>
  );
}
