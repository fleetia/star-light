import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

/** @type {import('eslint').Linter.Config} */
const reactConfig = {
  files: ["**/*.{ts,tsx}"],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser
  },
  rules: {
    "no-duplicate-imports": ["error", { includeExports: true }],
    "object-shorthand": ["error", "always", { avoidQuotes: true }]
  }
};

const ignorePatterns = ["dist", "build", "storybook-static", "public"];

export default defineConfig([globalIgnores(ignorePatterns), reactConfig]);
