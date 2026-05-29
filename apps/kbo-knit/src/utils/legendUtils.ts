import type { ScarfColors } from "../types/game.types";

export type LegendItem = {
  label: string;
  color: string;
};

export function buildLegend(
  colors: ScarfColors,
  awaySame: boolean,
  showCancel: boolean = false
): LegendItem[] {
  const prefix = awaySame ? "" : "홈 ";
  const homeItems: LegendItem[] = [
    { label: `${prefix}승`, color: colors.home.win },
    { label: `${prefix}무`, color: colors.home.draw },
    { label: `${prefix}패`, color: colors.home.loss }
  ];
  if (showCancel) {
    homeItems.push({
      label: `${prefix}취소`,
      color: colors.home.cancel
    });
  }

  const awayItems: LegendItem[] = [
    { label: "원정 승", color: colors.away.win },
    { label: "원정 무", color: colors.away.draw },
    { label: "원정 패", color: colors.away.loss }
  ];
  if (showCancel) {
    awayItems.push({ label: "원정 취소", color: colors.away.cancel });
  }

  return awaySame ? homeItems : [...homeItems, ...awayItems];
}
