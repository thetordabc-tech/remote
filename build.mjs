// Wraps the artifact page fragment into a complete, standalone HTML document.
//   node build.mjs   ->   index.html
//
// The artifact host supplies its own <!doctype>/<head>/<body> and a CSS reset, so
// vesper-finch.html is authored as a fragment. This adds the missing document
// shell (and lifts <title>/<link>/<style> into <head>, where they belong) so the
// same source runs from the filesystem or any static host.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "vesper-finch.html");
const OUT = join(here, "index.html");

const fragment = await readFile(SRC, "utf8");

// Pull the head-bound tags out of the fragment, keeping their original order.
const head = [];
const body = fragment
  .replace(/^[ \t]*<title>[\s\S]*?<\/title>[ \t]*\n?/gm, (m) => (head.push(m.trim()), ""))
  .replace(/^[ \t]*<link\b[^>]*>[ \t]*\n?/gm, (m) => (head.push(m.trim()), ""))
  .replace(/^[ \t]*<style>[\s\S]*?<\/style>[ \t]*\n?/gm, (m) => (head.push(m.trim()), ""))
  .trim();

if (!head.some((t) => t.startsWith("<title"))) {
  throw new Error("vesper-finch.html has no <title> — refusing to build a nameless page");
}

const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A one-button dusk flyer: guide a teal finch through the canyon spires without touching stone or sand.">
<meta name="theme-color" content="#150E28">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext y='26' font-size='26'%3E%F0%9F%AA%B6%3C/text%3E%3C/svg%3E">
${head.join("\n")}
<style>
  /* the artifact host ships a reset; standalone needs the parts we rely on */
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  html { background: #150E28; }
</style>
</head>
<body>
${body}
</body>
</html>
`;

await writeFile(OUT, doc, "utf8");
console.log(`built ${OUT} (${(doc.length / 1024).toFixed(1)} kB) from ${SRC}`);
