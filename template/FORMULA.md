# The Portfolio Formula

How to build a premium portfolio site for anybody, the same way maxwell-wovchko.vercel.app and
brendan-wovchko.vercel.app were built.

**The formula:** one profile file + one photo + one preset = a finished site.

```
intake.json ──► npm run new ──► content/profile.ts + public/images/ + palette ──► polish ──► QA ──► GitHub + Vercel ──► improve
```

---

## What every site gets (the engine)

These come with every preset. Nobody has to rebuild them.

| Feature | Where it lives |
|---|---|
| Intro loader (counter + curtain, once per visit) | `components/Effects.tsx` → `Loader` |
| Smooth inertial scrolling (Lenis) | `Effects.tsx` → `SmoothScroll` |
| Circle cursor that grows on links | `Effects.tsx` → `Cursor` |
| Magnetic buttons | `Effects.tsx` → `Magnetic` |
| Masked text reveals, scroll-lit paragraphs, counters | `components/Sections.tsx` |
| Parallax shapes and photo depth | `ParallaxLayer`, each hero |
| Cursor spotlight on cards (off on executive) | `.panel-glow` in `app/globals.css` |
| Palette and hero taken from the photo | `scripts/palette.mjs`, `config.palette` |
| Sections: About, Now, Achievements timeline with filters, Media, Strengths, Resume, Recommendations, Contact | `components/*` |
| Printable one-page resume and "Save contact" vCard | `app/resume`, `NowResume.tsx` |
| Optional star-rated recommendations, moderated at `/admin` | `components/Recommendations.tsx`, `lib/store.ts` |
| Alternate looks at `/neon`, `/night`, `/gallery`, `/executive`, `/original` with a footer switcher | `app/[variant]`, `config.alternates` |

Everything personal is in **`content/profile.ts`**. Components never name a person.

## The presets

| Preset | Look | Best for | Photo |
|---|---|---|---|
| `executive` | Light editorial, serif name, arch photo, ink / paper / accent from the photo, no spotlight | Business people, executives, job seekers, anyone who should look professional | Headshot or suit portrait. A transparent cutout (PNG/WebP) stands in front of the arch; a normal photo sits inside it |
| `neon` | Dark, bold display type, glowing 3D photo frame, gradient buttons | Creatives, students, founders, musicians, anyone young and bold | Colorful, well-lit portrait, ideally with colored light |
| `night` | Near-black, huge serif, photo fades out of the dark | Moody or artistic people, photographers | Dark, low-key photo |
| `gallery` | 3D scroll tunnel of their work into a chamber of featured cards | People with lots of work to show: designers, builders, artists | Optional (the tunnel is built from their content) |
| `original` | Dark tech look, 3D ID card | Engineers, technical people | Optional |

Default when unsure: **executive** for anyone over 25 or in business, **neon** for students and creatives.
Add the other presets as `alternates` only when the person will enjoy switching looks (Maxwell's site has all five; Brendan's has one).

---

## Step 1. Intake

Collect these. Anything missing gets a sensible default or a DRAFT placeholder, so **never block on a question**.

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Full name as they use it publicly |
| `photo` | strongly | Path, or `{ "hero", "executive", "neon", "night" }` for different photos per preset. 1200px+ tall is best |
| `theme` | no | One preset above. Default: see table |
| `voice` | no | `first` when the person is building their own site; `third` when someone else is (research-built). Add `"pronoun": "he" / "she" / "they"` for third person |
| `links` | no | `{ label, href }`. LinkedIn first for professionals. `placeholder: true` hides it until filled |
| `email` | no | Only if it is already public or the person gave it. Otherwise contact points to the first link |
| `headline`, `tagline`, `location`, `bio` | no | Written in step 2 if not given |
| `now`, `achievements`, `strengths`, `resume`, `media`, `stats` | no | From research or the person |
| `recommendations` | no | `true` turns on the star-rated recommendation system |
| `copy` | no | Overrides for any heading or hero text (deep-merged over defaults) |
| `sources` | for research | `{ claim, url }` list. Becomes `RESEARCH.md` |

Start from `examples/intake.example.json`. `examples/brendan-wovchko.intake.json` is a complete real one.

## Step 2. Research (public sources only)

1. Search the person's name with their company, school, city and role. Read: LinkedIn (public view), company bios, podcasts, talks, press, publisher pages, school pages, competition results, their own sites and socials.
2. Keep **verified facts only**. Each achievement gets a `link` to its source. Two sources when a claim is big.
3. Never include: home address, phone, family members, minors' details, health, religion or politics (unless the person asks), or anything from a private source.
4. Prefer specific, checkable numbers ("leads ~300 engineers", "25,000+ artists") over adjectives.
5. Save the notes to `RESEARCH.md` (and `/mnt/project-files/research/<name>-public-research.md` in this project).
6. Anything you can't verify: leave it out, or add it with `placeholder: true` so it shows a DRAFT badge.

