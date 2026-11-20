"use client";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Background, Nav, ScrollProgress } from "@/components/Chrome";
import { Cursor, Loader, SmoothScroll } from "@/components/Effects";
import Hero from "@/components/Hero";
import { Now, ResumeSection } from "@/components/NowResume";
import Recommendations from "@/components/Recommendations";
import ExecutiveHero from "@/components/Executive";
import { About, Achievements, Footer, Marquee, Strengths } from "@/components/Sections";

export type Theme = "neon" | "executive";

export default function Site({ theme = "neon" }: { theme?: Theme }) {
  useEffect(() => {
    document.body.dataset.site = theme;
    return () => {
      delete document.body.dataset.site;
    };
  }, [theme]);

  return (
    <MotionConfig reducedMotion="user">
      <Loader />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Background />
      <Nav />
      <main>
        {theme === "executive" ? <ExecutiveHero /> : <Hero />}
        <About />
        <Now />
        <Achievements />
        <Marquee />
        <Strengths />
        <ResumeSection />
        <Recommendations />
      </main>
      <Footer theme={theme} />
    </MotionConfig>
  );
}
