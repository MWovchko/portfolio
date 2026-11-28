import type { Metadata } from "next";
import Link from "next/link";
import { config, profile } from "@/content/profile";
import { THEME_LABELS } from "@/lib/site";
import type { Theme } from "@/content/types";

/**
 * Theme gallery (Archer's idea p2: Iris + Paige). Shows every look filled with the template's fictional
 * sample person, so a new client can click through and pick one. No real person's details appear here.
 */
export const metadata: Metadata = { title: "Pick your look · Portfolio themes", robots: { index: false, follow: false } };

const ABOUT: Record<Theme, { mood: string; best: string; photo: string }> = {
  executive: { mood: "Light, editorial, serif name, photo in an arch.", best: "Business people, executives, job seekers.", photo: "Headshot or suit portrait." },
  neon: { mood: "Dark, bold type, glowing 3D photo frame.", best: "Students, creatives, founders, musicians.", photo: "Colorful, well-lit portrait." },
  night: { mood: "Near-black, huge serif, photo fades out of the dark.", best: "Artists, photographers, moody brands.", photo: "Dark, low-key photo." },
  gallery: { mood: "A 3D scroll tunnel through your work.", best: "Designers, builders, artists with lots to show.", photo: "Optional." },
  original: { mood: "Dark tech look with a 3D ID card.", best: "Engineers and technical people.", photo: "Optional." },
};

export default function Themes() {
  const all: Theme[] = [config.theme, ...config.alternates.filter((t) => t !== config.theme)];
  return (
    <main style={{ minHeight: "100vh", background: "#0f1115", color: "#f2f2f0", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", padding: "32px 16px 64px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", margin: 0 }}>Pick your look</h1>
        <p style={{ color: "#a8abb3", fontSize: 17, maxWidth: 640 }}>
          Every look has the same features: smooth scrolling, your story, proud moments, strengths, a printable resume and optional recommendations.
          Shown here with a sample person, {profile.name}. Yours gets colors taken from your own photo.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 20, marginTop: 24 }}>
          {all.map((t) => {
            const href = t === config.theme ? "/" : `/${t}`;
            return (
              <article key={t} style={{ background: "#171a20", border: "1px solid #2a2e37", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", background: "#000" }}>
                  {/* Live preview of the real page, scaled down. Not interactive; open it for the full experience. */}
                  <iframe src={href} title={`${THEME_LABELS[t]} preview`} loading="lazy" tabIndex={-1} aria-hidden="true"
                    style={{ width: "1280px", height: "800px", border: 0, transform: "scale(0.3)", transformOrigin: "0 0", pointerEvents: "none" }} />
                </div>
                <div style={{ padding: 16 }}>
                  <h2 style={{ margin: 0, fontSize: 22 }}>{THEME_LABELS[t]}</h2>
                  <p style={{ margin: "6px 0 0", color: "#c9ccd3" }}>{ABOUT[t].mood}</p>
                  <p style={{ margin: "6px 0 0", color: "#a8abb3", fontSize: 14 }}><b style={{ color: "#f2f2f0" }}>Best for:</b> {ABOUT[t].best}<br /><b style={{ color: "#f2f2f0" }}>Photo:</b> {ABOUT[t].photo}</p>
                  <Link href={href} style={{ display: "inline-block", marginTop: 12, padding: "8px 14px", borderRadius: 999, background: "#f2f2f0", color: "#0f1115", textDecoration: "none", fontWeight: 600 }}>Open {THEME_LABELS[t]}</Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
