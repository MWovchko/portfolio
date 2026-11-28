"use client";
import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Background, Nav, ScrollProgress } from "@/components/Chrome";
import { Cursor, Loader, SmoothScroll } from "@/components/Effects";
import Hero from "@/components/Hero";
import { Now, ResumeSection } from "@/components/NowResume";
import Recommendations from "@/components/Recommendations";
import TunnelHero from "@/components/Tunnel";
import ExecutiveHero from "@/components/Executive";
import Media from "@/components/Media";
import { About, Achievements, Footer, Marquee, Strengths } from "@/components/Sections";
import { config, profile } from "@/content/profile";
import { sections } from "@/lib/site";
import type { Theme } from "@/content/types";

export default function Site({ theme = config.theme }: { theme?: Theme }) {
  useEffect(() => {
    document.body.dataset.site = theme;
    return () => {
      delete document.body.dataset.site;
    };
  }, [theme]);
  const on = sections();

  return (
    <MotionConfig reducedMotion="user">
      <Loader label={profile.initials} />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Background />
      <Nav />
      <main>
        {theme === "gallery" ? <TunnelHero /> : theme === "executive" ? <ExecutiveHero /> : <Hero theme={theme} />}
        <About />
        {on.includes("now") && <Now />}
        <Achievements />
        <Marquee />
        {on.includes("media") && <Media />}
        <Strengths />
        <ResumeSection />
        {on.includes("recommendations") && <Recommendations />}
      </main>
      <Footer theme={theme} />
    </MotionConfig>
  );
}
