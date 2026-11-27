import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IntakeForm from "@/components/IntakeForm";

/**
 * Client intake form (Archer's idea p1: Remy + Lyra + Paige).
 * OFF by default: it only exists when NEXT_PUBLIC_INTAKE=on is set in Vercel, so no client sees it
 * until Maxwell turns it on. Answers never leave the browser: the client downloads intake.json and sends it to us.
 */
export const metadata: Metadata = { title: "Portfolio intake", robots: { index: false, follow: false } };

export default function IntakePage() {
  if (process.env.NEXT_PUBLIC_INTAKE !== "on") notFound();
  return <IntakeForm />;
}
