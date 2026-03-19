import { chromium } from "playwright";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const KBO_URL = "https://www.koreabaseball.com/Schedule/Schedule.aspx";
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "data");

const TEAM_CODE_MAP = {
  삼성: "SAMSUNG",
  키움: "KIWOOM",
  LG: "LG",
  두산: "DOOSAN",
  KIA: "KIA",
  NC: "NC",
  한화: "HANWHA",
  SSG: "SSG",
  KT: "KT",
  롯데: "LOTTE"
};

const SERIES_MAP = {
  1: "PRESEASON",
  "0,9,6": "REGULAR_SEASON",
  "3,4,5,7": "POSTSEASON"
};

const toTeamCode = name => {
  const trimmed = name.trim();
  return (
    Object.entries(TEAM_CODE_MAP).find(([k]) => trimmed.includes(k))?.[1] ??
    trimmed
  );
};

const parseDate = (text, season) => {
  const m = text.match(/(\d+)\.(\d+)/);
  return m
    ? `${season}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`
    : null;
};

const makeGameKey = (date, away, home, n) =>
  `${date.replace(/-/g, "")}-${away}-${home}-${n}`;

const mergeGames = (existing, scraped) => {
  const scrapedKeys = new Set(scraped.map(g => g.gameKey));
  const kept = existing.filter(g => !scrapedKeys.has(g.gameKey));
  return [...kept, ...scraped].sort((a, b) => a.date.localeCompare(b.date));
};

const options = (page, sel) =>
  page.$$eval(`${sel} option`, os => os.map(o => o.value));

const select = async (page, sel, val) => {
  await page.selectOption(sel, val);
  await page.waitForTimeout(1500);
};

const parseTeams = async playCell => {
  const spans = await playCell.locator("> span, > a > span").allInnerTexts();
  if (spans.length >= 2) {
    return {
      away: toTeamCode(spans[0]),
      home: toTeamCode(spans[spans.length - 1])
    };
  }
  const parts = (await playCell.innerText())
    .replace(/\d+/g, "")
    .split("vs")
    .map(s => s.trim());
  return parts.length >= 2
    ? { away: toTeamCode(parts[0]), home: toTeamCode(parts[1]) }
    : null;
};

const parseScores = async playCell => {
  const spans = await playCell.locator("em > span").allInnerTexts();
  return spans.map(s => parseInt(s.trim())).filter(n => !isNaN(n));
};

const parseRow = async (row, season, seriesValue, state) => {
  if ((await row.locator("td.play").count()) === 0) {
    return null;
  }

  if ((await row.locator("td.day").count()) > 0) {
    state.date =
      parseDate(await row.locator("td.day").innerText(), season) ?? state.date;
  }
  if (!state.date) {
    return null;
  }

  const playCell = row.locator("td.play");
  const teams = await parseTeams(playCell);
  if (!teams) {
    return null;
  }

  const scores = await parseScores(playCell);
  const key = `${state.date.replace(/-/g, "")}-${teams.away}-${teams.home}`;
  const n = (state.counts[key] = (state.counts[key] ?? 0) + 1);

  return {
    gameKey: makeGameKey(state.date, teams.away, teams.home, n),
    seriesType: SERIES_MAP[seriesValue] ?? seriesValue,
    date: state.date,
    awayTeam: teams.away,
    homeTeam: teams.home,
    awayScore: scores[0] ?? null,
    homeScore: scores[1] ?? null
  };
};

const scrapeMonth = async (page, season, month, series) => {
  await select(page, "#ddlMonth", String(month).padStart(2, "0"));
  await select(page, "#ddlSeries", series);

  const state = { date: null, counts: {} };
  const games = [];
  for (const row of await page.locator("#tblScheduleList tbody tr").all()) {
    const game = await parseRow(row, season, series, state);
    if (game) {
      games.push(game);
    }
  }
  return games;
};

const scrapeCurrentMonth = async (page, season) => {
  await select(page, "#ddlYear", String(season));
  const seriesTypes = await options(page, "#ddlSeries");
  const currentMonth = new Date().getMonth() + 1;

  const games = [];
  for (const series of seriesTypes) {
    try {
      games.push(...(await scrapeMonth(page, season, currentMonth, series)));
    } catch {
      /* skip */
    }
  }
  return games;
};

const readExisting = path => {
  if (!existsSync(path)) {
    return [];
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8")).games ?? [];
  } catch {
    return [];
  }
};

const write = (path, season, games) => {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }
  writeFileSync(path, JSON.stringify({ season, games }, null, 2), "utf-8");
};

const main = async () => {
  const season = parseInt(process.argv[2]) || new Date().getFullYear();
  const outPath = join(OUT_DIR, `${season}.json`);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await (await browser.newContext()).newPage();
    await page.goto(KBO_URL, { waitUntil: "networkidle", timeout: 30000 });

    const scraped = await scrapeCurrentMonth(page, season);
    const existing = readExisting(outPath);
    const games = mergeGames(existing, scraped);
    write(outPath, season, games);
  } finally {
    await browser.close();
  }
};

main().catch(console.error);
