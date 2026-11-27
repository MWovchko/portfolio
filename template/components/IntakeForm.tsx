"use client";
/**
 * Intake form → intake.json in the exact shape scripts/new-site.mjs reads (see examples/intake.example.json).
 * Questions written by Lyra to pull out specific, checkable stories; flow by Remy; wiring by Paige.
 * Nothing is uploaded or stored: the file is built in the browser and downloaded.
 */
import { useMemo, useState } from "react";

type Theme = "executive" | "neon" | "night" | "gallery" | "original";
type Ach = { title: string; org: string; date: string; category: string; description: string; metric: string; featured: boolean };
type Str = { name: string; description: string; evidence: string };
type Link = { label: string; href: string };

const THEMES: { id: Theme; name: string; for: string }[] = [
  { id: "executive", name: "Executive", for: "Clean and professional. Great for business, job seekers, anyone over 25." },
  { id: "neon", name: "Neon", for: "Bold, dark and glowing. Great for students, creatives, founders, musicians." },
  { id: "night", name: "Night", for: "Moody and artistic. Great with a dark photo." },
  { id: "gallery", name: "Gallery", for: "A 3D walk through your work. Great if you have lots to show." },
  { id: "original", name: "Original", for: "Dark tech look. Great for engineers." },
];
const CATS = ["Business", "School", "Leadership", "Community", "Music & Performance", "Sports", "Milestone", "Personal"];
const emptyAch = (): Ach => ({ title: "", org: "", date: "", category: "Milestone", description: "", metric: "", featured: false });

const S = {
  page: { minHeight: "100vh", background: "#f4f3ef", color: "#16181d", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", padding: "32px 16px 64px" } as const,
  wrap: { maxWidth: 760, margin: "0 auto" } as const,
  card: { background: "#fff", border: "1px solid #e3e1da", borderRadius: 14, padding: 18, marginTop: 16 } as const,
  label: { display: "block", fontWeight: 600, margin: "12px 0 4px" } as const,
  help: { color: "#62656e", fontSize: 14, margin: "0 0 6px" } as const,
  input: { width: "100%", boxSizing: "border-box", font: "inherit", padding: "9px 11px", border: "1px solid #cfccc3", borderRadius: 8, background: "#fffdf8" } as const,
  btn: { font: "inherit", padding: "9px 14px", borderRadius: 999, border: "1px solid #16181d", background: "#16181d", color: "#fff", cursor: "pointer" } as const,
  ghost: { font: "inherit", padding: "7px 12px", borderRadius: 999, border: "1px solid #cfccc3", background: "#fff", cursor: "pointer" } as const,
};

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return <div><label style={S.label}>{label}</label>{help && <p style={S.help}>{help}</p>}{children}</div>;
}

