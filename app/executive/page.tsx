import type { Metadata } from "next";
import Site from "@/components/Site";
import { profile } from "@/content/profile";
export const metadata: Metadata = { title: `${profile.name} · Executive` };
export default function ExecutivePage() {
  return <Site theme="executive" />;
}
