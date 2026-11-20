# Portfolio Template

One profile file + one photo + a preset = a premium personal portfolio, the same engine as
maxwell-wovchko.vercel.app and brendan-wovchko.vercel.app.

**Read [FORMULA.md](FORMULA.md)** for the full step-by-step formula. The short version:

```bash
npm install
npm run new -- examples/intake.example.json ../my-person-portfolio   # generate a site
cd ../my-person-portfolio && npm install && npm run dev               # preview it
```

| Path | What it is |
|---|---|
| `content/profile.ts` | Everything about the person: config, profile, now, achievements, strengths, resume, media, copy |
| `content/types.ts` | The shape of a portfolio (documented field by field) |
| `app/globals.css` | Shared styles + the five presets (`neon`, `night`, `gallery`, `executive`, `original`) |
| `components/` | The engine: loader, smooth scroll, cursor, magnetic buttons, reveals, parallax, heroes, sections |
| `scripts/new-site.mjs` | Intake JSON → a new site folder (photos, palette, profile.ts) |
| `scripts/palette.mjs` | Photo → palette CSS variables (`npm run palette -- <photo> <theme>`) |
| `examples/` | A sample intake and Brendan Wovchko's real intake (regenerates his site) |
| `.claude/agents/portfolio-builder.md` | The Portfolio Builder agent: makes, edits and improves these sites |

This sample (`content/profile.ts`) is a fictional person so the template builds and previews on its own.

Recommendations (optional): set `config.features.recommendations`, then in Vercel add Upstash for Redis
(`KV_REST_API_URL`, `KV_REST_API_TOKEN`) and `ADMIN_PASSWORD`. See `.env.example`.
