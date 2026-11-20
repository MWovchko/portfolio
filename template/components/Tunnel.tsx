"use client";
/**
 * "Gallery" hero: a scroll-driven 3D tunnel built from the person's own work.
 * You fly down a spiral tunnel of panels toward a blue light, land in a
 * curved chamber where a figure stands on a glowing floor, and featured
 * work pops off the wall one at a time.
 */
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { achievements, config, copy, galleryFeatures, now, profile, resume, strengths } from "@/content/profile";

const RINGS = 9;
const PER_RING = 12;
const RADIUS = 620;
const RING_DEPTH = 520;
const DEPTH = RINGS * RING_DEPTH;

const IMAGES = [
  "linear-gradient(135deg,#ff5a1f,#ffb020)",
  "linear-gradient(160deg,#0b1e5b,#1f6bff 60%,#7cc4ff)",
  "linear-gradient(135deg,#0f766e,#5eead4)",
  "linear-gradient(200deg,#ff3d6e,#7a1cff)",
  "radial-gradient(circle at 30% 30%,#ffe08a,#ff7a1a 45%,#5a1300)",
  "linear-gradient(135deg,#111,#3b3b3b)",
  "linear-gradient(120deg,#d6f5ff,#5aa9ff)",
  "linear-gradient(135deg,#e11d48,#fb923c)",
];
const BGS = ["#f7f5f0", "#0d0f14", "#ffffff", "#eef3ff", "#101826", "#fff6ea"];

type Tile = { title: string; sub: string; kind: number; img: string; bg: string };

function useTiles(): Tile[] {
  return useMemo(() => {
    const words: { title: string; sub: string }[] = [
      ...achievements.filter((a) => !a.placeholder).map((a) => ({ title: a.title, sub: a.org ?? a.category })),
      ...strengths.map((s) => ({ title: s.name, sub: s.description })),
      ...(config.features.now ? now.venture.facts.map((f) => ({ title: f.value, sub: f.label })) : []),
      ...(config.features.now ? now.goals.map((g) => ({ title: g.title, sub: g.detail })) : []),
      ...Object.entries(resume.skills).flatMap(([g, items]) => items.slice(0, 2).map((i) => ({ title: i, sub: g }))),
      { title: profile.name, sub: profile.headline },
      ...(config.features.now ? [{ title: now.venture.name, sub: now.venture.oneLiner }] : []),
      ...resume.education.filter((e) => !e.placeholder).map((e) => ({ title: e.school, sub: e.detail })),
    ];
    const out: Tile[] = [];
    for (let i = 0; i < RINGS * PER_RING; i++) {
      const w = words[(i * 7) % words.length];
      out.push({ ...w, kind: i % 4, img: IMAGES[(i * 5) % IMAGES.length], bg: BGS[(i * 3) % BGS.length] });
    }
    return out;
  }, []);
}

function Panel({ t, w, h }: { t: Tile; w: number; h: number }) {
  const dark = t.bg === "#0d0f14" || t.bg === "#101826";
  return (
    <div className="tp" style={{ width: w, height: h, background: t.bg, color: dark ? "#f3f4f6" : "#111" }}>
      <div className="tp-bar">
        <i /> <i /> <i /> <span style={{ background: dark ? "#ffffff22" : "#00000014" }} />
      </div>
      {t.kind === 0 && (
        <div className="tp-body k0">
          <div className="tp-img" style={{ background: t.img }} />
          <div className="tp-title">{t.title}</div>
          <div className="tp-sub">{t.sub}</div>
        </div>
      )}
      {t.kind === 1 && (
        <div className="tp-body k1">
          <div>
            <div className="tp-title big">{t.title}</div>
            <div className="tp-sub">{t.sub}</div>
            <div className="tp-btn" style={{ background: dark ? "#fff" : "#111", color: dark ? "#111" : "#fff" }}>
              View
            </div>
          </div>
          <div className="tp-img" style={{ background: t.img }} />
        </div>
      )}
      {t.kind === 2 && (
        <div className="tp-body k2" style={{ background: t.img }}>
          <div className="tp-title big" style={{ color: "#fff" }}>
            {t.title}
          </div>
        </div>
      )}
      {t.kind === 3 && (
        <div className="tp-body k3">
          <div className="tp-title">{t.title}</div>
          <div className="tp-grid">
            <div style={{ background: t.img }} />
            <div style={{ background: IMAGES[(t.title.length + 2) % IMAGES.length] }} />
            <div style={{ background: IMAGES[(t.title.length + 5) % IMAGES.length] }} />
          </div>
          <div className="tp-sub">{t.sub}</div>
        </div>
      )}
    </div>
  );
}

