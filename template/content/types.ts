/**
 * The shape of a portfolio. Every site built from this template fills in
 * `content/profile.ts` with these types. Components never hard-code a person:
 * if a word on the page is about the person, it comes from profile.ts.
 */

/** Design presets. Each one is a full look (palette, type, hero) in app/globals.css. */
export type Theme = "neon" | "night" | "gallery" | "executive" | "original";
/** "first" = "I built…", "third" = "She built…". Pick third when the person didn't write it. */
export type Voice = "first" | "third";
export type SectionId = "about" | "now" | "achievements" | "media" | "strengths" | "resume" | "recommendations" | "contact";

export interface SiteConfig {
  /** The preset used for the home page. */
  theme: Theme;
  /** Extra versions served at /<theme> and listed in the footer switcher. [] = single look. */
  alternates: Theme[];
  voice: Voice;
  /** Public URL once deployed, e.g. https://jane-doe.vercel.app */
  url?: string;
  features: {
    /** "What I'm working on now" block. */
    now: boolean;
    /** Podcasts, talks, press cards. Needs `media` items. */
    media: boolean;
    /** Star-rated, moderated recommendations (/recommend, /admin). Needs Upstash + ADMIN_PASSWORD. */
    recommendations: boolean;
    /** Animated bars on the strength cards. Off when there's no honest basis for a number. */
    strengthMeters: boolean;
  };
  photos: {
    /** Main portrait. Used by every preset that doesn't have its own photo below. */
    hero: string;
    neon?: string;
    night?: string;
    executive?: string;
    /** true when the executive photo is a transparent cutout (person stands in front of the arch). */
    executiveCutout?: boolean;
  };
  /**
   * CSS variable overrides per preset, usually generated from the photo by
   * `npm run palette`. Keys are variable names without "--", e.g. { accent: "#4f6b55" }.
   */
  palette?: Partial<Record<Theme, Record<string, string>>>;
  /** Browser UI color (mobile address bar). Defaults to the theme background. */
  themeColor?: string;
}

/** A title with an accent phrase: renders as "text <accent>". */
export interface Title {
  text: string;
  accent: string;
}

export interface Link {
  label: string;
  href: string;
  placeholder?: boolean;
}

export interface Copy {
  nav: Partial<Record<SectionId, string>>;
  hero: {
    /** Small status line: executive meta bar, original ID card. e.g. "Open to opportunities" */
    status: string;
    /** Executive eyebrow above the name. */
    eyebrow: string;
    /** Executive intro paragraph. Wrap words in **double stars** to bold them. */
    lead: string;
    /** Three quick facts under the executive intro. */
    facts: { k: string; v: string; d: string }[];
    /** Floating card on the executive photo. */
    chip: { label: string; title: string; sub: string };
    primaryCta: Link;
    secondaryCta: Link;
    /** Label on the neon photo frame, e.g. "JD · DESIGNER". */
    photoBadge: string;
    /** Lines on the original preset's 3D ID card. */
    card: { k: string; v: string }[];
    /** Line under the name on the gallery intro. */
    galleryIntro: string;
  };
  about: { title: Title };
  now: { title: Title; goalsLabel: string; alsoLabel: string };
  achievements: { title: Title; lead: string; linkLabel: string };
  media: { title: Title; lead: string; linkLabel: string };
  strengths: { title: Title; lead: string };
  resume: { title: Title; lead: string; educationHeading: string; interestsHeading: string; summary: string };
  contact: { title: Title; note: string };
}

export interface Profile {
  name: string;
  firstName: string;
  initials: string;
  headline: string;
  tagline: string;
  location: string;
  bio: string[];
  /** Words that cycle in the neon/night/original hero. */
  roles: string[];
  stats: Stat[];
  contact: { email: string; phone: string; links: Link[] };
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  placeholder?: boolean;
}

export interface Now {
  updated: string;
  venture: {
    name: string;
    url: string;
    role: string;
    since: string;
    oneLiner: string;
    description: string;
    status: string;
    facts: { label: string; value: string; note: string }[];
  };
  goals: { title: string; detail: string; done?: boolean }[];
  alsoWorkingOn: string[];
}

export interface Achievement {
  title: string;
  org?: string;
  date: string;
  /** Any short label. The filter chips are built from the categories used. */
  category: string;
  description: string;
  /** Short metric shown big on the card, e.g. "Top 12" or "$40K". */
  metric?: string;
  /** Proof: the public source for the item. Required for researched sites. */
  link?: string;
  image?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface Strength {
  name: string;
  /** 0 – 100. Only shown when features.strengthMeters is on. */
  level?: number;
  description: string;
  evidence: string[];
}

export interface MediaItem {
  show: string;
  episode: string;
  title: string;
  date: string;
  href: string;
  quote?: string;
}

export interface Resume {
  lookingFor: string;
  availability: string;
  education: { school: string; detail: string; date: string; placeholder?: boolean }[];
  experience: { title: string; org: string; date: string; points: string[] }[];
  skills: Record<string, string[]>;
  interests: string[];
}

/** Big cards that pop off the wall in the gallery preset's chamber. Falls back to featured achievements. */
export interface GalleryFeature {
  name: string;
  tag: string;
  line: string;
  /** CSS background, e.g. a gradient taken from the palette. */
  img?: string;
}
