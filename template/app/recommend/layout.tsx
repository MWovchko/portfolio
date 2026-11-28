import { notFound } from "next/navigation";
import { config } from "@/content/profile";
export default function RecommendLayout({ children }: { children: React.ReactNode }) {
  if (!config.features.recommendations) notFound();
  return children;
}
