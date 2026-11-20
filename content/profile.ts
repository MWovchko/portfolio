/**
 * All of the site's personal content lives in this one file.
 * Edit the values below to update the site; no other code needs to change.
 *
 * Items marked `placeholder: true` are shown with a subtle "draft" badge
 * so it's obvious what still needs real details. Delete the flag once filled in.
 */

export type AchievementCategory =
  | "Business"
  | "School"
  | "Music & Performance"
  | "Leadership"
  | "Community"
  | "Milestone";

export interface Achievement {
  title: string;
  /** Organization, school, or event this happened with. */
  org?: string;
  /** e.g. "2025" or "2023 – Present" */
  date: string;
  category: AchievementCategory;
  description: string;
  /** Short metric shown big on the card, e.g. "Top 12" or "$40K". */
  metric?: string;
  /** Optional link to proof: article, video, website. */
  link?: string;
  /** Optional image path in /public, e.g. "/images/dci.jpg". */
  image?: string;
  /** Larger card on the timeline. */
  featured?: boolean;
  placeholder?: boolean;
}

export interface Strength {
  name: string;
  /** 0 – 100, drives the animated meter. */
  level: number;
  description: string;
  /** Concrete proof points for the strength. */
  evidence: string[];
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  placeholder?: boolean;
}

export const profile = {
  name: "Maxwell Wovchko",
  firstName: "Maxwell",
  initials: "MW",
  headline: "Founder · Drummer · ORU Student",
  tagline:
    "I build things, lead with discipline, and care about the people I work with, whether that's on the field, in the classroom, or with a customer.",
  location: "Tulsa, OK · from Brentwood, TN",
  /** Shown in the About section. */
  bio: [
    "I'm a student at Oral Roberts University (Class of 2030) and the founder of DarkDorms, a business I started to solve a problem my fellow students and I deal with every night. I like building things that people actually use.",
    "I marched with the Colt Cadets drum corps in 2025 and play cajon for live music. Drumming taught me discipline, and business taught me to serve people well. Ask anyone I've worked for. You can read what they've said below.",
  ],
  /** Words that cycle in the hero. */
  roles: ["Founder", "Drummer", "Student", "Leader", "Builder"],
  stats: [
    { value: 2030, label: "ORU graduating class" },
    { value: 2025, label: "Marched with Colt Cadets (DCI)" },
    { value: 1, label: "Business founded and running" },
    { value: 24, suffix: "h", label: "DarkDorms delivery promise" },
  ] as Stat[],
  contact: {
    /** Public contact email. Swap for a personal one any time. */
    email: "me@darkdorms.com",
    phone: "", // optional, e.g. "(615) 555-0123". Left blank so it isn't published by accident.
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/", placeholder: true },
      { label: "Instagram", href: "https://www.instagram.com/maxwell.wovchko/" },
      { label: "GitHub", href: "https://github.com/MWovchko" },
      { label: "DarkDorms", href: "https://darkdorms.com" },
    ] as { label: string; href: string; placeholder?: boolean }[],
  },
};

/**
 * "What I'm working on now." Update this block whenever DarkDorms changes
 * (prices, launch status, goals). It powers the Now section and the resume.
 */
export const now = {
  updated: "November 2026",
  venture: {
    name: "DarkDorms",
    url: "https://darkdorms.com",
    role: "Founder",
    since: "2026",
    oneLiner: "Light-blocking door strips for dorm rooms, made for students by a student.",
    description:
      "Hallway lights in college dorms never turn off, and the bar of light under the door keeps people awake. DarkDorms makes a strip sized for ORU dorm doors that slides underneath and keeps the room dark. Students preorder through Stripe, and a fellow ORU student texts them and drops it off at their room within 24 hours.",
    status: "Preorders paused briefly while we restock",
    facts: [
      { label: "Preorder price", value: "$10.99", note: "reg. $19.99" },
      { label: "Delivery", value: "< 24 hrs", note: "dropped off by a student" },
      { label: "Checkout", value: "Stripe", note: "name, phone, dorm & room" },
    ],
  },
  goals: [
    { title: "Restock and reopen preorders", detail: "Get inventory back in hand and turn checkout back on.", done: false },
    { title: "Reach every ORU residence hall", detail: "Grow by word of mouth, RAs, and campus social media.", done: false },
    { title: "Build a student delivery team", detail: "Pay fellow students to handle drop-offs so it scales past me.", done: false },
    { title: "Expand to more campuses", detail: "Size strips for other universities' dorm doors and launch beyond ORU.", done: false },
  ],
  alsoWorkingOn: [
    "Freshman year at Oral Roberts University",
    "Playing cajon and drums for live music",
    "This portfolio, and collecting recommendations from people I've worked with",
  ],
};

