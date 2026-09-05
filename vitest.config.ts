import { defineConfig } from "vitest/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  esbuild: { jsx: "automatic" },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"]
  }
});
