import type { Metadata } from "next";
import { profile } from "@/content/profile";
export const metadata: Metadata = { title: `Resume · ${profile.name}` };
export default function L({ children }: { children: React.ReactNode }) { return children; }