/** The quick-facts card and the printable resume at /resume. */
export const resume = {
  lookingFor: "Internships, part-time roles, and projects in business, entrepreneurship, and tech",
  availability: "Open to opportunities · Summer 2027 and part-time during the school year",
  education: [
    {
      school: "Oral Roberts University",
      detail: "B.S., major to be added · Class of 2030",
      date: "2026 – 2030",
    },
    { school: "High school name", detail: "Graduated 2026", date: "2022 – 2026", placeholder: true },
  ] as { school: string; detail: string; date: string; placeholder?: boolean }[],
  experience: [
    {
      title: "Founder",
      org: "DarkDorms",
      date: "2026 – Present",
      points: [
        "Designed and launched a dorm-room product for ORU students, from idea to paid preorders.",
        "Set up the website, Stripe checkout, pricing, refund policy, and same-day student delivery.",
      ],
    },
    {
      title: "Snare / percussion member",
      org: "Colt Cadets Drum & Bugle Corps (DCI Open Class)",
      date: "Summer 2025",
      points: [
        "Earned a spot through auditions and toured with the corps through the DCI summer season.",
        "Rehearsed 10+ hours a day as part of a percussion section and ensemble.",
      ],
    },
    {
      title: "Cajon player",
      org: "The Anointing Co.",
      date: "2025",
      points: ["Played cajon at The Anointing Co.'s events and gatherings."],
    },
  ],
  skills: {
    Business: ["Starting & running a business", "Sales & customer service", "Pricing", "Stripe payments", "Social media marketing"],
    Tech: ["Websites & landing pages", "AI tools", "Problem solving"],
    Music: ["Snare & marching percussion", "Drum set", "Cajon"],
    People: ["Leadership", "Teamwork", "Communication", "Reliability"],
  } as Record<string, string[]>,
  interests: ["Entrepreneurship", "Drumming", "Running", "Sunsets & deep conversations"],
};

export const achievements: Achievement[] = [
  {
    title: "Founded DarkDorms",
    org: "darkdorms.com",
    date: "2026",
    category: "Business",
    description:
      "Started a business for my fellow ORU students: light-blocking door strips that keep dorm rooms dark at night. I built the brand, the site, and Stripe checkout, set pricing and policies, and deliver to students' rooms within 24 hours.",
    metric: "Founder",
    link: "https://darkdorms.com",
    featured: true,
  },
  {
    title: "Oral Roberts University, Class of 2030",
    org: "Oral Roberts University · Tulsa, OK",
    date: "Fall 2026",
    category: "School",
    description:
      "Admitted to ORU and featured in the university's official incoming-class introductions. Started my freshman year in Fall 2026.",
    metric: "Class of 2030",
    link: "https://www.instagram.com/p/Da0v_5GFuMb/",
    featured: true,
  },
  {
    title: "Marched with the Colt Cadets",
    org: "Colt Cadets Drum & Bugle Corps · DCI Open Class",
    date: "Summer 2025",
    category: "Music & Performance",
    description:
      "Auditioned and earned a spot in a Drum Corps International corps. Spent the summer rehearsing all day, touring, and competing as part of the percussion section.",
    metric: "DCI",
    featured: true,
  },
  {
    title: "Cajon for The Anointing Co.",
    org: "The Anointing Co. · Franklin, TN",
    date: "2025",
    category: "Music & Performance",
    description:
      "Regularly played cajon for The Anointing Co., a clothing brand, at their events and gatherings.",
    metric: "Cajon",
  },
  {
    title: "High school honors & band leadership",
    org: "High school name",
    date: "Add year",
    category: "Leadership",
    description:
      "Add your high school, GPA or honors, and band roles such as section leader, All-State, or district honors.",
    placeholder: true,
  },
];

export const strengths: Strength[] = [
  {
    name: "Discipline",
    level: 95,
    description:
      "Drumming taught me to show up early, prepared, and ready to repeat it until it's right.",
    evidence: ["Colt Cadets 2025", "School + business at once"],
  },
  {
    name: "Entrepreneurship",
    level: 90,
    description:
      "I see a need, build a plan, and get the first customer. Then I make it repeatable.",
    evidence: ["Founded DarkDorms", "Idea to paid preorders"],
  },
  {
    name: "Leadership",
    level: 88,
    description:
      "I lead by example and by teaching, whether that's a section of musicians or a small crew.",
    evidence: ["Running DarkDorms", "Percussion section"],
  },
  {
    name: "Communication",
    level: 86,
    description:
      "Clear, honest, and on time. Clients and mentors always know where things stand.",
    evidence: ["Texting every customer", "Live performance"],
  },
  {
    name: "Teamwork",
    level: 92,
    description:
      "A drumline moving as one doesn't happen without trust. I bring that to every team.",
    evidence: ["Drum corps", "The Anointing Co."],
  },
  {
    name: "Work Ethic",
    level: 97,
    description:
      "I finish what I start, and I do the unglamorous parts with the same care as the rest.",
    evidence: ["Ask my references below"],
  },
];

/** Options shown in the "How do you know Maxwell?" field. */
export const relationshipTypes = [
  "Employer",
  "Client",
  "Pastor / Ministry",
  "Teacher / Professor",
  "Coach / Instructor",
  "Colleague / Teammate",
  "Mentor",
  "Other",
] as const;
