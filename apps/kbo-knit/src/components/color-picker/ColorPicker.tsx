import { ColorRow } from "@star-light/components/ColorRow";
import { Toggle } from "@star-light/components/Toggle";
import { Box } from "@star-light/components/Box";

import type { AppState } from "../../types/game.types";
import * as s from "./ColorPicker.css";

type ColorKey = keyof AppState["colors"];

type Props = {
  colors: AppState["colors"];
  awaySame: boolean;
  onAwaySameChange: (awaySame: boolean) => void;
  onColorChange: (key: ColorKey, value: string) => void;
};

export function ColorPicker({
  colors,
  awaySame,
  onAwaySameChange,
  onColorChange
}: Props) {
  return (
    <Box title="경기별 색상" className={s.group}>
      <div className={s.toggleRow}>
        <Toggle
          checked={!awaySame}
          onChange={(v: boolean) => onAwaySameChange(!v)}
          label="홈/원정 색상 분리"
        />
      </div>

      {awaySame ? (
        <>
          <ColorRow
            label="승"
            value={colors.homeWin}
            onChange={(c: string) => onColorChange("homeWin", c)}
          />
          <ColorRow
            label="무"
            value={colors.homeDraw}
            onChange={(c: string) => onColorChange("homeDraw", c)}
          />
          <ColorRow
            label="패"
            value={colors.homeLoss}
            onChange={(c: string) => onColorChange("homeLoss", c)}
          />
          <ColorRow
            label="취소"
            value={colors.homeCancel}
            onChange={(c: string) => onColorChange("homeCancel", c)}
          />
        </>
      ) : (
        <div className={s.splitRow}>
          <div className={s.section}>
            <h4 className={s.sectionLabel}>홈</h4>
            <ColorRow
              label="승"
              value={colors.homeWin}
              onChange={(c: string) => onColorChange("homeWin", c)}
            />
            <ColorRow
              label="무"
              value={colors.homeDraw}
              onChange={(c: string) => onColorChange("homeDraw", c)}
            />
            <ColorRow
              label="패"
              value={colors.homeLoss}
              onChange={(c: string) => onColorChange("homeLoss", c)}
            />
            <ColorRow
              label="취소"
              value={colors.homeCancel}
              onChange={(c: string) => onColorChange("homeCancel", c)}
            />
          </div>
          <div className={s.section}>
            <h4 className={s.sectionLabel}>원정</h4>
            <ColorRow
              label="승"
              value={colors.awayWin}
              onChange={(c: string) => onColorChange("awayWin", c)}
            />
            <ColorRow
              label="무"
              value={colors.awayDraw}
              onChange={(c: string) => onColorChange("awayDraw", c)}
            />
            <ColorRow
              label="패"
              value={colors.awayLoss}
              onChange={(c: string) => onColorChange("awayLoss", c)}
            />
            <ColorRow
              label="취소"
              value={colors.awayCancel}
              onChange={(c: string) => onColorChange("awayCancel", c)}
            />
          </div>
        </div>
      )}
    </Box>
  );
}
