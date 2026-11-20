import { NextRequest, NextResponse } from "next/server";
import {
  listRecommendations,
  rateLimit,
  saveRecommendation,
  summarize,
  toPublic,
  type Recommendation,
} from "@/lib/store";
import { validateRecommendation } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const approved = await listRecommendations("approved");
    approved.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.createdAt - a.createdAt);
    return NextResponse.json({
      summary: summarize(approved),
      recommendations: approved.map(toPublic),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ summary: summarize([]), recommendations: [] });
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validateRecommendation(body);
  if (!result.ok) {
    // Pretend success to bots so they don't adapt.
    if (result.spam && body.website) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  try {
    if (!(await rateLimit(ip))) {
      return NextResponse.json(
        { error: "You've sent a few already. Please try again in an hour." },
        { status: 429 }
      );
    }
    const rec: Recommendation = {
      id: crypto.randomUUID(),
      ...result.data,
      status: "pending",
      createdAt: Date.now(),
    };
    await saveRecommendation(rec);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Couldn't save right now. Please try again later." }, { status: 500 });
  }
}
