import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";

// The picture shown when the site link is shared (texts, LinkedIn, iMessage).
export const alt = `${profile.name}, ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/images/maxwell-neon.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          background: "linear-gradient(135deg, #05070d 0%, #0a0a22 60%, #1a0b2e 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 30, color: "#22d3ee", marginBottom: 20 }}>{profile.location}</div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02 }}>{profile.name}</div>
          <div style={{ fontSize: 36, marginTop: 24, color: "#c7c9e0" }}>{profile.headline}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          width={360}
          height={450}
          style={{ objectFit: "cover", borderRadius: 28, border: "4px solid #a855f7" }}
          alt=""
        />
      </div>
    ),
    size,
  );
}
