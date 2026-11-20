"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="progress" style={{ scaleX }} />;
}

export function Background() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "60%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["40%", "-20%"]);
  const hue = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const filter = useTransform(hue, (h) => `blur(90px) hue-rotate(${h}deg)`);
  return (
    <>
      <div className="bg-grid" />
      <motion.div
        className="bg-orb"
        style={{ width: 620, height: 620, left: "-12%", top: y1, background: "#3ee6ff", filter }}
      />
      <motion.div
        className="bg-orb"
        style={{ width: 560, height: 560, right: "-14%", top: y2, background: "#8b5cf6", filter }}
      />
      <div className="bg-noise" />
    </>
  );
}

const LINKS = [
  { id: "about", label: "About" },
  { id: "now", label: "Now" },
  { id: "achievements", label: "Achievements" },
  { id: "strengths", label: "Strengths", hideSm: true },
  { id: "resume", label: "Resume" },
  { id: "recommendations", label: "Reviews" },
  { id: "contact", label: "Contact", hideSm: true },
];

export function Nav() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    const hero = document.getElementById("top");
    if (hero) obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.nav
      className="nav"
      initial={{ y: -80, opacity: 0, x: "-50%" }}
      animate={{ y: 0, opacity: 1, x: "-50%" }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform: undefined }}
    >
      <a href="#top" className="nav-logo" aria-label="Back to top">
        {profile.initials}
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={`nav-link ${active === l.id ? "active" : ""} ${l.hideSm ? "nav-hide-sm" : ""}`}
          >
            {active === l.id && (
              <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
            )}
            {l.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

/** Tracks the cursor so .panel-glow cards light up where you hover. */
export function useGlow() {
  return (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
}
