import { reactConfig, ignorePatterns } from "@star-light/config/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([globalIgnores(ignorePatterns), reactConfig]);
