// Bundles src/index.ts into a single self-contained lib/index.js.
//
// Why bundle instead of plain tsc: `firebase deploy` uploads only this
// directory, and tsc emits import specifiers verbatim (tsconfig `paths` is a
// typechecker-only feature). esbuild resolves `@shared/*` against ../shared and
// inlines that code, so the deployed artifact has nothing to resolve outside
// itself and `shared/` needs no copy in here. This mirrors how the Next.js
// client already consumes `@shared/*`.
//
// Runtime dependencies stay external: Firebase installs them from package.json.
import { createRequire } from "module";
import * as esbuild from "esbuild";

const pkg = createRequire(import.meta.url)("./package.json");

const options = {
  entryPoints: ["src/index.ts"],
  outfile: "lib/index.js",
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  sourcemap: true,
  external: Object.keys(pkg.dependencies ?? {}),
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("esbuild: watching for changes...");
} else {
  await esbuild.build(options);
}
