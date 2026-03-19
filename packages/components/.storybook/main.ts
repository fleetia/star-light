import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  stories: [
    "../src/**/__stories__/**/*.stories.@(ts|tsx)",
    "../src/**/__stories__/**/*.mdx",
    "./docs/**/*.mdx"
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  autodocs: true,
  viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.unshift(vanillaExtractPlugin());
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
