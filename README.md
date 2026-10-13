# Hunger Games Simulator

A browser-based Hunger Games simulator: configure tributes, drop them into an arena, and watch the simulation unfold.

**Play online:** <https://maxwarren929-png.github.io/hunger-games-sim/>

## Run locally

This is a static site with no build step or dependencies. From the repository root, start any local HTTP server (using a server avoids browser restrictions on loading assets):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Verify the source

Run the lightweight source audit from the repository root:

```bash
node audit-script.js
```

You can audit a different checkout by passing its path:

```bash
node audit-script.js /path/to/hunger-games-sim
```

The audit reports possible syntax/style issues as JSON; it is a heuristic check, not a replacement for browser testing.

## Project documentation

- [`SPEC.md`](SPEC.md) — gameplay and rendering specification
- [`ARCH_GUIDE.md`](ARCH_GUIDE.md) — code organization and runtime architecture
- [`RECAP_SPEC.md`](RECAP_SPEC.md) — recap and replay design
- [`docs/`](docs/) — design notes and audits
