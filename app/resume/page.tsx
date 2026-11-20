"use client";
import { now, profile, resume } from "@/content/profile";

// Printable one-page resume. "Download PDF" uses the browser's Save as PDF.
export default function ResumePage() {
  const links = profile.contact.links.filter((l) => !l.placeholder);
  return (
    <div className="rz-wrap">
      <style>{`
        body { background: #e9ecf2; }
        .rz-wrap { padding: 32px 16px 64px; color: #11151f; font-family: var(--font-sans); }
        .rz-bar { max-width: 816px; margin: 0 auto 16px; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .rz-bar a, .rz-bar button { font: inherit; font-size: 14px; padding: 10px 16px; border-radius: 999px; border: 1px solid #c8cdd8; background: #fff; color: #11151f; cursor: pointer; }
        .rz-bar button { background: #11151f; color: #fff; border-color: #11151f; }
        .rz { max-width: 816px; margin: 0 auto; background: #fff; padding: 56px 60px; box-shadow: 0 10px 40px rgba(0,0,0,.08); border-radius: 6px; font-size: 13.5px; line-height: 1.5; }
        @media (max-width: 600px) { .rz { padding: 28px 22px; } }
        .rz h1 { font-size: 34px; letter-spacing: -0.03em; margin: 0; line-height: 1.1; }
        .rz .sub { color: #4a5263; margin-top: 4px; font-size: 15px; }
        .rz .contact { margin-top: 10px; color: #4a5263; display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 13px; }
        .rz .contact a { color: #4a5263; }
        .rz h2 { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: #5b3fd1; border-bottom: 1px solid #e1e4ea; padding-bottom: 6px; margin: 26px 0 12px; }
        .rz .row { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .rz .date { color: #6a7283; font-family: var(--font-mono); font-size: 12px; }
        .rz .org { color: #4a5263; }
        .rz ul { margin: 6px 0 14px; padding-left: 18px; }
        .rz li { margin-bottom: 3px; }
        .rz .item { margin-bottom: 12px; }
        .rz .skills div { margin-bottom: 4px; }
        @media print {
          body { background: #fff; }
          .rz-wrap { padding: 0; }
          .rz-bar { display: none; }
          .rz { box-shadow: none; padding: 0; max-width: none; }
          @page { margin: 0.6in; }
        }
      `}</style>
      <div className="rz-bar">
        <a href="/">← Back to portfolio</a>
        <button onClick={() => window.print()}>Download PDF</button>
      </div>
      <article className="rz">
        <h1>{profile.name}</h1>
        <div className="sub">{profile.headline} · {profile.location}</div>
        <div className="contact">
          {profile.contact.email && <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>}
          {profile.contact.phone && <span>{profile.contact.phone}</span>}
          {links.map((l) => (
            <a key={l.label} href={l.href}>{l.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a>
          ))}
        </div>

        <h2>Summary</h2>
        <p style={{ margin: 0 }}>
          {profile.tagline} Currently building {now.venture.name}: {now.venture.oneLiner.toLowerCase()} Looking for {resume.lookingFor.toLowerCase()}.
        </p>

        <h2>Experience</h2>
        {resume.experience.map((x) => (
          <div className="item" key={x.title + x.org}>
            <div className="row"><strong>{x.title}, {x.org}</strong><span className="date">{x.date}</span></div>
            <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        ))}

        <h2>Education</h2>
        {resume.education.filter((e) => !e.placeholder).map((e) => (
          <div className="item" key={e.school}>
            <div className="row"><strong>{e.school}</strong><span className="date">{e.date}</span></div>
            <div className="org">{e.detail}</div>
          </div>
        ))}

        <h2>Skills</h2>
        <div className="skills">
          {Object.entries(resume.skills).map(([g, items]) => (
            <div key={g}><strong>{g}:</strong> {items.join(", ")}</div>
          ))}
        </div>

        <h2>Interests</h2>
        <div>{resume.interests.join(" · ")}</div>
      </article>
    </div>
  );
}
