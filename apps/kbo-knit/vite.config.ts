import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const dataDir = resolve(__dirname, "data");

const injectSwVersion = (): Plugin => {
  const version = `kbo-knit-${Date.now()}`;
  const inject = (source: string) =>
    source.replaceAll("__BUILD_VERSION__", version);

  return {
    name: "inject-sw-version",
    generateBundle(_, bundle) {
      const swAsset = bundle["sw.js"];
      if (swAsset && swAsset.type === "asset") {
        swAsset.source = inject(swAsset.source as string);
      }
    },
    writeBundle(options) {
      const outDir = options.dir ?? "dist";
      const swPath = resolve(outDir, "sw.js");
      if (!existsSync(swPath)) return;

      const source = readFileSync(swPath, "utf-8");
      if (source.includes("__BUILD_VERSION__")) {
        writeFileSync(swPath, inject(source));
      }
    }
  };
};

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
