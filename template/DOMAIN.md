# Use your own domain (like janedoe.com)

Your site already works at `https://<your-name>.vercel.app`. These steps make `janedoe.com` show it too.
**You buy the domain yourself** (we never buy it for you), then we connect it. About 10 minutes, plus up to a few hours for the internet to catch up.

## 1. Buy the domain (you)
Any registrar works: Namecheap, Cloudflare, Porkbun, GoDaddy, Squarespace Domains. A `.com` is usually $10 to $20 a year.
Skip paid add-ons (hosting, email, "SEO"): the site is already hosted.

## 2. Add it in Vercel (us, or you if it's your Vercel account)
1. Vercel → your project → **Settings → Domains**.
2. Type `janedoe.com` → **Add**. When asked, also add `www.janedoe.com` and let it redirect to `janedoe.com`.
3. Vercel now shows the exact DNS records to create. **Copy the values Vercel shows you**; they can be specific to your project.
   They usually look like:

| Type | Name / Host | Value |
|---|---|---|
| A | `@` | an IP address Vercel shows (for example `76.76.21.21`) |
| CNAME | `www` | a name Vercel shows (ending in `vercel-dns.com`) |

## 3. Create the records at your registrar (you, we can walk you through it)
- Find **DNS**, **DNS Records** or **Advanced DNS** for the domain.
- Delete any old `A` record on `@` and any `CNAME` on `www` that point somewhere else (often a "parked" page).
- Add the two records exactly as Vercel shows. Leave TTL on automatic.

## 4. Wait and check
- Vercel's Domains page turns green when it sees the records (often minutes, sometimes a few hours).
- Vercel adds the HTTPS lock automatically.
- Dash checks: `janedoe.com` and `www.janedoe.com` both open the site with the lock, and the old `.vercel.app` address still works.
- Then we set `config.url` to `https://janedoe.com` so share previews use the new address.

## If it doesn't work
- **Still shows the registrar's parked page:** an old record is still there. Remove it.
- **"Invalid configuration" after a day:** the record was typed on the wrong host (`@` vs `www`) or has a typo.
- **Domain uses Cloudflare:** set the records to **DNS only** (grey cloud), not proxied.
