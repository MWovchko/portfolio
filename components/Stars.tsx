"use client";
import { useState } from "react";

const PATH =
  "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z";

export function StarIcon({ fill = 1, className = "star" }: { fill?: number; className?: string }) {
  const id = `s${Math.round(fill * 100)}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="var(--star)" />
          <stop offset={`${fill * 100}%`} stopColor="rgba(255,255,255,0.12)" />
        </linearGradient>
      </defs>
      <path d={PATH} fill={`url(#${id})`} />
    </svg>
  );
}

export function Stars({ value, size = 20 }: { value: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ width: size, height: size, display: "inline-block" }}>
          <StarIcon fill={Math.max(0, Math.min(1, value - (i - 1)))} className="star" />
        </span>
      ))}
    </span>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const labels = ["", "Fair", "Good", "Great", "Excellent", "Outstanding"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <div role="radiogroup" aria-label="Star rating" style={{ display: "flex" }} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
            className="star-btn"
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(i)}
          >
            <StarIcon fill={i <= shown ? 1 : 0} />
          </button>
        ))}
      </div>
      <span className="mono" style={{ color: "var(--muted)", fontSize: 14, minWidth: 90 }}>
        {shown ? labels[shown] : "Tap to rate"}
      </span>
    </div>
  );
}
