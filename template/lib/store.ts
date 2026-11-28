import { Redis } from "@upstash/redis";

export type RecStatus = "pending" | "approved" | "rejected";

export interface Recommendation {
  id: string;
  name: string;
  relationship: string;
  organization: string;
  role: string;
  rating: number;
  message: string;
  /** Private: never returned by the public API. */
  email?: string;
  status: RecStatus;
  createdAt: number;
  featured?: boolean;
}

export type PublicRecommendation = Omit<Recommendation, "email" | "status">;

const KEY = {
  rec: (id: string) => `rec:${id}`,
  list: (s: RecStatus) => `recs:${s}`,
  rate: (ip: string) => `rate:${ip}`,
};

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function storageConfigured() {
  return getRedis() !== null;
}

/* ---------- In-memory fallback (local dev without a database) ---------- */
const g = globalThis as unknown as {
  __recs?: Map<string, Recommendation>;
  __rates?: Map<string, { n: number; exp: number }>;
};
const mem = (g.__recs ??= new Map());
const memRates = (g.__rates ??= new Map());

/* ---------------------------------------------------------------------- */

export async function listRecommendations(status: RecStatus): Promise<Recommendation[]> {
  const redis = getRedis();
  if (!redis) {
    return [...mem.values()]
      .filter((r) => r.status === status)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  const ids = await redis.zrange<string[]>(KEY.list(status), 0, -1, { rev: true });
  if (!ids.length) return [];
  const recs = await redis.mget<(Recommendation | null)[]>(...ids.map(KEY.rec));
  return recs.filter((r): r is Recommendation => !!r);
}

export async function saveRecommendation(rec: Recommendation) {
  const redis = getRedis();
  if (!redis) {
    mem.set(rec.id, rec);
    return;
  }
  await redis.set(KEY.rec(rec.id), rec);
  await redis.zadd(KEY.list(rec.status), { score: rec.createdAt, member: rec.id });
}

export async function getRecommendation(id: string): Promise<Recommendation | null> {
  const redis = getRedis();
  if (!redis) return mem.get(id) ?? null;
  return redis.get<Recommendation>(KEY.rec(id));
}

export async function setStatus(id: string, status: RecStatus, featured?: boolean) {
  const rec = await getRecommendation(id);
  if (!rec) return null;
  const updated: Recommendation = {
    ...rec,
    status,
    featured: featured ?? rec.featured,
  };
  const redis = getRedis();
  if (!redis) {
    mem.set(id, updated);
    return updated;
  }
  if (rec.status !== status) await redis.zrem(KEY.list(rec.status), id);
  await redis.set(KEY.rec(id), updated);
  await redis.zadd(KEY.list(status), { score: rec.createdAt, member: id });
  return updated;
}

export async function deleteRecommendation(id: string) {
  const redis = getRedis();
  if (!redis) {
    mem.delete(id);
    return;
  }
  const rec = await getRecommendation(id);
  if (rec) await redis.zrem(KEY.list(rec.status), id);
  await redis.del(KEY.rec(id));
}

/** Returns true if the caller is under the limit. */
export async function rateLimit(ip: string, max = 3, windowSec = 3600): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    const now = Date.now();
    const cur = memRates.get(ip);
    if (!cur || cur.exp < now) {
      memRates.set(ip, { n: 1, exp: now + windowSec * 1000 });
      return true;
    }
    cur.n++;
    return cur.n <= max;
  }
  const n = await redis.incr(KEY.rate(ip));
  if (n === 1) await redis.expire(KEY.rate(ip), windowSec);
  return n <= max;
}

export function toPublic(r: Recommendation): PublicRecommendation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, status, ...rest } = r;
  return rest;
}

export function summarize(recs: { rating: number }[]) {
  const count = recs.length;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: recs.filter((r) => r.rating === star).length,
  }));
  const average = count ? recs.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { count, average: Math.round(average * 10) / 10, distribution };
}