export default function IntakeForm() {
  const [f, setF] = useState({ name: "", headline: "", tagline: "", location: "", theme: "executive" as Theme, voice: "first" as "first" | "third", email: "", bio: "", lookingFor: "", availability: "", recommendations: true, photoNote: "" });
  const [links, setLinks] = useState<Link[]>([{ label: "LinkedIn", href: "" }]);
  const [achs, setAchs] = useState<Ach[]>([emptyAch(), emptyAch()]);
  const [strs, setStrs] = useState<Str[]>([{ name: "", description: "", evidence: "" }, { name: "", description: "", evidence: "" }, { name: "", description: "", evidence: "" }]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });

  const intake = useMemo(() => ({
    name: f.name.trim(), headline: f.headline.trim(), tagline: f.tagline.trim(), location: f.location.trim(),
    theme: f.theme, alternates: [], voice: f.voice, photo: null,
    ...(f.email.trim() ? { email: f.email.trim() } : {}),
    links: links.filter((l) => l.href.trim()).map((l) => ({ label: l.label.trim() || "Link", href: l.href.trim() })),
    bio: f.bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    stats: [],
    resume: { lookingFor: f.lookingFor.trim(), availability: f.availability.trim(), education: [], experience: [], skills: {}, interests: [] },
    achievements: achs.filter((a) => a.title.trim()).map((a) => ({ title: a.title.trim(), ...(a.org.trim() ? { org: a.org.trim() } : {}), date: a.date.trim(), category: a.category, description: a.description.trim(), ...(a.metric.trim() ? { metric: a.metric.trim() } : {}), ...(a.featured ? { featured: true } : {}) })),
    strengths: strs.filter((s) => s.name.trim()).map((s) => ({ name: s.name.trim(), description: s.description.trim(), evidence: s.evidence.split(",").map((x) => x.trim()).filter(Boolean) })),
    recommendations: f.recommendations,
    sources: [],
    ...(f.photoNote.trim() ? { notes: `Photo: ${f.photoNote.trim()}` } : {}),
  }), [f, links, achs, strs]);

  const ready = intake.name.length > 1;
  const json = JSON.stringify(intake, null, 2);
  const slug = intake.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my";

  function download() {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `${slug}.intake.json`; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <main style={S.page}>
      <div style={S.wrap}>
        <h1 style={{ fontSize: "clamp(28px,5vw,40px)", margin: 0 }}>Let's build your portfolio</h1>
        <p style={{ color: "#62656e", fontSize: 17 }}>About 15 minutes. Skip anything you don't have; we'll fill gaps with you later. Your answers stay on your device until you send us the file at the end.</p>

        <section style={S.card} aria-labelledby="s1"><h2 id="s1" style={{ margin: 0 }}>1. You</h2>
          <Field label="Your full name" help="As you want it on the site."><input style={S.input} value={f.name} onChange={set("name")} autoComplete="name" required /></Field>
          <Field label="Three things you are" help='Joined with dots, e.g. "Nursing Student · Volunteer EMT · Runner".'><input style={S.input} value={f.headline} onChange={set("headline")} /></Field>
          <Field label="One sentence: what you do and why it matters" help="Pretend a stranger has 5 seconds. What should they remember?"><input style={S.input} value={f.tagline} onChange={set("tagline")} /></Field>
          <Field label="City"><input style={S.input} value={f.location} onChange={set("location")} autoComplete="address-level2" /></Field>
          <Field label="Your story" help="Two or three short paragraphs. What do you do, what got you here, what do you care about outside work? Leave a blank line between paragraphs.">
            <textarea style={{ ...S.input, minHeight: 140 }} value={f.bio} onChange={set("bio")} /></Field>
        </section>

        <section style={S.card} aria-labelledby="s2"><h2 id="s2" style={{ margin: 0 }}>2. Proud moments</h2>
          <p style={S.help}>Awards, launches, wins, milestones. The best ones have a number ("raised $4,000", "top 12 of 300") or a link we can show. Only include things that are true and you're happy to share publicly.</p>
          {achs.map((a, i) => (
            <fieldset key={i} style={{ border: "1px solid #ebe8e0", borderRadius: 10, padding: 12, marginTop: 10 }}>
              <legend style={{ fontWeight: 600 }}>Moment {i + 1}</legend>
              {(["title", "org", "date", "metric"] as const).map((k) => (
                <Field key={k} label={{ title: "What happened", org: "Where or with whom", date: "When (year is fine)", metric: "The number, if there is one" }[k]}>
                  <input style={S.input} value={a[k]} onChange={(e) => setAchs(achs.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} /></Field>
              ))}
              <Field label="Tell us about it in a sentence or two"><textarea style={{ ...S.input, minHeight: 70 }} value={a.description} onChange={(e) => setAchs(achs.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} /></Field>
              <Field label="Type"><select style={S.input} value={a.category} onChange={(e) => setAchs(achs.map((x, j) => (j === i ? { ...x, category: e.target.value } : x)))}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <label style={{ display: "flex", gap: 8, marginTop: 10 }}><input type="checkbox" checked={a.featured} onChange={(e) => setAchs(achs.map((x, j) => (j === i ? { ...x, featured: e.target.checked } : x)))} /> One of my top 3</label>
            </fieldset>
          ))}
          <button type="button" style={{ ...S.ghost, marginTop: 10 }} onClick={() => setAchs([...achs, emptyAch()])}>Add another moment</button>
        </section>

        <section style={S.card} aria-labelledby="s3"><h2 id="s3" style={{ margin: 0 }}>3. Strengths</h2>
          <p style={S.help}>What would a coach or boss say you're great at? Give proof for each, like "led 12 volunteers" or "Dean's list 3 semesters".</p>
          {strs.map((s, i) => (
            <div key={i} style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr", marginTop: 8 }}>
              <input style={S.input} placeholder={`Strength ${i + 1} (e.g. Composure)`} value={s.name} onChange={(e) => setStrs(strs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label={`Strength ${i + 1}`} />
              <input style={S.input} placeholder="What it looks like in one line" value={s.description} onChange={(e) => setStrs(strs.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} aria-label={`Strength ${i + 1} description`} />
              <input style={S.input} placeholder="Proof, comma separated" value={s.evidence} onChange={(e) => setStrs(strs.map((x, j) => (j === i ? { ...x, evidence: e.target.value } : x)))} aria-label={`Strength ${i + 1} proof`} />
            </div>
          ))}
        </section>

        <section style={S.card} aria-labelledby="s4"><h2 id="s4" style={{ margin: 0 }}>4. Look and links</h2>
          <Field label="Pick a look" help="You can see each one in the theme gallery.">
            <div style={{ display: "grid", gap: 8 }}>{THEMES.map((t) => (
              <label key={t.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", border: "1px solid #ebe8e0", borderRadius: 10, padding: 10 }}>
                <input type="radio" name="theme" checked={f.theme === t.id} onChange={() => setF({ ...f, theme: t.id })} /><span><b>{t.name}</b><br /><span style={S.help}>{t.for}</span></span></label>))}</div></Field>
          <Field label="Links" help="LinkedIn, Instagram, a band page, a business site.">
            {links.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <input style={{ ...S.input, width: 130 }} value={l.label} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} aria-label="Link name" />
                <input style={S.input} type="url" placeholder="https://" value={l.href} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} aria-label="Link address" />
              </div>))}
            <button type="button" style={{ ...S.ghost, marginTop: 8 }} onClick={() => setLinks([...links, { label: "", href: "" }])}>Add a link</button></Field>
          <Field label="Public email (optional)" help="Only if you're happy for anyone to see it."><input style={S.input} type="email" value={f.email} onChange={set("email")} /></Field>
          <Field label="What are you looking for right now? (optional)" help='e.g. "Summer internships in marketing".'><input style={S.input} value={f.lookingFor} onChange={set("lookingFor")} /></Field>
          <Field label="Photo" help="Send 1 or 2 photos separately (sharp, well lit, 1200px+ tall). Anything we should know about them?"><input style={S.input} value={f.photoNote} onChange={set("photoNote")} /></Field>
          <label style={{ display: "flex", gap: 8, marginTop: 12 }}><input type="checkbox" checked={f.recommendations} onChange={set("recommendations")} /> Let people leave star-rated recommendations (you approve each one)</label>
        </section>

        <section style={S.card} aria-labelledby="s5"><h2 id="s5" style={{ margin: 0 }}>5. Send it</h2>
          <p style={S.help}>Download your answers and send the file back with your photo. Nothing was uploaded.</p>
          <button type="button" style={{ ...S.btn, opacity: ready ? 1 : 0.5 }} disabled={!ready} onClick={download}>Download my answers</button>
          {!ready && <p style={S.help}>Add your name first.</p>}
          <details style={{ marginTop: 12 }}><summary>See the file</summary><pre style={{ whiteSpace: "pre-wrap", fontSize: 12, background: "#16181d", color: "#f4f3ef", padding: 12, borderRadius: 8, overflowX: "auto" }}>{json}</pre></details>
        </section>
      </div>
    </main>
  );
}
