"use client";
import { motion } from "framer-motion";
import { copy, media } from "@/content/profile";
import { eyebrow, TitleText } from "@/lib/site";
import { Reveal, SectionHead } from "./Sections";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Media() {
  return (
    <section id="media">
      <div className="container">
        <SectionHead
          eyebrow={eyebrow("media")}
          title={<TitleText t={copy.media.title} />}
          lead={copy.media.lead}
        />
        <div className="media-grid">
          {media.map((m, i) => (
            <Reveal key={m.href} delay={(i % 2) * 0.08}>
              <motion.a
                className="panel media-card"
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="media-top mono">
                  <span>{m.show}</span>
                  <span>{m.episode}</span>
                </div>
                <h3>{m.title}</h3>
                {m.quote && <blockquote>{m.quote}</blockquote>}
                <div className="media-foot">
                  <span className="mono">{m.date}</span>
                  <span className="media-play">
                    {copy.media.linkLabel} <span aria-hidden>↗</span>
                  </span>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
