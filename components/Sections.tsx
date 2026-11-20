"use client";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { achievements, profile, strengths, type AchievementCategory } from "@/content/profile";
import { useGlow } from "./Chrome";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return (
    <>
      <Reveal>
        <div className="eyebrow">{eyebrow}</div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="section-title">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="section-lead">{lead}</p>
        </Reveal>
      )}
    </>
  );
}

/* ---------------- About ---------------- */

function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span className="w" style={{ opacity }}>
      {children}
    </motion.span>
  );
}

function ScrollParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref}>
      {words.map((w, i) => {
        const start = i / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
            {w + (i < words.length - 1 ? " " : "")}
          </Word>
        );
      })}
    </p>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    // Years (e.g. 2030) count up from a nearby value so they don't spin through thousands.
    const from = to > 1000 ? to - 30 : 0;
    const c = animate(from, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setVal(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export function About() {
  const glow = useGlow();
  return (
    <section id="about">
      <div className="container">
        <SectionHead eyebrow="01 / About" title={<>Built on <span className="grad-text">discipline.</span></>} />
        <div className="about-grid">
          <div className="about-text">
            {profile.bio.map((p, i) => (
              <ScrollParagraph key={i} text={p} />
            ))}
          </div>
          <div className="stats">
            {profile.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="panel panel-glow stat" onMouseMove={glow}>
                  <div className="stat-value">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="stat-label">
                    {s.label} {s.placeholder && <span className="badge-draft mono">DRAFT</span>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */

export function Achievements() {
  const cats = useMemo(
    () => ["All", ...Array.from(new Set(achievements.map((a) => a.category)))] as ("All" | AchievementCategory)[],
    []
  );
  const [filter, setFilter] = useState<"All" | AchievementCategory>("All");
  const items = achievements.filter((a) => filter === "All" || a.category === filter);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const glow = useGlow();

  return (
    <section id="achievements">
      <div className="container">
        <SectionHead
          eyebrow="03 / Achievements"
          title={<>Milestones, <span className="grad-text">big and small.</span></>}
          lead="Business, school, and music. Here's what I've done so far, and I'm adding to it as I go."
        />
        <Reveal>
          <div className="filters" role="tablist" aria-label="Filter achievements">
            {cats.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                className={`chip ${filter === c ? "active" : ""}`}
                onClick={() => setFilter(c)}
                style={{ isolation: "isolate" }}
              >
                {filter === c && <motion.span layoutId="chip-bg" className="chip-bg" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="timeline" ref={ref}>
          <div className="timeline-track">
            <motion.div className="timeline-fill" style={{ scaleY }} />
          </div>
          <AnimatePresence mode="popLayout">
            {items.map((a, i) => {
              const right = i % 2 === 1;
              return (
                <motion.div
                  layout
                  key={a.title}
                  className={`t-item ${right ? "right" : ""}`}
                  initial={{ opacity: 0, x: right ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease }}
                >
                  <motion.span
                    className="t-node"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                  />
                  <span className="t-date">{a.date}</span>
                  <article className={`panel panel-glow t-card ${a.featured ? "featured" : ""}`} onMouseMove={glow}>
                    {a.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="t-img" src={a.image} alt="" loading="lazy" />
                    )}
                    {a.metric && <span className="t-metric">{a.metric}</span>}
                    <div className="t-cat">
                      {a.category}
                      {a.placeholder && <span className="badge-draft">DRAFT</span>}
                    </div>
                    <h3>{a.title}</h3>
                    {a.org && <div className="t-org">{a.org}</div>}
                    <p>{a.description}</p>
                    {a.link && (
                      <a className="t-link" href={a.link} target="_blank" rel="noopener noreferrer">
                        View proof <span aria-hidden>↗</span>
                      </a>
                    )}
                  </article>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Marquee ---------------- */

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);
  const words = strengths.map((s) => s.name);
  const row = [...words, ...words, ...words];
  return (
    <div ref={ref} aria-hidden style={{ display: "grid", gap: 0 }}>
      <div className="marquee">
        <motion.div className="marquee-track" style={{ x: x1 }}>
          {row.map((w, i) => (
            <span key={i} className={i % 2 ? "o" : ""}>
              {w} <span style={{ color: "var(--cyan)" }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>
      <div className="marquee" style={{ borderTop: 0 }}>
        <motion.div className="marquee-track" style={{ x: x2 }}>
          {row.map((w, i) => (
            <span key={i} className={i % 2 ? "" : "o"}>
              {w} <span style={{ color: "var(--violet)" }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- Strengths ---------------- */

function TiltCard({ children }: { children: React.ReactNode }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const glow = useGlow();
  return (
    <motion.div
      className="panel panel-glow s-card"
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        glow(e);
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Strengths() {
  return (
    <section id="strengths">
      <div className="container">
        <SectionHead
          eyebrow="04 / Strengths"
          title={<>What I bring <span className="grad-text">to the team.</span></>}
          lead="The traits people I've worked with point to most, and where they come from."
        />
        <div className="strengths">
          {strengths.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 0.1}>
              <TiltCard>
                <div className="s-head">
                  <h3>{s.name}</h3>
                  <span className="s-num">0{i + 1}</span>
                </div>
                <div className="meter">
                  <motion.div
                    className="meter-fill"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: s.level / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 + (i % 3) * 0.1, ease }}
                  />
                </div>
                <p>{s.description}</p>
                <div className="s-evidence">
                  {s.evidence.map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

export function Footer() {
  const { contact } = profile;
  return (
    <footer id="contact">
      <div className="container">
        <motion.div
          className="footer-cta"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease }}
        >
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            07 / Contact
          </div>
          <h2>
            Let&apos;s build
            <br />
            <span className="grad-text">something.</span>
          </h2>
          <div className="footer-links">
            {contact.email && (
              <a className="btn btn-primary" href={`mailto:${contact.email}`}>
                Email me
              </a>
            )}
            {contact.links.filter((l) => !l.placeholder).map((l) => (
              <a key={l.label} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label} <span aria-hidden>↗</span>
              </a>
            ))}
            <a className="btn" href="#recommend">
              <span style={{ color: "var(--star)" }}>★</span> Leave a recommendation
            </a>
          </div>
        </motion.div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="mono">Built with Next.js · Hosted on Vercel</span>
        </div>
      </div>
    </footer>
  );
}
