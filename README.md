# remote

Tv remote

## Vesper Finch

`vesper-finch.html` — a one-button endless flyer in the Flappy Bird tradition, with its
own name, art, and physics. Guide a teal finch through gaps in desert canyon spires at
dusk; every gap cleared is a point, and touching stone or sand ends the run.

- **Controls** — click, tap, <kbd>Space</kbd>, <kbd>↑</kbd> or <kbd>W</kbd> to flap; <kbd>P</kbd> to pause.
- **Best score** persists in `localStorage` (falls back gracefully when storage is blocked).
- **Self-contained** — one file, no build step, no dependencies. Canvas 2D plus a small
  WebAudio synth for the flap, score, and impact sounds.

The file is written as an Artifact page fragment (no `<html>`/`<body>` wrapper), so to open
it directly in a browser, wrap it in a minimal HTML document first.
