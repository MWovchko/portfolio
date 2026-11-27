# Launch checklist (Dash)

No portfolio goes live until every box is checked. Archer signs off last.

## 1. Automatic check
```bash
node scripts/launch-check.mjs https://<person>.vercel.app https://<person>.vercel.app/<alternate>
```
It passes only when, for every page:
- [ ] Lighthouse (phone settings) **90+** on Performance, Accessibility, Best Practices and SEO
- [ ] A page title, a description of 20+ characters, a share image (`og:image`) and a page language
- [ ] No broken links

## 2. By eye (desktop 1280×800 and phone 390×844)
- [ ] First screen: in 5 seconds a stranger knows who this is, what they do and how to reach them
- [ ] Hero photo crop looks right; the name doesn't wrap badly
- [ ] Accent text is easy to read on its background
- [ ] Every DRAFT badge is meant to be there (or removed)
- [ ] No empty sections (turn them off in `config.features` instead)
- [ ] Voice matches: first-person sites never say "he/she"; third-person sites never say "I/my"
- [ ] Spelling checked on every section (Lyra)
- [ ] Every claim is true and checkable; nothing invented
- [ ] Photos under ~400 KB each (WebP), sharp at 2× on a phone
- [ ] `prefers-reduced-motion` still shows all content
- [ ] Share preview checked by pasting the link into a message

## 3. Ship
- [ ] `config.url` set to the live address
- [ ] Own domain connected and working with and without `www` (see DOMAIN.md), if the client has one
- [ ] Recommendations on? Upstash + `ADMIN_PASSWORD` set, `/recommend` and `/admin` tested
- [ ] Client (via Remy) has seen the final version and said yes

## First run: Maxwell's own site (2026-11-27)
Run on a local production build of `main` (the cloud can't reach vercel.app), phone settings:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` (Neon) | **75** ✗ | 100 | 100 | 100 |
| `/executive` | **77** ✗ | 97 | 100 | 100 |

Also missing: a share image (`og:image`), so links to the site show no picture.
Slowest parts: Largest Contentful Paint ~3.8 s, Total Blocking Time ~330 to 410 ms (intro loader, smooth-scroll and
motion scripts run before the first paint), Speed Index ~5 s.
Fixes for Archer to schedule: serve the hero photo as a preloaded, sized WebP; load the cursor, smooth-scroll and
tunnel effects after first paint; add an `og:image`. Then re-run.