function TunnelWorld({ progress, tiles }: { progress: MotionValue<number>; tiles: Tile[] }) {
  const z = useTransform(progress, [0, 0.62], [0, DEPTH - 250]);
  const rot = useTransform(progress, [0, 0.62], [0, 120]);
  const panelW = Math.round((2 * Math.PI * RADIUS) / PER_RING) - 14;
  const panelH = RING_DEPTH - 24;
  return (
    <motion.div className="tw" style={{ z, rotateZ: rot }}>
      {Array.from({ length: RINGS }).map((_, r) => (
        <div key={r} className="tw-ring" style={{ transform: `translateZ(${-r * RING_DEPTH - RING_DEPTH / 2}px) rotateZ(${r * 11}deg)` }}>
          {Array.from({ length: PER_RING }).map((_, i) => {
            const t = tiles[r * PER_RING + i];
            const a = (360 / PER_RING) * i;
            return (
              <div
                key={i}
                className="tw-panel"
                style={{
                  width: panelW,
                  height: panelH,
                  marginLeft: -panelW / 2,
                  marginTop: -panelH / 2,
                  transform: `rotateZ(${a}deg) translateY(${RADIUS}px) rotateX(90deg)`,
                }}
              >
                <Panel t={t} w={panelW} h={panelH} />
              </div>
            );
          })}
        </div>
      ))}
      <div className="tw-light" style={{ transform: `translateZ(${-DEPTH - 50}px)` }} />
    </motion.div>
  );
}

function Silhouette() {
  return (
    <svg viewBox="0 0 60 160" className="sil" aria-hidden>
      <ellipse cx="30" cy="14" rx="9" ry="11" />
      <path d="M17 30 Q30 24 43 30 L49 78 Q46 82 42 80 L40 60 L39 100 L41 156 L33 156 L31 104 L29 104 L27 156 L19 156 L21 100 L20 60 L18 80 Q14 82 11 78 Z" />
    </svg>
  );
}

const FEATURE_BGS = [
  "linear-gradient(160deg,#0b1020,#1b2140 40%,#6b4bff 75%,#ffb020)",
  "linear-gradient(135deg,#7f1d1d,#ef4444 45%,#fbbf24)",
  "linear-gradient(135deg,#0c4a6e,#38bdf8 55%,#facc15)",
];
/** Chamber cards: galleryFeatures from profile.ts, or the first three featured achievements. */
const FEATURES = (
  galleryFeatures.length
    ? galleryFeatures
    : achievements
        .filter((a) => a.featured && !a.placeholder)
        .slice(0, 3)
        .map((a) => ({ name: a.title, tag: [a.metric, a.date].filter(Boolean).join(" · "), line: a.description.split(". ")[0] + ".", img: undefined }))
).map((f, i) => ({ ...f, img: f.img ?? FEATURE_BGS[i % FEATURE_BGS.length] }));

