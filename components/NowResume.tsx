"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { now, profile, resume } from "@/content/profile";
import { useGlow } from "./Chrome";
import { Reveal, SectionHead } from "./Sections";

const ease = [0.22, 1, 0.36, 1] as const;

export function Now() {
  const glow = useGlow();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const v = now.venture;

  return (
    <section id="now">
      <div className="container">
        <SectionHead
          eyebrow={`02 / Now · updated ${now.updated}`}
          title={
            <>
              What I&apos;m <span className="grad-text">building now.</span>
            </>
          }
        />
        <div className="now-grid" ref={ref}>
          <Reveal>
            <div className="panel panel-glow now-card" onMouseMove={glow}>
              <div className="now-head">
                <div>
                  <div className="t-cat">
                    {v.role} · since {v.since}
                  </div>
                  <h3 className="now-name">{v.name}</h3>
                </div>
                <span className="status-pill">
                  <span className="dot-live" style={{ background: "var(--star)", boxShadow: "0 0 12px var(--star)" }} />
                  {v.status}
                </span>
              </div>
              <p className="now-one">{v.oneLiner}</p>
              <p className="now-desc">{v.description}</p>
              <div className="now-facts">
                {v.facts.map((f, i) => (
                  <motion.div
                    key={f.label}
                    className="now-fact"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease }}
                  >
                    <div className="mono now-fact-label">{f.label}</div>
                    <div className="now-fact-value">{f.value}</div>
                    <div className="now-fact-note">{f.note}</div>
                  </motion.div>
                ))}
              </div>
              <a className="btn btn-primary" href={v.url} target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start" }}>
                Visit {v.url.replace("https://", "")} <span aria-hidden>↗</span>
              </a>
            </div>
          </Reveal>

          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <Reveal delay={0.1}>
              <div className="panel goals">
                <div className="mono" style={{ color: "var(--muted)", fontSize: 13, letterSpacing: ".1em" }}>
                  BUSINESS GOALS
                </div>
                <ol>
                  {now.goals.map((g, i) => (
                    <motion.li
                      key={g.title}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: i * 0.12, duration: 0.6, ease }}
                    >
                      <span className={`goal-check ${g.done ? "done" : ""}`}>{g.done ? "✓" : String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="goal-title">{g.title}</div>
                        <div className="goal-detail">{g.detail}</div>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="panel goals">
                <div className="mono" style={{ color: "var(--muted)", fontSize: 13, letterSpacing: ".1em" }}>
                  ALSO ON MY PLATE
                </div>
                <ul className="also">
                  {now.alsoWorkingOn.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <motion.div aria-hidden className="now-orb" style={{ rotate, y }} />
        </div>
      </div>
    </section>
  );
}

function vcardHref() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    `N:${profile.name.split(" ").slice(1).join(" ")};${profile.firstName};;;`,
    `TITLE:${now.venture.role}, ${now.venture.name}`,
    `ORG:${now.venture.name}`,
    profile.contact.email && `EMAIL:${profile.contact.email}`,
    profile.contact.phone && `TEL:${profile.contact.phone}`,
    `URL:${typeof window !== "undefined" ? window.location.origin : ""}`,
    `ADR:;;;${profile.location.split("·")[0].trim()};;;`,
    "END:VCARD",
  ].filter(Boolean);
  return "data:text/vcard;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
}

export function ResumeSection() {
  const glow = useGlow();
  return (
    <section id="resume">
      <div className="container">
        <SectionHead
          eyebrow="05 / Resume"
          title={
            <>
              The <span className="grad-text">quick facts.</span>
            </>
          }
          lead="Everything you need if you're hiring, networking, or just want to stay in touch."
        />

        <Reveal>
          <div className="panel looking">
            <div>
              <div className="mono" style={{ color: "var(--lime)", fontSize: 13, letterSpacing: ".1em" }}>
                ● {resume.availability.toUpperCase()}
              </div>
              <div className="looking-text">Looking for: {resume.lookingFor}</div>
            </div>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="/resume" target="_blank">
                Download resume <span aria-hidden>↓</span>
              </a>
              <a
                className="btn"
                href="#"
                onClick={(e) => {
                  e.currentTarget.href = vcardHref();
                }}
                download={`${profile.name.replace(/\s+/g, "-")}.vcf`}
              >
                Save contact
              </a>
              {profile.contact.email && (
                <a className="btn" href={`mailto:${profile.contact.email}`}>
                  Email me
                </a>
              )}
            </div>
          </div>
        </Reveal>

        <div className="resume-grid">
          <Reveal>
            <div className="panel panel-glow resume-block" onMouseMove={glow}>
              <h3>Experience</h3>
              {resume.experience.map((x) => (
                <div key={x.title + x.org} className="r-item">
                  <div className="r-row">
                    <strong>{x.title}</strong>
                    <span className="mono r-date">{x.date}</span>
                  </div>
                  <div className="r-org">{x.org}</div>
                  <ul>
                    {x.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <Reveal delay={0.1}>
              <div className="panel panel-glow resume-block" onMouseMove={glow}>
                <h3>Education</h3>
                {resume.education.map((e) => (
                  <div key={e.school} className="r-item">
                    <div className="r-row">
                      <strong>
                        {e.school} {e.placeholder && <span className="badge-draft mono">DRAFT</span>}
                      </strong>
                      <span className="mono r-date">{e.date}</span>
                    </div>
                    <div className="r-org">{e.detail}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="panel panel-glow resume-block" onMouseMove={glow}>
                <h3>Skills</h3>
                {Object.entries(resume.skills).map(([group, items]) => (
                  <div key={group} style={{ marginBottom: 14 }}>
                    <div className="mono r-date" style={{ marginBottom: 8 }}>
                      {group.toUpperCase()}
                    </div>
                    <div className="s-evidence">
                      {items.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mono r-date" style={{ margin: "18px 0 8px" }}>
                  INTERESTS
                </div>
                <div className="s-evidence">
                  {resume.interests.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
