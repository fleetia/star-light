import { useCallback, useMemo, useState } from "react";
import { Modal } from "@star-light/components/Modal";
import { TextInput } from "@star-light/components/TextInput";
import {
  Select,
  SelectLabel,
  SelectGroup
} from "@star-light/components/Select";

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
  const closeModal = useCallback(() => setIsOpen(false), []);
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

  const opponents = TEAM_CODES.filter(c => c !== team);
  const canSubmit =
    date !== "" &&
    date >= today &&
    opponent !== "" &&
    myScore !== "" &&
    opScore !== "" &&
    !isNaN(Number(myScore)) &&
    !isNaN(Number(opScore));

  function handleSubmit() {
    if (!canSubmit || !opponent) return;

    const homeTeam = isHome ? team : opponent;
    const awayTeam = isHome ? opponent : team;
    const homeScore = isHome ? Number(myScore) : Number(opScore);
    const awayScore = isHome ? Number(opScore) : Number(myScore);
    const gameKey = `custom-${date}-${awayTeam}-${homeTeam}-${Date.now()}`;

    onAdd({
      gameKey,
      seriesType,
      date,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore
    });

    setMyScore("");
    setOpScore("");
  }

  const seasonGames = customGames.filter(g =>
    g.date.startsWith(String(season))
  );

  return (
    <>
      <button className={s.addButton} onClick={() => setIsOpen(true)}>
        + 경기 결과 미리 추가
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="경기 결과 미리 추가"
        size="sm"
      >
        <div className={s.form}>
          <TextInput
            label="날짜"
            type="date"
            value={date}
            min={today}
            onChange={handleDateChange}
            onFocus={() => setDateError("")}
            error={dateError}
          />

          <SelectGroup>
            <SelectLabel>상대 팀</SelectLabel>
            <Select value={opponent} onChange={v => setOpponent(v as TeamCode)}>
              <option value="">선택</option>
              {opponents.map(code => (
                <option key={code} value={code}>
                  {TEAM_NAMES[code]}
                </option>
              ))}
            </Select>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>홈/원정</SelectLabel>
            <Select
              value={isHome ? "home" : "away"}
              onChange={v => setIsHome(v === "home")}
            >
              <option value="home">홈</option>
              <option value="away">원정</option>
            </Select>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel>시리즈</SelectLabel>
            <Select
              value={seriesType}
              onChange={v => setSeriesType(v as SeriesType)}
            >
              <option value="PRESEASON">시범</option>
              <option value="REGULAR_SEASON">정규</option>
              <option value="POSTSEASON">포스트</option>
            </Select>
          </SelectGroup>

          <div className={s.row}>
            <TextInput
              label="내 팀 점수"
              type="number"
              min={0}
              value={myScore}
              onChange={setMyScore}
            />
            <TextInput
              label="상대 점수"
              type="number"
              min={0}
              value={opScore}
              onChange={setOpScore}
            />
          </div>

          <button
            className={s.submitButton}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            추가
          </button>
        </div>

        {seasonGames.length > 0 && (
          <>
            <hr className={s.divider} />
            <p className={s.sectionTitle}>추가한 경기 ({seasonGames.length})</p>
            <div className={s.list}>
              {seasonGames.map(g => {
                const isHomeGame = g.homeTeam === team;
                const opTeam = isHomeGame ? g.awayTeam : g.homeTeam;
                const my = isHomeGame ? g.homeScore : g.awayScore;
                const op = isHomeGame ? g.awayScore : g.homeScore;
                return (
                  <div key={g.gameKey} className={s.listItem}>
                    <div className={s.listInfo}>
                      <span>
                        {TEAM_NAMES[opTeam]} {my}:{op}{" "}
                        {isHomeGame ? "(홈)" : "(원정)"}
                      </span>
                      <span className={s.listDate}>{formatDate(g.date)}</span>
                    </div>
                    <button
                      className={s.deleteButton}
                      onClick={() => onRemove(g.gameKey)}
                      aria-label="삭제"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
