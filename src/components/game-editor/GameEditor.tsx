import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  DateField,
  Dialog,
  FormField,
  Select,
  TextField
} from "@fleetia/lagrange";

import type { Game, SeriesType, TeamCode } from "../../types/game.types";
import { TEAM_NAMES, TEAM_CODES } from "../../constants/teams";
import * as s from "./GameEditor.css";

type Props = {
  team: TeamCode;
  season: number;
  series: SeriesType[];
  games: Game[];
  customGames: Game[];
  onAdd: (game: Game) => void;
  onRemove: (gameKey: string) => void;
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}. ${Number(m)}. ${Number(d)}`;
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function GameEditor({
  team,
  season,
  series,
  games,
  customGames,
  onAdd,
  onRemove
}: Props) {
  const today = toISODate(new Date());

  const todayGame = useMemo(
    () =>
      games.find(
        g => g.date === today && (g.homeTeam === team || g.awayTeam === team)
      ),
    [games, team, today]
  );

  const defaultOpponent = todayGame
    ? todayGame.homeTeam === team
      ? todayGame.awayTeam
      : todayGame.homeTeam
    : "";
  const defaultIsHome = todayGame ? todayGame.homeTeam === team : true;
  const defaultSeries = todayGame?.seriesType ?? series[0] ?? "REGULAR_SEASON";

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(today);
  const [dateError, setDateError] = useState("");

  const handleDateChange = useCallback(
    (v: string) => {
      if (v < today) {
        setDateError("오늘 이전 날짜는 선택할 수 없습니다");
        setDate(today);
      } else {
        setDateError("");
        setDate(v);
      }
    },
    [today]
  );
  const [opponent, setOpponent] = useState<TeamCode | "">(defaultOpponent);
  const [isHome, setIsHome] = useState(defaultIsHome);
  const [myScore, setMyScore] = useState("");
  const [opScore, setOpScore] = useState("");
  const [seriesType, setSeriesType] = useState<SeriesType>(defaultSeries);
  const [isCancelled, setIsCancelled] = useState(false);

  const opponents = TEAM_CODES.filter(c => c !== team);
  const canSubmit =
    date !== "" &&
    date >= today &&
    opponent !== "" &&
    (isCancelled ||
      (myScore !== "" &&
        opScore !== "" &&
        !isNaN(Number(myScore)) &&
        !isNaN(Number(opScore))));

  function handleSubmit() {
    if (!canSubmit || !opponent) return;

    const homeTeam = isHome ? team : opponent;
    const awayTeam = isHome ? opponent : team;
    const gameKey = `custom-${date}-${awayTeam}-${homeTeam}-${Date.now()}`;

    if (isCancelled) {
      onAdd({
        gameKey,
        seriesType,
        date,
        homeTeam,
        awayTeam,
        homeScore: null,
        awayScore: null,
        status: "cancelled"
      });
    } else {
      const homeScore = isHome ? Number(myScore) : Number(opScore);
      const awayScore = isHome ? Number(opScore) : Number(myScore);
      onAdd({
        gameKey,
        seriesType,
        date,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore
      });
    }

    setMyScore("");
    setOpScore("");
    setIsCancelled(false);
  }

  const seasonGames = customGames.filter(g =>
    g.date.startsWith(String(season))
  );

  return (
    <>
      <Button
        variant="secondary"
        className={s.addButton}
        onClick={() => setIsOpen(true)}
      >
        + 경기 결과 미리 추가
      </Button>

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        closeLabel="닫기"
        title="경기 결과 미리 추가"
        size="small"
      >
        {isOpen && (
          <>
            <div className={s.form}>
              <FormField label="날짜" error={dateError}>
                <DateField
                  value={date}
                  min={today}
                  onChange={event => {
                    if (event.currentTarget.value) {
                      handleDateChange(event.currentTarget.value);
                    }
                  }}
                  onFocus={() => setDateError("")}
                />
              </FormField>

              <FormField label="상대 팀">
                <Select
                  value={opponent}
                  onChange={event =>
                    setOpponent(event.currentTarget.value as TeamCode)
                  }
                >
                  <option value="">선택</option>
                  {opponents.map(code => (
                    <option key={code} value={code}>
                      {TEAM_NAMES[code]}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="홈/원정">
                <Select
                  value={isHome ? "home" : "away"}
                  onChange={event =>
                    setIsHome(event.currentTarget.value === "home")
                  }
                >
                  <option value="home">홈</option>
                  <option value="away">원정</option>
                </Select>
              </FormField>

              <FormField label="시리즈">
                <Select
                  value={seriesType}
                  onChange={event =>
                    setSeriesType(event.currentTarget.value as SeriesType)
                  }
                >
                  <option value="PRESEASON">시범</option>
                  <option value="REGULAR_SEASON">정규</option>
                  <option value="POSTSEASON">포스트</option>
                </Select>
              </FormField>

              <Checkbox
                checked={isCancelled}
                onChange={event => setIsCancelled(event.currentTarget.checked)}
              >
                취소 경기로 추가
              </Checkbox>

              {!isCancelled && (
                <div className={s.row}>
                  <FormField label="내 팀 점수">
                    <TextField
                      type="number"
                      min={0}
                      value={myScore}
                      onChange={event => setMyScore(event.currentTarget.value)}
                    />
                  </FormField>
                  <FormField label="상대 점수">
                    <TextField
                      type="number"
                      min={0}
                      value={opScore}
                      onChange={event => setOpScore(event.currentTarget.value)}
                    />
                  </FormField>
                </div>
              )}

              <Button
                className={s.submitButton}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                추가
              </Button>
            </div>

            {seasonGames.length > 0 && (
              <>
                <hr className={s.divider} />
                <p className={s.sectionTitle}>
                  추가한 경기 ({seasonGames.length})
                </p>
                <div className={s.list}>
                  {seasonGames.map(g => {
                    const isHomeGame = g.homeTeam === team;
                    const opTeam = isHomeGame ? g.awayTeam : g.homeTeam;
                    const my = isHomeGame ? g.homeScore : g.awayScore;
                    const op = isHomeGame ? g.awayScore : g.homeScore;
                    const cancelled = g.status === "cancelled";
                    return (
                      <div key={g.gameKey} className={s.listItem}>
                        <div className={s.listInfo}>
                          <span>
                            {TEAM_NAMES[opTeam]}{" "}
                            {cancelled ? "취소" : `${my}:${op}`}{" "}
                            {isHomeGame ? "(홈)" : "(원정)"}
                          </span>
                          <span className={s.listDate}>
                            {formatDate(g.date)}
                          </span>
                        </div>
                        <Button
                          variant="quiet"
                          size="compact"
                          className={s.deleteButton}
                          onClick={() => onRemove(g.gameKey)}
                          aria-label={`${formatDate(g.date)} ${TEAM_NAMES[opTeam]} 경기 삭제`}
                        >
                          ×
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </Dialog>
    </>
  );
}
