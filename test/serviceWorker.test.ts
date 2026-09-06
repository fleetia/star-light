import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

type WorkerEvent = {
  request?: Request;
  respondWith?: (response: Promise<Response>) => void;
  waitUntil?: (work: Promise<unknown>) => void;
};

function worker(): {
  handlers: Record<string, (event: WorkerEvent) => void>;
  remove: ReturnType<typeof vi.fn>;
} {
  const handlers: Record<string, (event: WorkerEvent) => void> = {};
  const remove = vi
    .fn<(request: Request) => Promise<boolean>>()
    .mockResolvedValue(true);
  const cache = {
    keys: async () => [
      new Request("https://iserlohn.star-light.space/v1/me"),
      new Request("https://kbo-knit.star-light.space/api/auth/get-session"),
      new Request("https://kbo-knit.star-light.space/assets/app.js")
    ],
    delete: remove
  };
  runInNewContext(readFileSync(resolve("public/sw.js"), "utf8"), {
    URL,
    Response,
    self: {
      location: new URL("https://kbo-knit.star-light.space"),
      addEventListener: (
        name: string,
        callback: (event: WorkerEvent) => void
      ): void => {
        handlers[name] = callback;
      },
      clients: { claim: vi.fn() }
    },
    caches: { keys: async () => ["__BUILD_VERSION__"], open: async () => cache }
  });
  return { handlers, remove };
}

describe("service worker private response handling", () => {
  it("does not intercept cross-origin or account API requests", () => {
    const { handlers } = worker();
    const respondWith = vi.fn();
    for (const url of [
      "https://iserlohn.star-light.space/v1/state",
      "https://kbo-knit.star-light.space/v1/me",
      "https://kbo-knit.star-light.space/api/auth/get-session",
      "https://kbo-knit.star-light.space/account"
    ]) {
      handlers.fetch({ request: new Request(url), respondWith });
    }
    expect(respondWith).not.toHaveBeenCalled();
  });

  it("purges previously cached private responses during activation", async () => {
    const { handlers, remove } = worker();
    let work: Promise<unknown> | undefined;
    handlers.activate({
      waitUntil: promise => {
        work = promise;
      }
    });
    await work;
    expect(
      remove.mock.calls.map(([request]) => (request as Request).url)
    ).toEqual([
      "https://iserlohn.star-light.space/v1/me",
      "https://kbo-knit.star-light.space/api/auth/get-session"
    ]);
  });
});
