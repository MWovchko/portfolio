import type { Metadata } from "next";
import Site from "@/components/Site";
import { profile } from "@/content/profile";
export const metadata: Metadata = { title: `${profile.name} · Original` };
export default function OriginalPage() {
  return <Site theme="original" />;
}
