import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Site from "@/components/Site";
import { config, profile } from "@/content/profile";
import { THEME_LABELS } from "@/lib/site";
import type { Theme } from "@/content/types";

/** Alternate versions: /neon, /night, /gallery, /executive, /original (whichever config.alternates lists). */
export const dynamicParams = false;

export function generateStaticParams() {
  return config.alternates.filter((t) => t !== config.theme).map((variant) => ({ variant }));
}

export async function generateMetadata({ params }: { params: Promise<{ variant: string }> }): Promise<Metadata> {
  const { variant } = await params;
  const label = THEME_LABELS[variant as Theme];
  return label ? { title: `${profile.name} · ${label}` } : {};
}

export default async function VariantPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  if (!config.alternates.includes(variant as Theme) || variant === config.theme) notFound();
  return <Site theme={variant as Theme} />;
}
