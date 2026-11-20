import type { Metadata } from "next";
import Site from "@/components/Site";
import { profile } from "@/content/profile";
export const metadata: Metadata = { title: `${profile.name} · Neon` };
export default function NeonPage() {
  return <Site theme="neon" />;
}
