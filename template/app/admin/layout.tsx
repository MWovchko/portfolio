import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { config } from "@/content/profile";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export default function L({ children }: { children: React.ReactNode }) {
  if (!config.features.recommendations) notFound();
  return children;
}
