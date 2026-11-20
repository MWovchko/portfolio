/**
 * ALL of the site's content lives in this one file. Components read from here,
 * so a new person = a new profile.ts + a photo in public/images/.
 *
 * `npm run new -- <intake.json>` writes this file for you (see FORMULA.md).
 * Items marked `placeholder: true` show a DRAFT badge until real details replace them.
 *
 * This copy is a fictional sample so the template builds and previews on its own.
 */
import type {
  Achievement,
  Copy,
  GalleryFeature,
  MediaItem,
  Now,
  Profile,
  Resume,
  SiteConfig,
  Strength,
} from "./types";

export const config: SiteConfig = {
  theme: "executive",
  alternates: ["neon", "night", "gallery", "original"],
  voice: "first",
  url: "",
  features: { now: true, media: true, recommendations: true, strengthMeters: true },
  photos: { hero: "/images/portrait.svg", executiveCutout: false },
  palette: {},
};

export const profile: Profile = {
  name: "Jordan Avery",
  firstName: "Jordan",
  initials: "JA",
  headline: "Founder · Designer · Student",
  tagline: "I design useful things, ship them fast, and care about the people who use them.",
  location: "Austin, TX",
  bio: [
    "I'm a student and the founder of a small product studio. I like building things people actually use, and I learn best by shipping.",
    "Outside of work I coach a youth soccer team. It taught me that clear goals and honest feedback beat talent most days.",
  ],
  roles: ["Founder", "Designer", "Student", "Builder"],
  stats: [
    { value: 2027, label: "Graduating class" },
    { value: 3, label: "Products shipped" },
    { value: 120, suffix: "+", label: "Customers served", placeholder: true },
    { value: 4, label: "Years coaching" },
  ],
  contact: {
    email: "hello@example.com",
    phone: "",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/", placeholder: true },
      { label: "GitHub", href: "https://github.com/" },
    ],
  },
};

export const now: Now = {
  updated: "November 2026",
  venture: {
    name: "Studio Avery",
    url: "https://example.com",
    role: "Founder",
    since: "2025",
    oneLiner: "A two-person studio making simple tools for small businesses.",
    description:
      "We build booking pages and checkout flows for local businesses that don't have a developer. Every project ships in under two weeks.",
    status: "Taking new clients",
    facts: [
      { label: "Projects", value: "3", note: "shipped this year" },
      { label: "Turnaround", value: "< 2 wks", note: "idea to launch" },
      { label: "Stack", value: "Next.js", note: "hosted on Vercel" },
    ],
  },
  goals: [
    { title: "Ship a fourth client project", detail: "A booking page for a local gym.", done: false },
    { title: "Hire a part-time designer", detail: "So projects don't wait on me.", done: false },
    { title: "Write up every project", detail: "Case studies for the portfolio.", done: true },
  ],
  alsoWorkingOn: ["Senior year of school", "Coaching U12 soccer", "This portfolio"],
};

export const media: MediaItem[] = [
  {
    show: "Local Founders Podcast",
    episode: "#12",
    title: "Building a studio while in school",
    date: "Oct 2026",
    href: "https://example.com",
    quote: "Ship it small, then make it better every week.",
  },
];

export const resume: Resume = {
  lookingFor: "Internships and projects in product design and engineering",
  availability: "Open to opportunities · Summer 2027",
  education: [{ school: "Example University", detail: "B.S. Design · Class of 2027", date: "2023 – 2027", placeholder: true }],
  experience: [
    {
      title: "Founder",
      org: "Studio Avery",
      date: "2025 – Present",
      points: ["Designed and shipped three client products end to end.", "Handle sales, design, build and support."],
    },
    { title: "Head coach", org: "Austin Youth Soccer (U12)", date: "2022 – Present", points: ["Coach 14 players through two seasons a year."] },
  ],
  skills: {
    Design: ["Product design", "Brand identity", "Prototyping"],
    Build: ["Next.js", "Stripe", "Vercel"],
    People: ["Coaching", "Client communication"],
  },
  interests: ["Typography", "Soccer", "Small business"],
};

