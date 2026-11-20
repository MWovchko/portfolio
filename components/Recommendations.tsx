"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile, relationshipTypes } from "@/content/profile";
import type { PublicRecommendation } from "@/lib/store";
import { useGlow } from "./Chrome";
import { ParallaxLayer } from "./Effects";
import { Reveal, SectionHead } from "./Sections";
import { StarPicker, Stars } from "./Stars";

const ease = [0.22, 1, 0.36, 1] as const;

interface Summary {
  count: number;
  average: number;
  distribution: { star: number; count: number }[];
}

const initials = (n: string) =>
  n
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function RecommendForm({ compact = false }: { compact?: boolean }) {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!rating) return setError("Please choose a star rating.");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, rating, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  return (
    <div className="panel" id={compact ? undefined : "recommend"} style={{ scrollMarginTop: 90 }}>
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            className="form-success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.div
              className="check-circle"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </motion.div>
            <h3 style={{ fontSize: 26, margin: 0 }}>Thank you!</h3>
            <p style={{ color: "var(--muted)", margin: 0, maxWidth: 440 }}>
              Your recommendation was received. It will appear on the site once {profile.firstName} has reviewed it.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" className="form" onSubmit={onSubmit} exit={{ opacity: 0 }} noValidate>
            <div>
              <h3 style={{ fontSize: 26, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                Recommend {profile.firstName}
              </h3>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: 15 }}>
                Worked with {profile.firstName}? Employers, pastors, teachers, coaches, and clients: your words mean a lot.
              </p>
            </div>

            <div className="field">
              <label>Your rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input className="input" id="name" name="name" required maxLength={80} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="relationship">How do you know {profile.firstName}?</label>
                <select className="select" id="relationship" name="relationship" required defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  {relationshipTypes.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="organization">
                  Organization / church / company <span className="opt">(optional)</span>
                </label>
                <input className="input" id="organization" name="organization" maxLength={100} autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="role">
                  Your title <span className="opt">(optional)</span>
                </label>
                <input className="input" id="role" name="role" maxLength={80} placeholder="e.g. Owner, Lead Pastor" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="message">Your recommendation</label>
              <textarea
                className="textarea"
                id="message"
                name="message"
                required
                minLength={20}
                maxLength={1200}
                placeholder={`What was it like working with ${profile.firstName}? What stood out?`}
              />
            </div>

            <div className="field">
              <label htmlFor="email">
                Email <span className="opt">(optional, private, only used to verify)</span>
              </label>
              <input className="input" id="email" name="email" type="email" maxLength={120} autoComplete="email" />
            </div>

            {/* Honeypot: hidden from people, bots fill it in. */}
            <div className="hp" aria-hidden>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Submit recommendation"}
              </button>
              <span className="form-note">Reviewed before publishing. Your email is never shown.</span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Recommendations() {
  const [data, setData] = useState<{ summary: Summary; recommendations: PublicRecommendation[] } | null>(null);
  const glow = useGlow();

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ summary: { count: 0, average: 0, distribution: [] }, recommendations: [] }));
  }, []);

  const summary = data?.summary;
  const recs = data?.recommendations ?? [];
  const max = Math.max(1, ...(summary?.distribution.map((d) => d.count) ?? [1]));

  return (
    <section id="recommendations">
      <ParallaxLayer speed={0.9} className="deco deco-star" style={{ right: "8%", top: "6%" }}>★</ParallaxLayer>
      <div className="container">
        <SectionHead
          eyebrow="06 / Recommendations"
          title={<>Don&apos;t take <span className="grad-text">my word for it.</span></>}
          lead="Ratings and testimonials from employers, pastors, teachers, and clients I've worked with. Every one is from a real person and reviewed before it's posted."
        />

        <div className="rec-top">
          <Reveal>
            <div className="panel score" style={{ height: "100%" }}>
              <div className="mono" style={{ color: "var(--muted)", fontSize: 13, letterSpacing: ".1em" }}>
                OVERALL RATING
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 14 }}>
                <span className="score-big">{summary?.count ? summary.average.toFixed(1) : "–"}</span>
                <span style={{ color: "var(--muted)", marginBottom: 12 }}>/ 5</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <Stars value={summary?.average ?? 0} size={24} />
              </div>
              <div className="score-sub">
                {summary?.count
                  ? `Based on ${summary.count} recommendation${summary.count === 1 ? "" : "s"}`
                  : "Be the first to leave a rating"}
              </div>
              <div className="dist">
                {(summary?.distribution ?? [5, 4, 3, 2, 1].map((star) => ({ star, count: 0 }))).map((d, i) => (
                  <div className="dist-row" key={d.star}>
                    <span>{d.star}★</span>
                    <div className="dist-bar">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: d.count / max }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 * i, ease }}
                      />
                    </div>
                    <span style={{ textAlign: "right" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <RecommendForm />
          </Reveal>
        </div>

        {recs.length > 0 ? (
          <div className="rec-list">
            {recs.map((r, i) => (
              <Reveal key={r.id} delay={(i % 2) * 0.1}>
                <div className="panel panel-glow rec-card" onMouseMove={glow} style={{ height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <Stars value={r.rating} size={18} />
                    <span className="rel-tag">{r.relationship}</span>
                  </div>
                  <blockquote>{r.message}</blockquote>
                  <div className="rec-who">
                    <span className="avatar">{initials(r.name)}</span>
                    <div>
                      <div className="rec-name">{r.name}</div>
                      <div className="rec-meta">{[r.role, r.organization].filter(Boolean).join(" · ")}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          data && (
            <Reveal>
              <div className="panel empty-recs">
                <Stars value={0} size={28} />
                <div>No public recommendations yet. Know {profile.firstName}? Leave the first one above.</div>
              </div>
            </Reveal>
          )
        )}
      </div>
    </section>
  );
}
