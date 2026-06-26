import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sw = readFileSync(resolve("dist/sw.js"), "utf-8");

const checks = [
  {
    label: "service worker build version is injected",
    pass: !sw.includes("__BUILD_VERSION__") && /CACHE_NAME = "kbo-knit-\d+"/.test(sw)
  },
  {
    label: "precache placeholder is injected",
    pass: !sw.includes("__PRECACHE_URLS__")
  },
  {
    label: "app shell is precached",
    pass: sw.includes('"/"') && sw.includes('"/index.html"')
  },
  {
    label: "built JS and CSS assets are precached",
    pass:
      /"\/assets\/index-[^"]+\.js"/.test(sw) &&
      /"\/assets\/index-[^"]+\.css"/.test(sw)
  },
  {
    label: "season data is precached for offline fallback",
    pass: sw.includes('"/data/2025.json"') && sw.includes('"/data/2026.json"')
  },
  {
    label: "data requests use a queryless cache key",
    pass: sw.includes('url.pathname.startsWith("/data/")') && sw.includes("url.pathname")
  }
];

const failures = checks.filter(check => !check.pass);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`Service worker verification failed: ${failure.label}`);
  }
  process.exit(1);
}

console.log("Service worker verification passed");
