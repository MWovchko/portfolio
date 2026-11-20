"use client";
import { useCallback, useEffect, useState } from "react";
import { Stars } from "@/components/Stars";
import type { Recommendation } from "@/lib/store";

type Lists = { pending: Recommendation[]; approved: Recommendation[]; rejected: Recommendation[]; storage: boolean };
type Tab = "pending" | "approved" | "rejected";

export default function Admin() {
  const [key, setKey] = useState("");
  const [lists, setLists] = useState<Lists | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("pending");

  const load = useCallback(async (k: string) => {
    setError("");
    const res = await fetch("/api/admin/recommendations", { headers: { "x-admin-key": k } });
    const data = await res.json();
    if (!res.ok) {
      setLists(null);
      setError(data.error || "Failed to load.");
      return;
    }
    try { sessionStorage.setItem("admin-key", k); } catch {}
    setLists(data);
  }, []);

  useEffect(() => {
    let k = "";
    try { k = sessionStorage.getItem("admin-key") || ""; } catch {}
    if (k) { setKey(k); load(k); }
  }, [load]);

  async function act(id: string, action: string, featured?: boolean) {
    if (action === "delete" && !window.confirm("Delete this recommendation permanently?")) return;
    await fetch("/api/admin/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, action, featured }),
    });
    load(key);
  }

  return (
    <main className="container admin" style={{ maxWidth: 900 }}>
      <a href="/" className="mono" style={{ color: "var(--muted)", fontSize: 14 }}>← Back to site</a>
      <h1 className="section-title" style={{ fontSize: 48, marginTop: 20 }}>Moderate recommendations</h1>

      {!lists && (
        <form
          className="panel form"
          onSubmit={(e) => { e.preventDefault(); load(key); }}
          style={{ maxWidth: 460 }}
        >
          <div className="field">
            <label htmlFor="pw">Admin password</label>
            <input id="pw" className="input" type="password" value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-primary" type="submit">Unlock</button>
        </form>
      )}

      {lists && (
        <>
          {!lists.storage && (
            <div className="panel" style={{ padding: 16, borderColor: "rgba(255,201,74,.5)", color: "var(--star)", marginTop: 16 }}>
              No database is connected, so submissions are only kept in memory and will disappear. Add Upstash Redis in
              Vercel → Storage.
            </div>
          )}
          <div className="tabs">
            {(["pending", "approved", "rejected"] as Tab[]).map((t) => (
              <button key={t} className={`chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ isolation: "isolate" }}>
                {tab === t && <span className="chip-bg" />}
                <span>{t[0].toUpperCase() + t.slice(1)} ({lists[t].length})</span>
              </button>
            ))}
            <button className="chip" onClick={() => load(key)}><span>Refresh</span></button>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {lists[tab].length === 0 && <div className="panel admin-card" style={{ color: "var(--muted)" }}>Nothing here.</div>}
            {lists[tab].map((r) => (
              <div key={r.id} className="panel admin-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <strong>{r.name}</strong> <span className="rel-tag">{r.relationship}</span>
                    <div className="rec-meta">
                      {[r.role, r.organization].filter(Boolean).join(" · ")}
                      {r.email && <> · <a href={`mailto:${r.email}`} style={{ color: "var(--cyan)" }}>{r.email}</a></>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Stars value={r.rating} />
                    <div className="rec-meta mono" style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p style={{ margin: 0, color: "#d4d9e4", whiteSpace: "pre-wrap" }}>{r.message}</p>
                <div className="admin-actions">
                  {r.status !== "approved" && <button className="btn btn-primary btn-sm" onClick={() => act(r.id, "approve")}>Approve</button>}
                  {r.status === "approved" && (
                    <button className="btn btn-sm" onClick={() => act(r.id, "feature", !r.featured)}>
                      {r.featured ? "Unpin" : "Pin to top"}
                    </button>
                  )}
                  {r.status !== "rejected" && <button className="btn btn-sm" onClick={() => act(r.id, "reject")}>{r.status === "approved" ? "Hide" : "Reject"}</button>}
                  {r.status === "rejected" && <button className="btn btn-sm" onClick={() => act(r.id, "pending")}>Move to pending</button>}
                  <button className="btn btn-sm" onClick={() => act(r.id, "delete")} style={{ color: "#ff7a7a" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
