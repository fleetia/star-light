import { describe, it, expect } from "vitest";
import type { Game, ScarfColors, ScarfRow } from "../../types/game.types";
import {
  getGameResult,
  getTeamGames,
  buildScarfRows,
  expandScarfRows,
  countResults,
  getMatchupKey,
  getRealMatchups
} from "../gameUtils";

const makeGame = (overrides: Partial<Game> = {}): Game => ({
  gameKey: "g1",
  seriesType: "REGULAR_SEASON",
  date: "2026-03-28",
  awayTeam: "DOOSAN",
  homeTeam: "HANWHA",
  awayScore: 3,
  homeScore: 5,
  ...overrides
});

const colors: ScarfColors = {
  home: { win: "#ff0000", draw: "#888888", loss: "#000000", cancel: "#777777" },
  away: { win: "#0000ff", draw: "#cccccc", loss: "#333333", cancel: "#aaaaaa" }
};

describe("getGameResult", () => {
  it("홈 팀 승리", () => {
    const result = getGameResult(makeGame(), "HANWHA");
    expect(result).toEqual({
      isHome: true,
      result: "win",
      myScore: 5,
      opScore: 3
    });
  });

  it("원정 팀 패배", () => {
    const result = getGameResult(makeGame(), "DOOSAN");
    expect(result).toEqual({
      isHome: false,
      result: "loss",
      myScore: 3,
      opScore: 5
    });
  });

  it("무승부", () => {
    const game = makeGame({ awayScore: 2, homeScore: 2 });
    const result = getGameResult(game, "HANWHA");
    expect(result.result).toBe("draw");
  });
});

describe("getTeamGames", () => {
  const games = [
    makeGame({
      gameKey: "g1",
      date: "2026-03-28",
      homeTeam: "HANWHA",
      awayTeam: "DOOSAN"
    }),
    makeGame({
      gameKey: "g2",
      date: "2026-03-29",
      homeTeam: "LG",
      awayTeam: "KIA"
    }),
    makeGame({
      gameKey: "g3",
      date: "2026-03-30",
      homeTeam: "HANWHA",
      awayTeam: "LG",
      seriesType: "PRESEASON"
    })
  ];

  it("팀 코드로 필터", () => {
    const result = getTeamGames(games, "HANWHA", [
      "REGULAR_SEASON",
      "PRESEASON"
    ]);
    expect(result).toHaveLength(2);
  });

  it("시리즈 타입으로 필터", () => {
    const result = getTeamGames(games, "HANWHA", ["REGULAR_SEASON"]);
    expect(result).toHaveLength(1);
    expect(result[0].gameKey).toBe("g1");
  });

  it("스코어 없는 경기 제외", () => {
    const withNull = [
      ...games,
      makeGame({
        gameKey: "g4",
        homeTeam: "HANWHA",
        awayTeam: "SSG",
        awayScore: null,
        homeScore: null
      })
    ];
    const result = getTeamGames(withNull, "HANWHA", ["REGULAR_SEASON"]);
    expect(result.every(g => g.awayScore !== null)).toBe(true);
  });

  it("미진행 날짜(모든 경기 0:0) 제외", () => {
    const allZero = [
      makeGame({
        gameKey: "g1",
        date: "2026-04-01",
        homeTeam: "HANWHA",
        awayTeam: "DOOSAN",
        awayScore: 0,
        homeScore: 0
      }),
      makeGame({
        gameKey: "g2",
        date: "2026-04-01",
        homeTeam: "LG",
        awayTeam: "KIA",
        awayScore: 0,
        homeScore: 0
      })
    ];
    const result = getTeamGames(allZero, "HANWHA", ["REGULAR_SEASON"]);
    expect(result).toHaveLength(0);
  });

  it("날짜순 정렬", () => {
    const unordered = [
      makeGame({
        gameKey: "g2",
        date: "2026-04-02",
        homeTeam: "HANWHA",
        awayTeam: "LG"
      }),
      makeGame({
        gameKey: "g1",
        date: "2026-04-01",
        homeTeam: "HANWHA",
        awayTeam: "KIA"
      })
    ];
    const result = getTeamGames(unordered, "HANWHA", ["REGULAR_SEASON"]);
    expect(result[0].gameKey).toBe("g1");
  });
});

describe("buildScarfRows", () => {
  it("홈 승리 시 홈 승색 적용", () => {
    const games = [makeGame()];
    const rows = buildScarfRows(games, "HANWHA", colors);
    expect(rows[0].color).toBe("#ff0000");
    expect(rows[0].result).toBe("win");
    expect(rows[0].prefix).toBe("H");
  });

  it("원정 패배 시 원정 패색 적용", () => {
    const games = [makeGame()];
    const rows = buildScarfRows(games, "DOOSAN", colors);
    expect(rows[0].color).toBe("#333333");
    expect(rows[0].result).toBe("loss");
    expect(rows[0].prefix).toBe("A");
  });

  it("상대팀 이름 변환", () => {
    const games = [makeGame()];
    const rows = buildScarfRows(games, "HANWHA", colors);
    expect(rows[0].opponent).toBe("두산 베어스");
  });
});

