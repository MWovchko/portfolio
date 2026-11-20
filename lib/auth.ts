import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export function isAdmin(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  const given = req.headers.get("x-admin-key") || "";
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
