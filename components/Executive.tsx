"use client";
/** Hero for the professional "Executive" version: editorial, black / white / sage. */
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { now, profile, resume } from "@/content/profile";
import { Magnetic } from "./Effects";

const ease = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  return (
    <span className="mask" style={{ display: "block" }}>
      <motion.span
        className={`mask-inner ${className ?? ""}`}
        style={{ display: "block" }}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 1.1, ease }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ExecutiveHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const archY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const outlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 110, damping: 16 });
  const sry = useSpring(ry, { stiffness: 110, damping: 16 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      ry.set((e.clientX / window.innerWidth - 0.5) * 10);
      rx.set(-(e.clientY / window.innerHeight - 0.5) * 8);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [rx, ry]);

  const school = resume.education[0];

  return (
    <section className="exec-hero" id="top" ref={ref}>
      <div className="container">
        <motion.div
          className="exec-meta mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <span>Portfolio · {new Date().getFullYear()}</span>
          <span className="exec-hide-sm">{profile.location}</span>
          <span className="exec-avail">
            <i /> Available for internships
          </span>
        </motion.div>

        <div className="exec-grid">
          <motion.div className="exec-copy" style={{ y: textY }}>
            <motion.div
              className="exec-eyebrow mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7 }}
            >
              {now.venture.role}, {now.venture.name} · ORU Class of 2030
            </motion.div>
            <h1 className="exec-name">
              <Line delay={1.05}>{profile.firstName}</Line>
              <Line delay={1.18} className="exec-italic">
                {profile.name.split(" ").slice(1).join(" ")}.
              </Line>
            </h1>
            <motion.p
              className="exec-lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease }}
            >
              Student entrepreneur building <strong>{now.venture.name}</strong>, a product for college dorm rooms.
              Disciplined by drum corps, focused on serving people well, and looking for my next opportunity in business.
            </motion.p>
            <motion.div
              className="exec-ctas"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.55, duration: 0.8, ease }}
            >
              <Magnetic>
                <a className="btn btn-primary" href="/resume" target="_blank">
                  Download resume <span aria-hidden>↓</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={`mailto:${profile.contact.email}`}>
                  {profile.contact.email}
                </a>
              </Magnetic>
            </motion.div>

            <motion.dl
              className="exec-facts"
              initial="h"
              animate="s"
              variants={{ s: { transition: { staggerChildren: 0.1, delayChildren: 1.7 } } }}
            >
              {[
                { k: "Founder", v: now.venture.name, d: now.venture.since },
                { k: "DCI", v: "Colt Cadets", d: "2025" },
                { k: "Education", v: school.school.replace("University", "Univ."), d: "Class of 2030" },
              ].map((f) => (
                <motion.div key={f.k} variants={{ h: { opacity: 0, y: 14 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease }}>
                  <dt className="mono">{f.k}</dt>
                  <dd>{f.v}</dd>
                  <dd className="exec-fact-d">{f.d}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>

          <div className="exec-visual" aria-hidden>
            <motion.div className="exec-outline" style={{ y: outlineY }} />
            <motion.div
              className="exec-arch"
              style={{ y: archY, rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
              initial={{ clipPath: "inset(100% 0 0 0 round 999px 999px 28px 28px)" }}
              animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 28px 28px)" }}
              transition={{ delay: 0.95, duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="exec-arch-grain" />
            </motion.div>
            <motion.img
              src="/images/maxwell-suit.webp"
              alt=""
              className="exec-photo"
              style={{ y: photoY, rotateY: sry, transformPerspective: 1200 }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 1.3, ease }}
            />
            <motion.div
              className="exec-chip"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9, duration: 0.8, ease }}
            >
              <span className="mono">NOW</span>
              <strong>Building {now.venture.name}</strong>
              <span className="exec-chip-sub">{now.venture.status}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