describe("expandScarfRows", () => {
  const baseRows: ScarfRow[] = [
    {
      gameKey: "g1",
      rowKey: "g1",
      color: "#ff0000",
      result: "win",
      isHome: true,
      date: "2026-03-28",
      opponent: "두산",
      score: "5:3",
      prefix: "H"
    },
    {
      gameKey: "g2",
      rowKey: "g2",
      color: "#000000",
      result: "loss",
      isHome: true,
      date: "2026-03-29",
      opponent: "LG",
      score: "1:4",
      prefix: "H"
    }
  ];

  it("perGame count=1이면 원본 반환", () => {
    const result = expandScarfRows(baseRows, "perGame", 1);
    expect(result).toBe(baseRows);
  });

  it("perGame count=3이면 각 3배", () => {
    const result = expandScarfRows(baseRows, "perGame", 3);
    expect(result).toHaveLength(6);
    expect(result[0].rowKey).toBe("g1-0");
    expect(result[2].rowKey).toBe("g1-2");
    expect(result[3].rowKey).toBe("g2-0");
  });

  it("perScore: 득점 기준", () => {
    const result = expandScarfRows(baseRows, "perScore", 1);
    expect(result).toHaveLength(5 + 1); // 5점 + 1점
  });

  it("perOpScore: 이기면 득점, 지면 실점", () => {
    const result = expandScarfRows(baseRows, "perOpScore", 1);
    // g1: win 5:3 → max(5,3) = 5
    // g2: loss 1:4 → max(1,4) = 4
    expect(result).toHaveLength(5 + 4);
  });

  it("perDiff: 점수차이 기준", () => {
    const result = expandScarfRows(baseRows, "perDiff", 1);
    // g1: |5-3| = 2, g2: |1-4| = 3
    expect(result).toHaveLength(2 + 3);
  });

  it("최소 1단 보장", () => {
    const zeroRow: ScarfRow[] = [
      {
        ...baseRows[0],
        score: "0:0",
        result: "draw"
      }
    ];
    const result = expandScarfRows(zeroRow, "perScore", 1);
    expect(result).toHaveLength(1);
  });
});

describe("countResults", () => {
  it("승무패 집계", () => {
    const rows: ScarfRow[] = [
      {
        gameKey: "1",
        rowKey: "1",
        color: "",
        result: "win",
        isHome: true,
        date: "",
        opponent: "",
        score: "",
        prefix: "H"
      },
      {
        gameKey: "2",
        rowKey: "2",
        color: "",
        result: "win",
        isHome: true,
        date: "",
        opponent: "",
        score: "",
        prefix: "H"
      },
      {
        gameKey: "3",
        rowKey: "3",
        color: "",
        result: "loss",
        isHome: true,
        date: "",
        opponent: "",
        score: "",
        prefix: "H"
      },
      {
        gameKey: "4",
        rowKey: "4",
        color: "",
        result: "draw",
        isHome: true,
        date: "",
        opponent: "",
        score: "",
        prefix: "H"
      }
    ];
    expect(countResults(rows)).toEqual({
      wins: 2,
      draws: 1,
      losses: 1,
      cancels: 0
    });
  });

  it("빈 배열", () => {
    expect(countResults([])).toEqual({
      wins: 0,
      draws: 0,
      losses: 0,
      cancels: 0
    });
  });

  it("취소 경기 카운트", () => {
    const rows: ScarfRow[] = [
      {
        gameKey: "1",
        rowKey: "1",
        color: "",
        result: "cancel",
        isHome: true,
        date: "",
        opponent: "",
        score: "취소",
        prefix: "H"
      }
    ];
    expect(countResults(rows)).toEqual({
      wins: 0,
      draws: 0,
      losses: 0,
      cancels: 1
    });
  });
});

describe("취소 경기", () => {
  const cancelGame = makeGame({
    gameKey: "c1",
    awayScore: null,
    homeScore: null,
    status: "cancelled"
  });

  it("getTeamGames에 취소 경기 포함", () => {
    const result = getTeamGames([cancelGame], "HANWHA", ["REGULAR_SEASON"]);
    expect(result).toHaveLength(1);
  });

  it("buildScarfRows: result는 cancel, score는 '취소'", () => {
    const rows = buildScarfRows([cancelGame], "HANWHA", colors);
    expect(rows[0].result).toBe("cancel");
    expect(rows[0].score).toBe("취소");
    expect(rows[0].color).toBe("#777777");
  });

  it("expandScarfRows: cancelRowCount만큼 반복", () => {
    const rows = buildScarfRows([cancelGame], "HANWHA", colors);
    expect(expandScarfRows(rows, "perGame", 1, 0)).toHaveLength(0);
    expect(expandScarfRows(rows, "perGame", 1, 3)).toHaveLength(3);
  });
});

describe("getMatchupKey / getRealMatchups", () => {
  it("매치업 키 생성", () => {
    const game = makeGame();
    expect(getMatchupKey(game)).toBe("2026-03-28-DOOSAN-HANWHA");
  });

  it("유효 스코어 경기만 포함", () => {
    const games = [
      makeGame({ gameKey: "g1" }),
      makeGame({ gameKey: "g2", awayScore: null, homeScore: null })
    ];
    const matchups = getRealMatchups(games);
    expect(matchups.size).toBe(1);
  });
});
