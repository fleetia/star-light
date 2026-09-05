import { FieldGroup, Select } from "@fleetia/lagrange";

import type { TeamCode } from "../../types/game.types";
import { TEAM_CODES, TEAM_NAMES } from "../../constants/teams";
import * as s from "./TeamSelector.css";

type Props = {
  value: TeamCode;
  onChange: (team: TeamCode) => void;
};

export function TeamSelector({ value, onChange }: Props) {
  return (
    <FieldGroup legend="팀 선택" className={s.group}>
      <Select
        value={value}
        onChange={event => onChange(event.currentTarget.value as TeamCode)}
        aria-label="팀 선택"
      >
        {TEAM_CODES.map(code => (
          <option key={code} value={code}>
            {TEAM_NAMES[code]}
          </option>
        ))}
      </Select>
    </FieldGroup>
  );
}
