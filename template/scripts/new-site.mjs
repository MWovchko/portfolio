#!/usr/bin/env node
/**
 * Make a new portfolio from an intake file.
 *
 *   node scripts/new-site.mjs <intake.json> <output-folder>
 *
 * 1. Copies this template into <output-folder>
 * 2. Copies the photo(s) into public/images/
 * 3. Builds a palette from the photo for the chosen preset
 * 4. Writes content/profile.ts from the intake (filling sensible defaults)
 *
 * Then: cd <output-folder> && npm install && npm run build. See FORMULA.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPalette, isCutout } from "./palette.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE = path.resolve(here, "..");
const THEMES = ["neon", "night", "gallery", "executive", "original"];
const SKIP = new Set(["intake", "themes", "IntakeForm.tsx", "launch-check.mjs", "node_modules", ".next", ".git", ".vercel", "examples", "tsconfig.tsbuildinfo", "next-env.d.ts"]);

const [intakePath, outArg] = process.argv.slice(2);
if (!intakePath || !outArg) {
  console.error("usage: node scripts/new-site.mjs <intake.json> <output-folder>");
  process.exit(1);
}
const intakeDir = path.dirname(path.resolve(intakePath));
const I = JSON.parse(fs.readFileSync(intakePath, "utf8"));
const OUT = path.resolve(outArg);

const need = (k) => {
  if (!I[k]) throw new Error(`intake is missing "${k}"`);
  return I[k];
};
const name = need("name");
const theme = I.theme ?? "executive";
if (!THEMES.includes(theme)) throw new Error(`theme must be one of ${THEMES.join(", ")}`);
const voice = I.voice ?? "first";
const first = voice === "first";
const firstName = I.firstName ?? name.split(" ")[0];
const initials = I.initials ?? name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const slug = (I.slug ?? name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ---------- 1. copy the template ---------- */
if (fs.existsSync(OUT) && fs.readdirSync(OUT).length) throw new Error(`${OUT} already exists and isn't empty`);
fs.cpSync(TEMPLATE, OUT, {
  recursive: true,
  filter: (src) => !SKIP.has(path.basename(src)) && path.resolve(src) !== OUT,
});
fs.rmSync(path.join(OUT, "public/images/portrait.svg"), { force: true });

/* ---------- 2. photos ---------- */
const photoIn = typeof I.photo === "string" ? { hero: I.photo } : I.photo ?? {};
const photos = {};
let cutout = I.photoCutout;
for (const [key, rel] of Object.entries(photoIn)) {
  const src = path.resolve(intakeDir, rel);
  const file = `${slug}-${key}${path.extname(src).toLowerCase()}`;
  fs.copyFileSync(src, path.join(OUT, "public/images", file));
  photos[key] = `/images/${file}`;
}
if (!photos.hero) {
  fs.copyFileSync(path.join(TEMPLATE, "public/images/portrait.svg"), path.join(OUT, "public/images/portrait.svg"));
  photos.hero = "/images/portrait.svg";
}
const mainPhoto = path.join(OUT, "public", (theme !== "gallery" && photos[theme]) || photos.hero);
if (cutout == null) cutout = await isCutout(path.join(OUT, "public", photos.executive ?? photos.hero)).catch(() => false);

/* ---------- 3. palette ---------- */
let palette = I.palette;
if (!palette && !mainPhoto.endsWith(".svg")) {
  palette = { [theme]: await extractPalette(mainPhoto, theme) };
}

/* ---------- 4. content ---------- */
const now = I.now ?? null;
const resume = {
  lookingFor: "",
  availability: "",
  education: [],
  experience: [],
  skills: {},
  interests: [],
  ...(I.resume ?? {}),
};
const achievements = I.achievements ?? [];
const links = I.links ?? [];
const email = I.email ?? "";
const featured = achievements.filter((a) => a.featured && !a.placeholder);
const facts = (I.facts ?? featured.slice(0, 3).map((a) => ({ k: a.category, v: a.metric ?? a.title, d: a.date }))).slice(0, 3);

