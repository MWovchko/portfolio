import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Unbounded, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  // Lets share images use a full web address.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://maxwell-wovchko.vercel.app",
  ),
  title: `${profile.name} · ${profile.headline}`,
  description: profile.tagline,
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: profile.name, description: profile.tagline },
};

export const viewport: Viewport = { themeColor: "#05070d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${jet.variable} ${unbounded.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
