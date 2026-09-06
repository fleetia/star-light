import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

const LOCAL_ORIGIN = "http://localhost:5173";
const TEST_ORIGIN = "https://iserlohn-test.star-light.space";
const PROXY_PATH =
  "^/(auth|account|privacy|terms)([/?]|$)|^/(api/auth/|v1/|assets/)";
const SESSION_COOKIES = [
  ["__Host-iserlohn-session", "iserlohn-local-session"],
  ["__Host-iserlohn-preauth", "iserlohn-local-preauth"]
] as const;

export function toUpstreamCookies(header: string): string {
  return header
    .split(";")
    .flatMap(value => {
      const cookie = value.trim();
      const names = SESSION_COOKIES.find(([, local]) =>
        cookie.startsWith(`${local}=`)
      );
      return names ? [`${names[0]}=${cookie.slice(names[1].length + 1)}`] : [];
    })
    .join("; ");
}

export function toLocalCookies(headers: string[]): string[] {
  return headers.flatMap(cookie => {
    const names = SESSION_COOKIES.find(([upstream]) =>
      cookie.startsWith(`${upstream}=`)
    );
    return names
      ? [
          `${names[1]}=${cookie.slice(names[0].length + 1)}`.replace(
            /;\s*Secure(?=;|$)/gi,
            ""
          )
        ]
      : [];
  });
}

function hasLocalReferer(referer: string | undefined): boolean {
  try {
    return !!referer && new URL(referer).origin === LOCAL_ORIGIN;
  } catch {
    return false;
  }
}

export function isAllowedProxyRequest(request: IncomingMessage): boolean {
  if (
    request.headers.host !== "localhost:5173" ||
    !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
      request.socket.remoteAddress ?? ""
    ) ||
    (request.headers.origin !== undefined &&
      request.headers.origin !== LOCAL_ORIGIN) ||
    request.headers["sec-fetch-site"] === "cross-site"
  ) {
    return false;
  }
  const isApi = /^\/(api\/auth\/|v1\/)/.test(request.url ?? "");
  if (!isApi) return request.method === "GET" || request.method === "HEAD";
  if (request.method === "GET") {
    return (
      request.headers.origin === LOCAL_ORIGIN ||
      hasLocalReferer(request.headers.referer)
    );
  }
  return request.headers.origin === LOCAL_ORIGIN;
}

export function localAccountProxy(): Plugin {
  return {
    name: "local-test-account-proxy",
    apply: "serve",
    config(_config, environment) {
      if (environment.isPreview) return;
      return {
        server: {
          host: "localhost",
          port: 5173,
          strictPort: true,
          cors: false,
          proxy: {
            [PROXY_PATH]: {
              target: TEST_ORIGIN,
              changeOrigin: true,
              headers: {
                origin: TEST_ORIGIN,
                referer: `${TEST_ORIGIN}/auth`,
                "sec-fetch-site": "same-origin"
              },
              configure(proxy) {
                proxy.on("proxyReq", (upstream, request) => {
                  for (const header of [
                    "authorization",
                    "forwarded",
                    "x-forwarded-for",
                    "x-origin-verify",
                    "cloudfront-viewer-address"
                  ])
                    upstream.removeHeader(header);
                  const cookies = toUpstreamCookies(
                    request.headers.cookie ?? ""
                  );
                  if (cookies) {
                    upstream.setHeader("cookie", cookies);
                  } else {
                    upstream.removeHeader("cookie");
                  }
                });
                proxy.on("proxyRes", upstream => {
                  if (upstream.headers["set-cookie"]) {
                    upstream.headers["set-cookie"] = toLocalCookies(
                      upstream.headers["set-cookie"]
                    );
                  }
                });
              }
            }
          }
        }
      };
    },
    configureServer(server) {
      if (
        server.config.server.host !== "localhost" ||
        server.config.server.port !== 5173
      ) {
        throw new Error(
          "Local account testing requires http://localhost:5173 (pnpm dev without host/port overrides)."
        );
      }
      const matchesProxy = new RegExp(PROXY_PATH);
      server.middlewares.use((request, response, next) => {
        if (
          !matchesProxy.test(request.url ?? "") ||
          isAllowedProxyRequest(request)
        ) {
          next();
          return;
        }
        response.writeHead(403, {
          "content-type": "application/json",
          "cache-control": "no-store"
        });
        response.end(
          JSON.stringify({
            error:
              "Local account proxy requires a same-origin localhost request."
          })
        );
      });
    }
  };
}
