"use client";
/**
 * Premium motion layer:
 *  - Loader: intro counter + curtain wipe (smooth loader)
 *  - SmoothScroll: Lenis inertial scrolling (also smooths anchor links)
 *  - Cursor: dot + ring cursor that reacts to links/buttons (micro interaction)
 *  - Magnetic: elements that pull toward the pointer (hover effect)
 *  - RevealText: masked word-by-word entrance reveal
 *  - ParallaxLayer: scroll-linked depth for decorative shapes
 */
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const ease = [0.76, 0, 0.24, 1] as const;

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------- Loader ---------------- */
export function Loader({ label = "MW" }: { label?: string }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("loader-seen") === "1";
    } catch {}
    if (seen || prefersReduced()) {
      setDone(true);
      return;
    }
    document.documentElement.classList.add("is-loading");
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          document.documentElement.classList.remove("is-loading");
          try {
            sessionStorage.setItem("loader-seen", "1");
          } catch {}
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease }}
          aria-hidden
        >
          <motion.div
            className="loader-mark"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {label}
          </motion.div>
          <div className="loader-bar">
            <div style={{ transform: `scaleX(${count / 100})` }} />
          </div>
          <div className="loader-count mono">{String(count).padStart(3, "0")}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Smooth scroll ---------------- */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -20 } });
    document.documentElement.style.scrollBehavior = "auto";
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}

/* ---------------- Cursor ---------------- */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReduced()) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, select, input, textarea, [data-cursor]"));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className={`cursor-ring ${hover ? "hover" : ""}`}
        style={{ x: rx, y: ry }}
        animate={{ scale: down ? 0.75 : hover ? 1.8 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </>
  );
}

/* ---------------- Magnetic ---------------- */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className="magnetic"
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ---------------- Masked text reveal ---------------- */
export function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
    >
      {words.map((w, i) => (
        <span key={i} className="mask" aria-hidden>
          <motion.span
            className="mask-inner"
            variants={{ hidden: { y: "105%", rotate: 4 }, shown: { y: "0%", rotate: 0 } }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

/* ---------------- Parallax decorative layer ---------------- */
export function ParallaxLayer({
  speed = 0.3,
  className,
  style,
  children,
}: {
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, speed * 120]);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, y, rotate }} aria-hidden>
      {children}
    </motion.div>
  );
}

/* ---------------- 3D hero card ---------------- */
export function HeroCard3D({ lines }: { lines: { k: string; v: string }[] }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });
  const { scrollY } = useScroll();
  const scrollRot = useTransform(scrollY, [0, 800], [0, 35]);
  const rotateX = useTransform([srx, scrollRot], ([a, b]: number[]) => a + b);
  const shine = useTransform(sry, [-20, 20], ["0%", "100%"]);

  useEffect(() => {
    if (prefersReduced()) return;
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry.set(nx * 30);
      rx.set(-ny * 22);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [rx, ry]);

  return (
    <div className="hero3d" aria-hidden>
      <motion.div
        className="hero3d-card"
        style={{ rotateX, rotateY: sry, transformPerspective: 1000 }}
        initial={{ opacity: 0, y: 60, rotateZ: -6 }}
        animate={{ opacity: 1, y: 0, rotateZ: 0 }}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="hero3d-shine" style={{ backgroundPositionX: shine }} />
        <div className="hero3d-layer l1">
          <div className="mono hero3d-tag">ID · {new Date().getFullYear()}</div>
          <div className="hero3d-chip" />
        </div>
        <div className="hero3d-layer l2">
          {lines.map((l) => (
            <div key={l.k} className="hero3d-row">
              <span className="mono">{l.k}</span>
              <span>{l.v}</span>
            </div>
          ))}
        </div>
        <div className="hero3d-layer l3">
          <div className="hero3d-orb" />
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Photo heroes for the themed versions ---------------- */
export function HeroPhotoNeon() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const glowX = useTransform(sry, [-18, 18], ["20%", "80%"]);
  useEffect(() => {
    if (prefersReduced()) return;
    const move = (e: PointerEvent) => {
      ry.set((e.clientX / window.innerWidth - 0.5) * 24);
      rx.set(-(e.clientY / window.innerHeight - 0.5) * 18);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [rx, ry]);
  return (
    <motion.div className="hero-photo neon" style={{ y }} aria-hidden>
      <motion.div
        className="neon-frame"
        style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
        initial={{ opacity: 0, scale: 0.9, rotateZ: 4 }}
        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
        transition={{ delay: 1.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="neon-ring a" />
        <div className="neon-ring b" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/maxwell-neon.jpg" alt="" />
        <motion.div className="neon-sheen" style={{ left: glowX }} />
        <div className="neon-label mono">MW · FOUNDER</div>
      </motion.div>
    </motion.div>
  );
}

export function HeroPhotoNight() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 220]);
  const scale = useTransform(scrollY, [0, 900], [1.05, 1.2]);
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const light = useTransform([smx, smy], ([a, b]: number[]) =>
    `radial-gradient(360px circle at ${a}% ${b}%, rgba(94,234,212,.22), transparent 60%)`
  );
  useEffect(() => {
    if (prefersReduced()) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);
  return (
    <div className="hero-photo night" aria-hidden>
      <motion.div
        className="night-img"
        style={{ y, scale }}
        initial={{ opacity: 0, filter: "brightness(0)" }}
        animate={{ opacity: 1, filter: "brightness(1)" }}
        transition={{ delay: 0.9, duration: 2.2, ease: "easeOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/maxwell-night.jpg" alt="" />
      </motion.div>
      <motion.div className="night-light" style={{ background: light }} />
      <div className="night-fog" />
      <div className="night-stars" />
    </div>
  );
}
