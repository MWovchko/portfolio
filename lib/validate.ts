import { relationshipTypes } from "@/content/profile";

export interface RecInput {
  name: string;
  relationship: string;
  organization: string;
  role: string;
  rating: number;
  message: string;
  email?: string;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

export function validateRecommendation(
  body: Record<string, unknown>
): { ok: true; data: RecInput } | { ok: false; error: string; spam?: boolean } {
  // Honeypot: real people never see this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return { ok: false, error: "Rejected.", spam: true };
  }
  // Bots submit instantly; people take a few seconds to write.
  const startedAt = Number(body.startedAt);
  if (!startedAt || Date.now() - startedAt < 4000) {
    return { ok: false, error: "That was fast! Please take a moment and try again.", spam: true };
  }

  const name = clean(body.name, 80);
  const relationship = clean(body.relationship, 40);
  const organization = clean(body.organization, 100);
  const role = clean(body.role, 80);
  const message = clean(body.message, 1200);
  const email = clean(body.email, 120);
  const rating = Number(body.rating);

  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!(relationshipTypes as readonly string[]).includes(relationship))
    return { ok: false, error: "Please choose how you know Maxwell." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { ok: false, error: "Please choose a star rating." };
  if (message.length < 20)
    return { ok: false, error: "Please write at least a sentence or two (20+ characters)." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "That email doesn't look right." };

  const links = (message.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 1) return { ok: false, error: "Please remove links from your message.", spam: true };

  return {
    ok: true,
    data: { name, relationship, organization, role, rating, message, email: email || undefined },
  };
}
