import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const dataDir = resolve(__dirname, "data");

const injectSwVersion = (): Plugin => ({
  name: "inject-sw-version",
  generateBundle(_, bundle) {
    const swAsset = bundle["sw.js"];
    if (swAsset && swAsset.type === "asset") {
      const version = `kbo-knit-${Date.now()}`;
      swAsset.source = (swAsset.source as string).replace(
        "__BUILD_VERSION__",
        version
      );
    }
  }
});

const serveRootData = (): Plugin => ({
  name: "serve-root-data",
  configureServer(server) {
    server.middlewares.use("/data", (req, res, next) => {
      const filePath = join(dataDir, req.url!.replace(/^\//, ""));
      if (existsSync(filePath) && filePath.endsWith(".json")) {
        res.setHeader("Content-Type", "application/json");
        res.end(readFileSync(filePath, "utf-8"));
      } else {
        next();
      }
    });
  },
  generateBundle() {
    if (!existsSync(dataDir)) return;
    for (const file of readdirSync(dataDir)) {
      if (!file.endsWith(".json")) continue;
      this.emitFile({
        type: "asset",
        fileName: `data/${file}`,
        source: readFileSync(join(dataDir, file), "utf-8")
      });
    }
  }
});

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), serveRootData(), injectSwVersion()]
});
