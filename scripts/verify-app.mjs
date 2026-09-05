import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://127.0.0.1:4173";
const screenshotDir = process.argv[3];
const browser = await chromium.launch();

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    timezoneId: "Asia/Seoul"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.clock.setFixedTime(new Date("2026-09-05T12:00:00+09:00"));
  await page.goto(url);
  await page.getByRole("tab", { name: "옵션", exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("tab", { name: "옵션", exact: true })
      .getAttribute("aria-selected"),
    "true"
  );
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return ["--c-accent", "--c-surface", "--c-text"].map(key =>
      style.getPropertyValue(key).trim()
    );
  });
  assert.deepEqual(tokens, ["#000", "#fff", "#000"]);

  if (screenshotDir) {
    await mkdir(screenshotDir, { recursive: true });
    await page.screenshot({
      path: join(screenshotDir, "desktop-options.png"),
      fullPage: true
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: join(screenshotDir, "mobile-options.png"),
      fullPage: true
    });
    await page.setViewportSize({ width: 1280, height: 900 });
  }

  await page.getByRole("combobox").nth(0).selectOption("2025");
  await page
    .getByRole("button", { name: "+ 경기 결과 미리 추가", exact: true })
    .waitFor();
  await page.getByRole("combobox").nth(1).selectOption("SAMSUNG");
  await page.getByRole("combobox").nth(0).selectOption("2026");
  await page
    .getByRole("button", { name: "+ 경기 결과 미리 추가", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: /^#[0-9a-f]{6}$/i })
    .first()
    .click();
  const colorPicker = page.getByRole("dialog", {
    name: "Color picker",
    exact: true
  });
  await colorPicker.getByRole("textbox").fill("#ff0000");
  await page
    .getByLabel("Close color picker", { exact: true })
    .click({ position: { x: 1, y: 1 } });
  await page.getByRole("button", { name: "#ff0000", exact: true }).waitFor();

  await page
    .getByRole("button", { name: "+ 경기 결과 미리 추가", exact: true })
    .click();
  const editor = page.getByRole("dialog", {
    name: "경기 결과 미리 추가",
    exact: true
  });
  await editor
    .locator('input[type="date"]')
    .fill("2026-09-06", { force: true });
  await editor.getByRole("combobox").nth(0).selectOption("LG");
  await editor.getByLabel("내 팀 점수", { exact: true }).fill("5");
  await editor.getByLabel("상대 점수", { exact: true }).fill("3");
  await editor.getByRole("button", { name: "추가", exact: true }).click();
  await editor.getByText("추가한 경기 (1)", { exact: true }).waitFor();
  await editor.getByText("2026. 9. 6", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await editor.waitFor({ state: "hidden" });

  await page.getByRole("tab", { name: "단수 카운터", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "이전 단", exact: true })
      .isDisabled(),
    true
  );
  await page
    .getByRole("button", { name: "다음 단", exact: true })
    .last()
    .click();
  await page.waitForFunction(
    () =>
      Object.values(
        JSON.parse(localStorage.getItem("kbo-knit")).checked
      ).filter(Boolean).length === 1
  );
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("kbo-knit"))
  );
  assert.equal(saved.season, 2026);
  assert.equal(saved.team, "SAMSUNG");
  assert.equal(saved.colors.homeWin, "#ff0000");
  assert.equal(saved.customGames[0].date, "2026-09-06");

  await page.reload();
  await page.getByRole("button", { name: "이전 단", exact: true }).waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "이전 단", exact: true })
      .isEnabled(),
    true
  );
  assert.deepEqual(
    await page.evaluate(() => JSON.parse(localStorage.getItem("kbo-knit"))),
    saved
  );
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "이전 단", exact: true }).waitFor();
  assert.deepEqual(
    await page.evaluate(() => JSON.parse(localStorage.getItem("kbo-knit"))),
    saved
  );
  assert.equal(
    await page
      .getByRole("button", { name: "이전 단", exact: true })
      .isEnabled(),
    true
  );
  assert.deepEqual(errors, []);
  console.log(
    "App smoke verified: selection, color, date/game editor, progress persistence, CSS tokens, offline reload."
  );
} finally {
  await browser.close();
}
