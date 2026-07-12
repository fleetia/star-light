import { describe, expect, it } from "vitest";
import { isCancelledGame } from "./scrape-kbo-utils.mjs";

describe("isCancelledGame", () => {
  it.each(["우천취소", "한파취소", "강설취소", "그라운드사정", "기타"])(
    "점수가 없고 취소 사유가 %s이면 취소로 판정한다",
    reason => {
      expect(isCancelledGame([], reason)).toBe(true);
    }
  );

  it.each(["", "-"])("상태가 %s이면 예정 경기로 판정한다", reason => {
    expect(isCancelledGame([], reason)).toBe(false);
  });

  it("점수가 있으면 상태 문구와 관계없이 취소가 아니다", () => {
    expect(isCancelledGame([3, 5], "기타")).toBe(false);
  });
});
