import type { Metadata } from "next";
import Site from "@/components/Site";
import { profile } from "@/content/profile";
export const metadata: Metadata = { title: `${profile.name} · Night` };
export default function NightPage() {
  return <Site theme="night" />;
}
