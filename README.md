# remote

Tv remote

## Vesper Finch

A one-button endless flyer in the Flappy Bird tradition, with its own name, art, and
physics. Guide a teal finch through gaps in desert canyon spires at dusk; every gap
cleared is a point, and touching stone or sand ends the run.

**Play it:** open `index.html` in any browser — no server, no build, no dependencies,
and it works offline.

- **Controls** — click, tap, <kbd>Space</kbd>, <kbd>↑</kbd> or <kbd>W</kbd> to flap;
  <kbd>P</kbd> or <kbd>Esc</kbd> to pause; <kbd>M</kbd> to mute the music.
- **Fills the viewport.** The world is 640 units tall and its width follows the window's
  aspect, so the canvas covers any screen with no letterboxing and no distortion — a
  wider window simply shows more canyon ahead.
- **Original soundtrack**, synthesised at runtime: a four-chord loop in A minor with a
  filtered pad, a pentatonic pluck that thickens as the run gets longer, and a soft
  shaker. No audio files, and nothing plays until you start (browsers require a gesture).
- **Best score and audio preferences** persist in `localStorage`, degrading gracefully
  when storage is blocked.
- Honours `prefers-reduced-motion`, and the layout holds from a 320 px phone to an
  ultrawide desktop.

### Fair placement

A flap lifts the finch about 63 px over a 0.54 s cycle, so it climbs roughly 117 px/s at
best. Gap centres are therefore constrained to stay within a climb budget that shrinks as
the canyon speeds up — otherwise late-run spire pairs would be physically impossible to
clear. Difficulty ramps through speed (158 → 222 px/s) and gap size (176 → 150 px)
instead. Verified over 24,000 spawns: no gap out of bounds, none unreachable, worst case
at 70% of the budget.

### Source layout

| File | Role |
| --- | --- |
| `vesper-finch.html` | The game. Authored as a page fragment (no `<html>`/`<body>` wrapper) so it can be published directly as an Artifact. |
| `build.mjs` | Wraps that fragment in a document shell, lifting `<title>`, `<link>`, and `<style>` into `<head>`. |
| `index.html` | Build output — the standalone, directly-openable page. Regenerate it rather than editing it. |
| `tools/embed-fonts.mjs` | Inlines the latin subsets of Bricolage Grotesque and IBM Plex Mono as woff2 data URIs, so the page needs no font host. Requires network access. |

```sh
node tools/embed-fonts.mjs   # refresh the embedded fonts (rarely needed)
node build.mjs               # vesper-finch.html -> index.html
```

Edit `vesper-finch.html`, then rebuild. Because `index.html` sits at the repository root,
enabling GitHub Pages on this branch serves the game as-is.