function Chamber({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.56, 0.66], [0, 1]);
  const scale = useTransform(progress, [0.56, 0.75], [1.25, 1]);
  const wallRot = useTransform(progress, [0.6, 1], [-14, 14]);
  const [idx, setIdx] = useState(-1);
  const pick = (p: number) => (p < 0.7 ? -1 : Math.min(FEATURES.length - 1, Math.floor((p - 0.7) / 0.1)));
  useMotionValueEvent(progress, "change", (p) => setIdx(pick(p)));
  useEffect(() => {
    // Also sync on mount / when the page loads already scrolled.
    setIdx(pick(progress.get()));
    const t = setInterval(() => setIdx(pick(progress.get())), 400);
    return () => clearInterval(t);
  }, [progress]);
  const wallPanels = 18;
  return (
    <motion.div className="ch" style={{ opacity }} data-idx={idx}>
      <motion.div className="ch-scene" style={{ scale }}>
        <motion.div className="ch-wall" style={{ rotateY: wallRot }}>
          {Array.from({ length: wallPanels }).map((_, i) => {
            const a = -95 + (190 / (wallPanels - 1)) * i;
            const row = i % 3;
            return (
              <div
                key={i}
                className="ch-panel"
                style={{
                  transform: `rotateY(${a}deg) translateZ(-900px) translateY(${(row - 1) * 150}px)`,
                  background: IMAGES[(i * 3) % IMAGES.length],
                }}
              >
                <div className="ch-panel-in" style={{ background: BGS[i % BGS.length] }}>
                  <div style={{ background: IMAGES[(i * 5 + 1) % IMAGES.length] }} />
                </div>
              </div>
            );
          })}
        </motion.div>
        <div className="ch-floor" />
        <div className="ch-figure">
          <Silhouette />
          <div className="ch-shadow" />
        </div>
      </motion.div>

      {FEATURES.map((f, i) => (
        <motion.div
          key={f.name}
          className="ch-feature"
          initial={false}
          animate={idx === i ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : { opacity: 0, y: 40, scale: 0.85, rotateX: 18 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ch-card" style={{ background: f.img }}>
            <div className="ch-card-top mono">{f.tag}</div>
            <div className="ch-card-line">{f.line}</div>
          </div>
        </motion.div>
      ))}
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.name + "l"}
          className="ch-label"
          initial={false}
          animate={idx === i ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, delay: idx === i ? 0.15 : 0 }}
        >
          <div className="ch-label-name">{f.name}</div>
          <div className="ch-label-tag">{f.tag}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function TunnelHero() {
  const ref = useRef<HTMLElement>(null);
  const tiles = useTiles();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  const introOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const introY = useTransform(p, [0, 0.1], [0, -80]);
  const tunnelOpacity = useTransform(p, [0.58, 0.66], [1, 0]);
  const flash = useTransform(p, [0.52, 0.6, 0.68], [0, 1, 0]);
  const hint = useTransform(p, [0.9, 0.98], [1, 0]);

  return (
    <section ref={ref} className="tunnel" id="top" aria-label={`${profile.name}: intro`}>
      <div className="tunnel-stage">
        <div className="aurora" aria-hidden>
          <span className="a1" />
          <span className="a2" />
          <span className="a3" />
        </div>
        <motion.div className="tunnel-view" style={{ opacity: tunnelOpacity }} aria-hidden>
          <TunnelWorld progress={p} tiles={tiles} />
        </motion.div>
        <Chamber progress={p} />
        <motion.div className="tunnel-flash" style={{ opacity: flash }} aria-hidden />

        <motion.div className="tunnel-intro" style={{ opacity: introOpacity, y: introY }}>
          <motion.div
            className="mono tunnel-kicker"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {profile.headline}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(16px)", letterSpacing: "0.2em" }}
            animate={{ opacity: 1, filter: "blur(0px)", letterSpacing: "-0.02em" }}
            transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
            {copy.hero.galleryIntro}
          </motion.p>
        </motion.div>

        <motion.div className="tunnel-hint mono" style={{ opacity: hint }}>
          <span>SCROLL</span>
          <motion.i animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} />
        </motion.div>
      </div>
    </section>
  );
}
