import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Unbounded, Instrument_Serif } from "next/font/google";
import { config, profile } from "@/content/profile";
import { paletteCss } from "@/lib/site";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const THEME_BG: Record<string, string> = {
  neon: "#0a0a22",
  night: "#020504",
  gallery: "#03040a",
  executive: "#f4f3ef",
  original: "#05070d",
};

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.headline}`,
  description: profile.tagline,
  metadataBase: config.url ? new URL(config.url) : undefined,
  openGraph: {
    title: profile.name,
    description: profile.tagline,
    type: "website",
    images: [config.photos.hero],
  },
};

export const viewport: Viewport = {
  themeColor: config.themeColor ?? config.palette?.[config.theme]?.bg ?? THEME_BG[config.theme],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const css = paletteCss();
  return (
    <html lang="en" className={`${grotesk.variable} ${jet.variable} ${unbounded.variable} ${serif.variable}`}>
      <body data-site={config.theme}>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        {children}
      </body>
    </html>
  );
}
