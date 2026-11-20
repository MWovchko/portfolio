"use client";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

const ease = [0.22, 1, 0.36, 1] as const;

function SplitLine({ text, delay, gradient }: { text: string; delay: number; gradient?: boolean }) {
  return (
    <span className="line">
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          className={`char ${gradient ? "grad-text" : ""}`}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ delay: delay + i * 0.035, duration: 0.9, ease }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(8px)"]);

  const [roleIdx, setRoleIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % profile.roles.length), 2200);
    return () => clearInterval(t);
  }, []);

  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="container" style={{ y, opacity, scale, filter: blur }}>
        <motion.div
          className="hero-tag"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="dot-live" />
          <span>{profile.location}</span>
        </motion.div>

        <h1>
          <SplitLine text={first} delay={0.1} />
          <SplitLine text={last} delay={0.35} gradient />
        </h1>

        <motion.div
          className="hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span style={{ color: "var(--cyan)" }}>&gt;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIdx}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
            >
              {profile.roles[roleIdx]}
            </motion.span>
          </AnimatePresence>
          <span className="caret" />
        </motion.div>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7, ease }}
        >
          <a href="#achievements" className="btn btn-primary">
            See my work <span aria-hidden>→</span>
          </a>
          <a href="#recommend" className="btn">
            <span aria-hidden style={{ color: "var(--star)" }}>★</span> Recommend me
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="scroll-cue" style={{ opacity }}>
        SCROLL
        <motion.span
          className="bar"
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