export const achievements: Achievement[] = [
  {
    title: "Founded Studio Avery",
    org: "example.com",
    date: "2025",
    category: "Business",
    description: "Started a product studio for local businesses and shipped three client projects in the first year.",
    metric: "Founder",
    link: "https://example.com",
    featured: true,
  },
  {
    title: "Design award, regional showcase",
    org: "Example Design Showcase",
    date: "2026",
    category: "Recognition",
    description: "Placed first in the student category for a booking app redesign.",
    metric: "1st",
    featured: true,
    placeholder: true,
  },
  {
    title: "Coached U12 team to the league final",
    org: "Austin Youth Soccer",
    date: "2025",
    category: "Community",
    description: "Took a team that won two games the year before to the league final.",
    metric: "Final",
  },
];

export const strengths: Strength[] = [
  { name: "Shipping", level: 92, description: "I get to a real version quickly, then improve it.", evidence: ["3 products in a year"] },
  { name: "Design", level: 90, description: "Clean, simple interfaces people understand on first use.", evidence: ["Showcase award"] },
  { name: "Coaching", level: 86, description: "Clear goals, honest feedback, steady encouragement.", evidence: ["League final"] },
];

/** Gallery preset chamber cards. Leave [] to use featured achievements. */
export const galleryFeatures: GalleryFeature[] = [];

/** Options for "How do you know …?" on the recommendation form. */
export const relationshipTypes = ["Employer", "Client", "Teacher / Professor", "Coach", "Colleague / Teammate", "Mentor", "Other"] as const;

export const copy: Copy = {
  nav: { achievements: "Work", recommendations: "Reviews" },
  hero: {
    status: "Open to opportunities",
    eyebrow: "Founder, Studio Avery · Class of 2027",
    lead: "Designer and founder of **Studio Avery**, a small studio making tools for local businesses. Looking for my next product role.",
    facts: [
      { k: "Founder", v: "Studio Avery", d: "2025" },
      { k: "Award", v: "Design Showcase", d: "2026" },
      { k: "Coach", v: "U12 Soccer", d: "4 years" },
    ],
    chip: { label: "NOW", title: "Building Studio Avery", sub: "Taking new clients" },
    primaryCta: { label: "Download resume", href: "/resume" },
    secondaryCta: { label: "hello@example.com", href: "mailto:hello@example.com" },
    photoBadge: "JA · FOUNDER",
    card: [
      { k: "NAME", v: "Jordan Avery" },
      { k: "ROLE", v: "Founder, Studio Avery" },
      { k: "SCHOOL", v: "Class of 2027" },
      { k: "STATUS", v: "Open to opportunities" },
    ],
    galleryIntro: "Scroll, and the work scrolls with you.",
  },
  about: { title: { text: "Built by", accent: "shipping." } },
  now: { title: { text: "What I'm", accent: "building now." }, goalsLabel: "GOALS", alsoLabel: "ALSO ON MY PLATE" },
  achievements: {
    title: { text: "Milestones,", accent: "big and small." },
    lead: "Business, school and community. Here's what I've done so far.",
    linkLabel: "View proof",
  },
  media: { title: { text: "In the", accent: "press." }, lead: "Podcasts, talks and interviews.", linkLabel: "Listen" },
  strengths: { title: { text: "What I bring", accent: "to the team." }, lead: "The traits people I've worked with point to most." },
  resume: {
    title: { text: "The", accent: "quick facts." },
    lead: "Everything you need if you're hiring, networking, or just want to stay in touch.",
    educationHeading: "Education",
    interestsHeading: "Interests",
    summary: "Designer and founder of Studio Avery. Looking for internships in product design and engineering.",
  },
  contact: { title: { text: "Let's build", accent: "something." }, note: "" },
};
