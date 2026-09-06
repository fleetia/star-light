import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://127.0.0.1:4173";
const screenshotDir = process.argv[3];
const api = "https://iserlohn.star-light.space";
const browser = await chromium.launch();

try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 }
  });
  const page = await context.newPage();
  await page.clock.install();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let account = null;
  const cloud = new Map();
  const writes = [];
  let unchangedReads = 0;
  await context.route(`${api}/**`, async route => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    const headers = {
      "access-control-allow-origin": new URL(origin).origin,
      "access-control-allow-credentials": "true",
      "access-control-allow-methods": "GET, PUT, POST, OPTIONS",
      "access-control-allow-headers":
        "content-type, x-csrf-token, x-account-sub, if-none-match",
      "access-control-expose-headers": "etag, x-server-time",
      "x-server-time": new Date().toISOString()
    };
    let status = 200;
    let body = {};
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers });
      return;
    }
    if (path === "/v1/me" && account) {
      body = {
        sub: account,
        email: `${account}@example.test`,
        supporter: true,
        grantedAt: new Date().toISOString(),
        csrfToken: "browser-csrf",
        serverTime: new Date().toISOString()
      };
    } else if (!account) {
      status = 401;
      body = { error: "Unauthorized" };
    } else if (path === "/api/auth/logout") {
      account = null;
      body = { ok: true };
    } else if (request.headers()["x-account-sub"] !== account) {
      status = 409;
      body = { error: "account_changed" };
    } else if (request.method() === "PUT") {
      assert.equal(request.headers()["x-csrf-token"], "browser-csrf");
      body = { ...request.postDataJSON(), updatedAt: new Date().toISOString() };
      writes.push({ account, body });
      cloud.set(account, body);
    } else {
      body = cloud.get(account) ?? { state: null };
      if (body.mutationId) {
        headers.etag = '"' + body.mutationId + '"';
        if (request.headers()["if-none-match"] === headers.etag) {
          unchangedReads += 1;
          await route.fulfill({ status: 304, headers });
          return;
        }
      }
    }
    await route.fulfill({
      status,
      headers,
      contentType: "application/json",
      body: JSON.stringify(body)
    });
  });
  await page.goto(origin);
  await page.getByRole("tab", { name: "옵션", exact: true }).click();
  const count = page.getByRole("spinbutton").first();
  await page.getByRole("link", { name: "로그인 / 가입" }).waitFor();
  assert.equal(
    await page
      .getByRole("link", { name: "로그인 / 가입" })
      .getAttribute("href"),
    `${api}/auth?returnTo=kbo-knit`
  );
  await count.fill("8");
  await count.blur();
  account = "account-a";
  await page.evaluate(() => {
    window.dispatchEvent(new Event("blur"));
    window.dispatchEvent(new Event("focus"));
  });
  await page
    .getByRole("status")
    .filter({ hasText: "클라우드에 저장했어요." })
    .waitFor();
  assert.equal(cloud.get("account-a").state.rowCount, 8);

  const initialWrites = writes.length;
  await page.clock.fastForward(60_000);
  await page
    .getByRole("status")
    .filter({ hasText: "클라우드에 저장했어요." })
    .waitFor();
  await page.clock.fastForward(60_000);
  await page.waitForFunction(() =>
    document
      .querySelector('[role="status"]')
      ?.textContent?.includes("클라우드에 저장했어요.")
  );
  assert.equal(writes.length, initialWrites);
  assert.ok(unchangedReads > 0);
  await count.fill("9");
  await count.blur();
  await page.clock.fastForward(2000);
  assert.equal(writes.length, initialWrites);
  await page.clock.fastForward(58_000);
  await page
    .getByRole("status")
    .filter({ hasText: "클라우드에 저장했어요." })
    .waitFor();
  assert.equal(cloud.get("account-a").state.rowCount, 9);

  await context.setOffline(true);
  await count.fill("6");
  await count.blur();
  await page.getByRole("status").filter({ hasText: "오프라인" }).waitFor();
  await context.setOffline(false);
  await page
    .getByRole("status")
    .filter({ hasText: "클라우드에 저장했어요." })
    .waitFor();
  assert.equal(cloud.get("account-a").state.rowCount, 6);

  cloud.set("account-b", {
    ...cloud.get("account-a"),
    state: { ...cloud.get("account-a").state, rowCount: 3 },
    mutationId: "remote-account-b"
  });
  account = "account-b";
  await page.evaluate(() => {
    window.dispatchEvent(new Event("blur"));
    window.dispatchEvent(new Event("focus"));
  });
  await page
    .getByText("account-b@example.test · 후원자", { exact: true })
    .waitFor();
  await page.waitForFunction(
    () => document.querySelector('input[type="number"]')?.value === "3"
  );
  assert.equal(writes.filter(write => write.account === "account-b").length, 0);
  if (screenshotDir) {
    await mkdir(screenshotDir, { recursive: true });
    await page.screenshot({
      path: join(screenshotDir, "cloud-desktop.png"),
      fullPage: true
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: join(screenshotDir, "cloud-mobile.png"),
      fullPage: true
    });
  }
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await page.getByRole("link", { name: "로그인 / 가입" }).waitFor();
  assert.equal(await count.inputValue(), "8");
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("kbo-knit:cloud:v2:user:account-a"))
          .state.rowCount
    ),
    6
  );
  assert.deepEqual(errors, []);
  console.log("Cloud sync browser verification passed (mocked account API)");
  await context.close();
} finally {
  await browser.close();
}
