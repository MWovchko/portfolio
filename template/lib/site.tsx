/** Small helpers that turn profile.ts into page structure. No personal content here. */
import { config, copy, media } from "@/content/profile";
import type { SectionId, Theme, Title } from "@/content/types";

export const THEME_LABELS: Record<Theme, string> = {
  neon: "Neon",
  night: "Night",
  gallery: "Gallery",
  executive: "Executive",
  original: "Original",
};

const DEFAULT_NAV: Record<SectionId, string> = {
  about: "About",
  now: "Now",
  achievements: "Achievements",
  media: "Media",
  strengths: "Strengths",
  resume: "Resume",
  recommendations: "Reviews",
  contact: "Contact",
};

/** The sections this site shows, in page order. */
export function sections(): SectionId[] {
  const out: SectionId[] = ["about"];
  if (config.features.now) out.push("now");
  out.push("achievements");
  if (config.features.media && media.length) out.push("media");
  out.push("strengths", "resume");
  if (config.features.recommendations) out.push("recommendations");
  out.push("contact");
  return out;
}

export function navLabel(id: SectionId) {
  return copy.nav[id] ?? DEFAULT_NAV[id];
}

/** "03 / Achievements": numbered by position so turning a section off renumbers the rest. */
export function eyebrow(id: SectionId, extra?: string) {
  const n = sections().indexOf(id) + 1;
  return `${String(n).padStart(2, "0")} / ${navLabel(id)}${extra ? ` · ${extra}` : ""}`;
}

export function TitleText({ t, br }: { t: Title; br?: boolean }) {
  return (
    <>
      {t.text}
      {br ? <br /> : " "}
      <span className="grad-text">{t.accent}</span>
    </>
  );
}

/** Renders **bold** markup from copy strings. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p))}</>;
}

export function themeHref(t: Theme) {
  return t === config.theme ? "/" : `/${t}`;
}

export function photoFor(t: Theme) {
  const p = config.photos;
  return (t === "neon" && p.neon) || (t === "night" && p.night) || (t === "executive" && p.executive) || p.hero;
}

/** CSS that applies config.palette on top of the presets in globals.css. */
export function paletteCss() {
  const pal = config.palette ?? {};
  return Object.entries(pal)
    .map(([theme, vars]) => {
      const body = Object.entries(vars ?? {})
        .map(([k, v]) => `--${k.replace(/^--/, "")}:${v};`)
        .join("");
      return body ? `body[data-site="${theme}"]{${body}}` : "";
    })
    .join("\n");
}
