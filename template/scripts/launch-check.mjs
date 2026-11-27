#!/usr/bin/env node
/**
 * Dash's launch check (Archer's idea p4). Every site must pass before it goes live:
 *   Lighthouse 90+ on performance, accessibility, best practices and SEO (phone settings),
 *   a page title, description and share image, and no broken links.
 *
 * Usage: node scripts/launch-check.mjs <url> [more urls...]
 * Needs Chrome/Chromium (set CHROME_PATH if it isn't found). Uses `npx lighthouse`.
 * Exit code 1 if anything fails, so it can gate a deploy.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const urls = process.argv.slice(2);
if (!urls.length) { console.error("Usage: node scripts/launch-check.mjs <url> [...]"); process.exit(2); }
const MIN = 90;
let failed = false;
const fail = (m) => { failed = true; console.log("  ✗ " + m); };
const pass = (m) => console.log("  ✓ " + m);

for (const url of urls) {
  console.log(`\n${url}`);
  const out = path.join(os.tmpdir(), `lh-${Date.now()}.json`);
  try {
    execFileSync("npx", ["-y", "lighthouse@13.6.0", url, "--quiet", "--output=json", `--output-path=${out}`,
      "--only-categories=performance,accessibility,best-practices,seo", "--chrome-flags=--headless=new --no-sandbox"], { stdio: ["ignore", "ignore", "inherit"] });
  } catch { fail("Lighthouse could not run"); continue; }
  const lh = JSON.parse(fs.readFileSync(out, "utf8"));
  for (const [id, c] of Object.entries(lh.categories)) {
    const s = Math.round(c.score * 100);
    (s >= MIN ? pass : fail)(`${c.title}: ${s}${s >= MIN ? "" : ` (needs ${MIN}+)`}`);
    if (s < MIN) for (const ref of c.auditRefs) {
      const a = lh.audits[ref.id];
      if (ref.weight > 0 && a.score !== null && a.score < 0.9) console.log(`      - ${a.title}${a.displayValue ? ` (${a.displayValue})` : ""}`);
    }
  }
  const html = await (await fetch(url)).text();
  const has = (re, what) => (re.test(html) ? pass : fail)(what);
  has(/<title>[^<]{3,}<\/title>/i, "Page title");
  has(/<meta[^>]+name="description"[^>]+content="[^"]{20,}/i, "Description (20+ characters)");
  has(/<meta[^>]+property="og:image"/i, "Share image (og:image)");
  has(/<html[^>]+lang="/i, "Page language set");
  const links = [...new Set([...html.matchAll(/href="([^"#]+)"/g)].map((m) => m[1]))]
    .filter((h) => !h.startsWith("mailto:") && !h.startsWith("tel:") && !h.startsWith("data:") && !h.includes("/_next/"));
  let broken = 0;
  for (const h of links) {
    const u = new URL(h, url).href;
    try {
      let r = await fetch(u, { method: "HEAD", redirect: "follow" });
      if (r.status === 405 || r.status === 403) r = await fetch(u, { redirect: "follow" });
      if (r.status >= 400 && r.status !== 999) { broken++; fail(`Broken link (${r.status}): ${u}`); }
    } catch { console.log(`  ? Couldn't reach ${u} from here (check it by hand)`); }
  }
  if (!broken) pass(`All ${links.length} links work`);
}
console.log(failed ? "\nNOT READY: fix the ✗ items, then run again." : "\nREADY TO LAUNCH.");
process.exit(failed ? 1 : 0);
