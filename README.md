# Maxwell Wovchko · Portfolio

Personal portfolio with scroll animations, achievements, strengths, a "Now" section for DarkDorms,
a printable resume, and a moderated star-rating recommendation system.

Built with Next.js + Framer Motion. Deployed on Vercel.

## Editing content
Everything personal lives in **`content/profile.ts`**:
- `profile`: name, bio, stats, contact links
- `now`: what I'm working on (DarkDorms status, prices, goals). Update this when the business changes.
- `achievements`, `strengths`, `resume`
- Anything with `placeholder: true` shows a yellow DRAFT badge until you fill it in and delete the flag.
- Photos: put them in `public/images/` and set `image: "/images/file.jpg"` on an achievement.

## Recommendations
- People submit a 1–5 star rating and testimonial from the Reviews section, or the direct link **`/recommend`** (send this to references).
- New submissions are **pending** until approved at **`/admin`** (password = `ADMIN_PASSWORD`).
- Spam protection: hidden honeypot field, minimum time-on-form, link filter, 3 submissions per IP per hour.
- Submitters' emails are private and only visible in `/admin`.

## Vercel setup
1. Import this repo in Vercel (framework is auto-detected).
2. **Storage → Create → Upstash for Redis** (free tier) and connect it to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. **Settings → Environment Variables → `ADMIN_PASSWORD`** = a long password of your choice.
4. Redeploy.

Without Redis, the site still works but recommendations are only kept in memory and will be lost.

## Local dev
```bash
npm install
npm run dev
```
