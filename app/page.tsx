"use client";
import { MotionConfig } from "framer-motion";
import { Background, Nav, ScrollProgress } from "@/components/Chrome";
import Hero from "@/components/Hero";
import { Now, ResumeSection } from "@/components/NowResume";
import Recommendations from "@/components/Recommendations";
import { About, Achievements, Footer, Marquee, Strengths } from "@/components/Sections";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Background />
      <Nav />
      <main>
        <Hero />
        <About />
        <Now />
        <Achievements />
        <Marquee />
        <Strengths />
        <ResumeSection />
        <Recommendations />
      </main>
      <Footer />
    </MotionConfig>
  );
}
