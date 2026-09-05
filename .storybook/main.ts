import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)", "./docs/**/*.mdx"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: fileURLToPath(
          new URL("./vite.config.ts", import.meta.url)
        )
      }
    }
  },
  autodocs: true,
  viteFinal(config) {
    config.plugins = config.plugins || [];
    // Fix file:// protocol resolution issue with pnpm + storybook
    config.plugins.push({
      name: "resolve-file-urls",
      resolveId(source) {
        if (source.startsWith("file://")) {
          return fileURLToPath(source);
        }
        return null;
      }
    });
    return config;
  }
};

export default config;
