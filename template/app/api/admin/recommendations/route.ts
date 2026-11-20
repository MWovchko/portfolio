import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  deleteRecommendation,
  listRecommendations,
  setStatus,
  storageConfigured,
  type RecStatus,
} from "@/lib/store";

import { config } from "@/content/profile";

export const dynamic = "force-dynamic";
const off = () => (config.features.recommendations ? null : NextResponse.json({ error: "Not found" }, { status: 404 }));

const unauthorized = () =>
  NextResponse.json(
    {
      error: process.env.ADMIN_PASSWORD
        ? "Wrong password."
        : "ADMIN_PASSWORD isn't set. Add it in Vercel → Settings → Environment Variables.",
    },
    { status: 401 }
  );

export async function GET(req: NextRequest) {
  const disabled = off();
  if (disabled) return disabled;
  if (!isAdmin(req)) return unauthorized();
  const [pending, approved, rejected] = await Promise.all([
    listRecommendations("pending"),
    listRecommendations("approved"),
    listRecommendations("rejected"),
  ]);
  return NextResponse.json({ pending, approved, rejected, storage: storageConfigured() });
}

export async function POST(req: NextRequest) {
  const disabled = off();
  if (disabled) return disabled;
  if (!isAdmin(req)) return unauthorized();
  const { id, action, featured } = (await req.json()) as {
    id?: string;
    action?: "approve" | "reject" | "pending" | "delete" | "feature";
    featured?: boolean;
  };
  if (!id || !action) return NextResponse.json({ error: "Missing id or action." }, { status: 400 });

  if (action === "delete") {
    await deleteRecommendation(id);
    return NextResponse.json({ ok: true });
  }
  if (action === "feature") {
    const r = await setStatus(id, "approved", !!featured);
    return r ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  const map: Record<string, RecStatus> = { approve: "approved", reject: "rejected", pending: "pending" };
  const r = await setStatus(id, map[action]);
  return r ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found." }, { status: 404 });
}