## Step 3. Write the story

Fill the intake (or edit `content/profile.ts` after generating) with:

- **headline**: three roles joined by " · " (e.g. "CTO · Entrepreneur · Kanban Trainer").
- **tagline**: one sentence, what they do and why it matters.
- **bio**: two or three short paragraphs. Plain words, short sentences.
- **achievements**: 4 to 10 items, newest first, 2 or 3 marked `featured`. Each has a `metric` when there's a number.
- **strengths**: 3 or 6 (the grid is 3 wide). Each has 1 or 2 `evidence` chips. Use `level` only for self-built sites; research-built sites leave it out.
- **hero facts**: three `{ k, v, d }` items for the executive hero (role, company, year).
- **titles**: every section title is `{ text, accent }`; the accent phrase gets the gradient or italic color. Make them about the person ("From founder / to CTO.").

## Step 4. Generate

```bash
cd template
npm install
npm run new -- examples/<person>.intake.json ../../<person>-portfolio
cd ../../<person>-portfolio && npm install && npm run build
```

The generator copies the template, copies the photos to `public/images/<slug>-*.jpg`, detects a cutout, builds
`config.palette` from the photo for the chosen preset, and writes `content/profile.ts` with every heading filled.

To re-tune colors later: `npm run palette -- public/images/<photo> <theme>` and paste the result into `config.palette`.
Palette keys are CSS variables: executive uses `ink`, `paper`, `accent`, `accent-deep`, `accent-light`, `accent-dark`;
dark presets use `bg`, `bg-2`, `text`, `muted`, `dim`, `cyan`, `violet`, `lime`, `star`, `grad`, `orb1`, `orb2`.

## Step 5. QA before anyone sees it

- `npm run build` passes (it also type-checks `profile.ts`).
- Screenshot desktop (1280×800) and phone (390×844) for the home page and each alternate. Look at: hero photo crop, name wrapping, the palette (accent text readable on the background), nav fitting.
- Every DRAFT badge is intended. Every link opens. No section is empty (turn it off in `config.features` instead).
- Third-person sites: no "I", "my" or "me" anywhere. First-person sites: no "he/she".
- `prefers-reduced-motion` still shows everything (motion is decoration, never content).

## Step 6. Deploy

1. **GitHub**: new repo `<owner>/<person-slug>`, push the generated folder to `main`. (In a Claude project, the person approves adding the repo.)
2. **Vercel**: Add New → Project → import the repo. Framework auto-detects. Name it `<person-slug>`, so the site is `https://<person-slug>.vercel.app`. A brand-new Vercel account may ask the owner for an identity verification code.
3. Set `config.url` to the live URL and push.
4. **Recommendations on?** In Vercel: Storage → Create → Upstash for Redis (free) → connect (prefix `KV`), then Settings → Environment Variables → `ADMIN_PASSWORD`. Redeploy. Share `/recommend` with references; approve at `/admin`.
5. Every push to `main` redeploys.

## Step 7. Improvement pass (do this on every site, again every few months)

Score each 1 to 5, fix anything under 4:

1. **First screen**: in 5 seconds, can a stranger tell who this is, what they do, and how to reach them?
2. **Proof**: does every claim have a number, a link, or a quote? Add sources; cut fluff.
3. **Freshness**: is `now.updated` this month? New roles, launches, press, results?
4. **Photo**: sharp at 2× on a phone? A higher-resolution photo, or a cutout for executive, is the single biggest visual upgrade.
5. **Palette**: does the accent feel like the photo? Re-run `npm run palette` or hand-tune `config.palette`.
6. **Copy**: short sentences, no filler words, titles specific to the person.
7. **Mobile**: hero and timeline look right at 390px wide.
8. **Speed**: photos under ~400 KB (WebP), Lighthouse performance 90+.
9. **Links**: none broken; LinkedIn and email (if public) present.
10. **Recommendations**: any pending ones at `/admin` to approve?

Log what changed in the repo's commit message so the next pass knows.

## Editing sites built before the template

`MWovchko/portfolio` (Maxwell) and `MWovchko/brendan-wovchko` (Brendan) predate this template. They use the same
engine and the same `content/profile.ts` idea, but some hero and section text is still written inside the
components (`components/Executive.tsx`, `Sections.tsx`, `NowResume.tsx`). Edit content in `profile.ts`, and look in
those components for headings. To move one onto the template: write its intake (Brendan's already exists in
`examples/`), generate into a fresh folder, compare screenshots, then replace the repo's contents.
