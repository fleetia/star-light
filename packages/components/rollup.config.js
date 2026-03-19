import { vanillaExtractPlugin } from "@vanilla-extract/rollup-plugin";
import typescript from "@rollup/plugin-typescript";
import { readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/** Rename .css.js → .styles.js so consumer's vanilla-extract plugin won't intercept */
const renameCssChunks = () => ({
  name: "rename-css-chunks",
  generateBundle(_, bundle) {
    const renames = new Map();
    for (const fileName of Object.keys(bundle)) {
      if (fileName.endsWith(".css.js")) {
        renames.set(fileName, fileName.replace(/\.css\.js$/, ".styles.js"));
      }
    }
    for (const [oldName, newName] of renames) {
      bundle[newName] = bundle[oldName];
      bundle[newName].fileName = newName;
      delete bundle[oldName];
    }
    // Update import references in all chunks
    for (const chunk of Object.values(bundle)) {
      if (chunk.type !== "chunk") continue;
      chunk.code = chunk.code.replace(
        /from\s+'([^']*?)\.css\.js'/g,
        "from '$1.styles.js'"
      );
      chunk.code = chunk.code.replace(
        /from\s+"([^"]*?)\.css\.js"/g,
        'from "$1.styles.js"'
      );
    }
  }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const componentEntries = Object.fromEntries(
  readdirSync(resolve(__dirname, "src"), { withFileTypes: true })
    .filter(
      d =>
        d.isDirectory() &&
        existsSync(resolve(__dirname, "src", d.name, "index.ts"))
    )
    .map(d => [
      `${d.name}/index`,
      resolve(__dirname, "src", d.name, "index.ts")
    ])
);

export default {
  input: {
    index: resolve(__dirname, "src/index.ts"),
    ...componentEntries
  },
  plugins: [
    vanillaExtractPlugin(),
    typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    renameCssChunks()
  ],
  external: ["react", "react-dom", "react/jsx-runtime", "clsx"],
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js",
    assetFileNames(assetInfo) {
      const name = assetInfo.names?.[0] ?? assetInfo.name ?? "asset";
      // src/Select/Select.css.ts.vanilla.css → styles/Select/Select.css
      // src/styles/tokens.css.ts.vanilla.css → styles/tokens.css
      const cleaned = name
        .replace(/^src\//, "")
        .replace(/^styles\//, "")
        .replace(/\.css\.ts\.vanilla\.css$/, ".css");
      return `styles/${cleaned}`;
    }
  }
};
