"use client";
import { MotionConfig } from "framer-motion";
import { Background } from "@/components/Chrome";
import { RecommendForm } from "@/components/Recommendations";
import { profile } from "@/content/profile";

// A focused page you can send to references: /recommend
export default function RecommendPage() {
  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <main className="container" style={{ maxWidth: 760, padding: "80px 16px" }}>
        <a href="/" className="mono" style={{ color: "var(--muted)", fontSize: 14 }}>
          ← {profile.name}
        </a>
        <h1 className="section-title" style={{ marginTop: 24 }}>
          Thanks for <span className="grad-text">vouching.</span>
        </h1>
        <p className="section-lead" style={{ marginBottom: 32 }}>
          It takes about two minutes. Your rating and words will appear on {profile.firstName}&apos;s site after review.
        </p>
        <RecommendForm compact />
      </main>
    </MotionConfig>
  );
}