const features = {
  now: !!now,
  media: !!(I.media && I.media.length),
  recommendations: I.recommendations ?? false,
  strengthMeters: (I.strengths ?? []).every((s) => typeof s.level === "number") && (I.strengths ?? []).length > 0,
  ...(I.features ?? {}),
};

const firstLink = links.find((l) => !l.placeholder);
const he = voice === "third" ? I.pronoun ?? "they" : "I";
const copy = deepMerge(
  {
    nav: { recommendations: "Reviews" },
    hero: {
      status: resume.availability || (first ? "Open to opportunities" : I.headline?.split("·")[0]?.trim() ?? ""),
      eyebrow: now ? `${now.venture.role} · ${now.venture.name}` : I.headline ?? "",
      lead: I.lead ?? I.tagline ?? "",
      facts,
      chip: now
        ? { label: "NOW", title: `${now.venture.role}, ${now.venture.name}`, sub: now.venture.status ?? "" }
        : { label: "BASED IN", title: I.location ?? "", sub: I.headline ?? "" },
      primaryCta: { label: first ? "Download resume" : "Printable resume", href: "/resume" },
      secondaryCta: email
        ? { label: email, href: `mailto:${email}` }
        : firstLink
          ? { label: `${firstLink.label} ↗`, href: firstLink.href }
          : { label: "Get in touch", href: "#contact" },
      photoBadge: `${initials} · ${(I.roles?.[0] ?? I.headline?.split("·")[0] ?? "").trim().toUpperCase()}`,
      card: [
        { k: "NAME", v: name },
        { k: "ROLE", v: now ? `${now.venture.role}, ${now.venture.name}` : I.headline ?? "" },
        { k: "BASED", v: I.location ?? "" },
        { k: "STATUS", v: resume.availability || "Open to opportunities" },
      ],
      galleryIntro: "Scroll, and the work scrolls with you.",
    },
    about: { title: { text: "About", accent: firstName + "." } },
    now: first
      ? { title: { text: "What I'm", accent: "working on now." }, goalsLabel: "GOALS", alsoLabel: "ALSO ON MY PLATE" }
      : { title: { text: `What ${he}'s`, accent: "working on now." }, goalsLabel: "FOCUS", alsoLabel: "ALSO KNOWN FOR" },
    achievements: {
      title: { text: "Milestones,", accent: "big and small." },
      lead: first
        ? "Here's what I've done so far, and I'm adding to it as I go."
        : "The record so far. Every item links to its public source.",
      linkLabel: first ? "View proof" : "Source",
    },
    media: { title: { text: "In the", accent: "press." }, lead: "Podcasts, talks and interviews.", linkLabel: "Open" },
    strengths: first
      ? { title: { text: "What I bring", accent: "to the team." }, lead: "The traits people I've worked with point to most." }
      : { title: { text: `What ${he} brings`, accent: "to a team." }, lead: "The themes that run through the work." },
    resume: {
      title: { text: "The", accent: "quick facts." },
      lead: first
        ? "Everything you need if you're hiring, networking, or just want to stay in touch."
        : "Career highlights, credentials and skills, with a printable one-page version.",
      educationHeading: "Education",
      interestsHeading: "Interests",
      summary: I.summary ?? I.tagline ?? "",
    },
    contact: { title: first ? { text: "Let's build", accent: "something." } : { text: "Let's", accent: "connect." }, note: "" },
  },
  I.copy ?? {}
);

const config = {
  theme,
  alternates: (I.alternates ?? []).filter((t) => THEMES.includes(t) && t !== theme),
  voice,
  url: I.url ?? `https://${slug}.vercel.app`,
  features,
  photos: { ...photos, executiveCutout: !!cutout },
  palette: palette ?? {},
};

