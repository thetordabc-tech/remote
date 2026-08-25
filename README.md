# remote

Tv remote

## Vesper Finch

A one-button endless flyer in the Flappy Bird tradition, with its own name, art, and
physics. Guide a teal finch through gaps in desert canyon spires at dusk; every gap
cleared is a point, and touching stone or sand ends the run.

**Play it:** open `index.html` in any browser — no server, no build, no dependencies.

- **Controls** — click, tap, <kbd>Space</kbd>, <kbd>↑</kbd> or <kbd>W</kbd> to flap; <kbd>P</kbd> to pause.
- **Best score** persists in `localStorage` (falls back gracefully when storage is blocked).
- Canvas 2D rendering plus a small WebAudio synth for the flap, score, and impact sounds.
- Honours `prefers-reduced-motion`, and the layout holds from 390 px up to desktop.

### Source layout

| File | Role |
| --- | --- |
| `vesper-finch.html` | The game. Authored as a page fragment (no `<html>`/`<body>` wrapper) so it can be published directly as an Artifact. |
| `build.mjs` | Wraps that fragment in a document shell, lifting `<title>`, `<link>`, and `<style>` into `<head>`. |
| `index.html` | Build output — the standalone, directly-openable page. Regenerate it rather than editing it. |

```sh
node build.mjs   # vesper-finch.html -> index.html
```

Edit `vesper-finch.html`, then rebuild. Because `index.html` sits at the repository root,
enabling GitHub Pages on this branch serves the game as-is.
