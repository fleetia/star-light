import {
  ColorPicker as ColorControl,
  FieldGroup,
  Switch
} from "@fleetia/lagrange";

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
    <FieldGroup legend="경기별 색상" className={s.group}>
      <div className={s.toggleRow}>
        <Switch
          checked={!awaySame}
          onChange={event => onAwaySameChange(!event.currentTarget.checked)}
        >
          홈/원정 색상 분리
        </Switch>
      </div>

      {awaySame ? (
        <>
          <div className={s.colorRow}>
            <span>승</span>
            <ColorControl
              label="승"
              value={colors.homeWin}
              onValueChange={color => onColorChange("homeWin", color)}
            />
          </div>
          <div className={s.colorRow}>
            <span>무</span>
            <ColorControl
              label="무"
              value={colors.homeDraw}
              onValueChange={color => onColorChange("homeDraw", color)}
            />
          </div>
          <div className={s.colorRow}>
            <span>패</span>
            <ColorControl
              label="패"
              value={colors.homeLoss}
              onValueChange={color => onColorChange("homeLoss", color)}
            />
          </div>
          <div className={s.colorRow}>
            <span>취소</span>
            <ColorControl
              label="취소"
              value={colors.homeCancel}
              onValueChange={color => onColorChange("homeCancel", color)}
            />
          </div>
        </>
      ) : (
        <div className={s.splitRow}>
          <div className={s.section}>
            <h4 className={s.sectionLabel}>홈</h4>
            <div className={s.colorRow}>
              <span>승</span>
              <ColorControl
                label="홈 승"
                value={colors.homeWin}
                onValueChange={color => onColorChange("homeWin", color)}
              />
            </div>
            <div className={s.colorRow}>
              <span>무</span>
              <ColorControl
                label="홈 무"
                value={colors.homeDraw}
                onValueChange={color => onColorChange("homeDraw", color)}
              />
            </div>
            <div className={s.colorRow}>
              <span>패</span>
              <ColorControl
                label="홈 패"
                value={colors.homeLoss}
                onValueChange={color => onColorChange("homeLoss", color)}
              />
            </div>
            <div className={s.colorRow}>
              <span>취소</span>
              <ColorControl
                label="홈 취소"
                value={colors.homeCancel}
                onValueChange={color => onColorChange("homeCancel", color)}
              />
            </div>
          </div>
          <div className={s.section}>
            <h4 className={s.sectionLabel}>원정</h4>
            <div className={s.colorRow}>
              <span>승</span>
              <ColorControl
                label="원정 승"
                value={colors.awayWin}
                onValueChange={color => onColorChange("awayWin", color)}
              />
            </div>
            <div className={s.colorRow}>
              <span>무</span>
              <ColorControl
                label="원정 무"
                value={colors.awayDraw}
                onValueChange={color => onColorChange("awayDraw", color)}
              />
            </div>
            <div className={s.colorRow}>
              <span>패</span>
              <ColorControl
                label="원정 패"
                value={colors.awayLoss}
                onValueChange={color => onColorChange("awayLoss", color)}
              />
            </div>
            <div className={s.colorRow}>
              <span>취소</span>
              <ColorControl
                label="원정 취소"
                value={colors.awayCancel}
                onValueChange={color => onColorChange("awayCancel", color)}
              />
            </div>
          </div>
        </div>
      )}
    </FieldGroup>
  );
}
