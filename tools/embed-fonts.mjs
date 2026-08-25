// Embeds the web fonts into vesper-finch.html as woff2 data URIs.
//   node tools/embed-fonts.mjs
//
// The game ships as one self-contained file, so it cannot rely on a font host:
// a blocked or slow fonts.googleapis.com would silently drop the page onto its
// fallback stack. This fetches the latin subsets once and rewrites the block
// between the FONTS markers in vesper-finch.html. Requires network access.
//
// Bricolage Grotesque and IBM Plex Mono are both SIL Open Font License 1.1,
// which permits embedding. Re-run this to change weights or pick up upstream
// font revisions.

import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "vesper-finch.html");

const API = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=IBM+Plex+Mono:wght@400;600&display=swap";
// Ask as a modern browser or Google serves ttf instead of woff2.
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Bricolage Grotesque is variable: both weights resolve to one file, so declare
// the axis range and let the browser interpolate.
const WEIGHT_RANGE = { "Bricolage Grotesque": "200 800" };

const get = (url, binary = false) =>
  execFileSync("curl", ["-sSfL", "-H", `User-Agent: ${UA}`, url], {
    encoding: binary ? "buffer" : "utf8",
    maxBuffer: 32 * 1024 * 1024
  });

const css = get(API);

const faces = [];
const seen = new Map();
for (const [, subset, body] of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{(.*?)\}/gs)) {
  if (subset !== "latin") continue;                       // the page is English-only
  const family = /font-family:\s*'([^']+)'/.exec(body)[1];
  const weight = /font-weight:\s*([^;]+);/.exec(body)[1].trim();
  const range = /unicode-range:\s*([^;]+);/.exec(body)[1].trim();
  const url = /url\(([^)]+)\)/.exec(body)[1];

  if (!seen.has(url)) seen.set(url, get(url, true).toString("base64"));
  const key = `${family}|${WEIGHT_RANGE[family] ?? weight}`;
  if (faces.some((f) => f.key === key)) continue;         // variable font covers both weights
  faces.push({ key, family, weight: WEIGHT_RANGE[family] ?? weight, range, b64: seen.get(url) });
}

if (faces.length === 0) throw new Error("no latin faces found — did the Google Fonts API change?");

const block = faces
  .map(
    (f) =>
      `  @font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};` +
      `font-display:swap;src:url(data:font/woff2;base64,${f.b64}) format('woff2');` +
      `unicode-range:${f.range}}`
  )
  .join("\n");

const source = await readFile(TARGET, "utf8");
const START = "<!-- FONTS:START -->", END = "<!-- FONTS:END -->";
const from = source.indexOf(START), to = source.indexOf(END);
if (from === -1 || to === -1) throw new Error(`missing ${START} / ${END} markers in ${TARGET}`);

const replacement =
  `${START}\n<style>\n` +
  `  /* Bricolage Grotesque + IBM Plex Mono, latin subsets, SIL OFL 1.1.\n` +
  `     Embedded so the page needs no font host. Regenerate: node tools/embed-fonts.mjs */\n` +
  `${block}\n</style>\n`;

await writeFile(TARGET, source.slice(0, from) + replacement + source.slice(to), "utf8");
for (const f of faces) console.log(`embedded ${f.family} ${f.weight} (${(f.b64.length / 1024).toFixed(0)} kB base64)`);
