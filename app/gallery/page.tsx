import type { Metadata } from "next";
import Site from "@/components/Site";
import { profile } from "@/content/profile";
export const metadata: Metadata = { title: `${profile.name} · Gallery` };
export default function GalleryPage() {
  return <Site theme="gallery" />;
}
