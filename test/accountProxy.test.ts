// @vitest-environment node
import { IncomingMessage } from "node:http";
import { Socket } from "node:net";
import { describe, expect, it } from "vitest";
import {
  isAllowedProxyRequest,
  toLocalCookies,
  toUpstreamCookies
} from "../dev/accountProxy";

function request(
  path = "/api/auth/otp/request",
  method = "POST"
): IncomingMessage {
  const socket = new Socket();
  Object.defineProperty(socket, "remoteAddress", {
    value: "::1",
    configurable: true
  });
  const request = new IncomingMessage(socket);
  request.url = path;
  request.method = method;
  request.headers = { host: "localhost:5173", origin: "http://localhost:5173" };
  return request;
}

describe("local test account proxy boundary", () => {
  it("translates only auth cookies while retaining HttpOnly, SameSite and logout expiry", () => {
    expect(
      toLocalCookies([
        "__Host-iserlohn-session=session; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000",
        "__Host-iserlohn-preauth=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
        "unrelated=value; Secure"
      ])
    ).toEqual([
      "iserlohn-local-session=session; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000",
      "iserlohn-local-preauth=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
    ]);
    expect(
      toUpstreamCookies(
        "other-app=private; iserlohn-local-session=session; iserlohn-local-preauth=preauth; __Host-iserlohn-session=old"
      )
    ).toBe("__Host-iserlohn-session=session; __Host-iserlohn-preauth=preauth");
  });

  it("allows local login navigation, same-origin reads and CSRF-bearing writes", () => {
    const page = request("/auth?returnTo=kbo-knit-local", "GET");
    delete page.headers.origin;
    expect(isAllowedProxyRequest(page)).toBe(true);
    const read = request("/v1/me", "GET");
    delete read.headers.origin;
    read.headers.referer = "http://localhost:5173/";
    expect(isAllowedProxyRequest(read)).toBe(true);
    const write = request();
    write.headers["x-csrf-token"] = "session-bound-token";
    expect(isAllowedProxyRequest(write)).toBe(true);
  });

  it("rejects forged host, remote peers and cross-site requests before rewriting Origin", () => {
    const host = request();
    host.headers.host = "localhost.attacker.test:5173";
    expect(isAllowedProxyRequest(host)).toBe(false);
    const peer = request();
    Object.defineProperty(peer.socket, "remoteAddress", { value: "192.0.2.1" });
    expect(isAllowedProxyRequest(peer)).toBe(false);
    const origin = request();
    origin.headers.origin = "https://attacker.test";
    expect(isAllowedProxyRequest(origin)).toBe(false);
    const site = request("/auth", "GET");
    site.headers["sec-fetch-site"] = "cross-site";
    expect(isAllowedProxyRequest(site)).toBe(false);
  });

  it("rejects missing/null origins on writes and unbound API reads", () => {
    const write = request();
    delete write.headers.origin;
    expect(isAllowedProxyRequest(write)).toBe(false);
    write.headers.origin = "null";
    expect(isAllowedProxyRequest(write)).toBe(false);
    const read = request("/v1/me", "GET");
    delete read.headers.origin;
    expect(isAllowedProxyRequest(read)).toBe(false);
    read.headers.referer = "not a URL";
    expect(isAllowedProxyRequest(read)).toBe(false);
  });
});
