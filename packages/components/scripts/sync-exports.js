import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcDir = resolve(root, "src");
const pkgPath = resolve(root, "package.json");

const STATIC_EXPORTS = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.js"
  },
  "./styles/*": "./dist/styles/*"
};

const toExportEntry = name => [
  `./${name}`,
  { types: `./dist/${name}/index.d.ts`, import: `./dist/${name}/index.js` }
];

const componentExports = Object.fromEntries(
  readdirSync(srcDir, { withFileTypes: true })
    .filter(
      d => d.isDirectory() && existsSync(resolve(srcDir, d.name, "index.ts"))
    )
    .map(d => d.name)
    .sort()
    .map(toExportEntry)
);

const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
pkg.exports = { ...STATIC_EXPORTS, ...componentExports };
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`Synced ${Object.keys(componentExports).length} component exports`);