const profile = {
  name,
  firstName,
  initials,
  headline: I.headline ?? "",
  tagline: I.tagline ?? "",
  location: I.location ?? "",
  bio: I.bio ?? [],
  roles: I.roles ?? (I.headline ?? "").split("·").map((s) => s.trim()).filter(Boolean),
  stats: I.stats ?? [],
  contact: { email, phone: I.phone ?? "", links },
};

const nowOut = now ?? {
  updated: "",
  venture: { name: "", url: "", role: "", since: "", oneLiner: "", description: "", status: "", facts: [] },
  goals: [],
  alsoWorkingOn: [],
};

const j = (v) => JSON.stringify(v, null, 2);
const ts = `/**
 * ALL of ${name}'s site content lives in this one file. Generated by scripts/new-site.mjs
 * from ${path.basename(intakePath)} on ${new Date().toISOString().slice(0, 10)}; edit freely from here on.
 * Items marked \`placeholder: true\` show a DRAFT badge until real details replace them.
 */
import type { Achievement, Copy, GalleryFeature, MediaItem, Now, Profile, Resume, SiteConfig, Strength } from "./types";

export const config: SiteConfig = ${j(config)};

export const profile: Profile = ${j(profile)};

export const now: Now = ${j(nowOut)};

export const media: MediaItem[] = ${j(I.media ?? [])};

export const resume: Resume = ${j(resume)};

export const achievements: Achievement[] = ${j(achievements)};

export const strengths: Strength[] = ${j(I.strengths ?? [])};

export const galleryFeatures: GalleryFeature[] = ${j(I.galleryFeatures ?? [])};

export const relationshipTypes = ${j(I.relationshipTypes ?? ["Employer", "Client", "Teacher / Professor", "Coach", "Colleague / Teammate", "Mentor", "Other"])} as const;

export const copy: Copy = ${j(copy)};
`;
fs.writeFileSync(path.join(OUT, "content/profile.ts"), ts);

/* ---------- README + research ---------- */
const pkgPath = path.join(OUT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = `${slug}-portfolio`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
const lockPath = path.join(OUT, "package-lock.json");
if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  lock.name = pkg.name;
  if (lock.packages?.[""]) lock.packages[""].name = pkg.name;
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
}

fs.writeFileSync(
  path.join(OUT, "README.md"),
  `# ${name} · Portfolio

Built from the portfolio template (Next.js + Framer Motion + Lenis, deployed on Vercel).

- Home page preset: **${theme}**${config.alternates.length ? `; other versions: ${config.alternates.map((t) => "`/" + t + "`").join(", ")}` : ""}
- All content: \`content/profile.ts\`. Photos: \`public/images/\`.
- Recommendations: ${features.recommendations ? "on (needs Upstash Redis + `ADMIN_PASSWORD` in Vercel; moderate at `/admin`, share `/recommend`)" : "off (`config.features.recommendations`)"}
${I.sources?.length ? "- Sources for every fact: `RESEARCH.md`\n" : ""}
\`\`\`bash
npm install
npm run dev
\`\`\`
`
);
if (I.sources?.length) {
  fs.writeFileSync(
    path.join(OUT, "RESEARCH.md"),
    `# ${name}: public sources\n\nEvery fact on the site comes from one of these. Nothing private, nothing guessed.\n\n` +
      I.sources.map((s) => `- ${s.claim ? s.claim + ": " : ""}${s.url}`).join("\n") +
      "\n"
  );
}

console.log(`✓ ${name} → ${OUT}
  preset: ${theme}${config.alternates.length ? " (+" + config.alternates.join(", ") + ")" : ""} · voice: ${voice} · photo cutout: ${!!cutout}
  palette: ${palette ? Object.keys(palette).join(", ") : "preset default"}
  features: ${Object.entries(features).filter(([, v]) => v).map(([k]) => k).join(", ") || "none"}
next: cd ${outArg} && npm install && npm run build`);

function deepMerge(a, b) {
  if (Array.isArray(b) || typeof b !== "object" || b === null) return b ?? a;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = k in a ? deepMerge(a[k], v) : v;
  return out;
}
