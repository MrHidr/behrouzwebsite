import "server-only";

import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { careerFormTokenTTLSeconds } from "./career-form-token";

type LimitResult = { allowed: boolean; retryAfterSeconds: number };
type MemoryEntry = { count: number; expiresAt: number };

const memoryLimits = new Map<string, MemoryEntry>();
const consumedTokens = new Map<string, number>();
let redisPromise: ReturnType<typeof connectRedis> | undefined;
let fallbackWarningShown = false;

const rateLimitRequired = () =>
  process.env.CAREER_RATE_LIMIT_REQUIRED === "true" ||
  (process.env.NODE_ENV === "production" && process.env.PAYLOAD_DB !== "d1" && process.env.CAREER_RATE_LIMIT_REQUIRED !== "false");

const integerEnv = (name: string, fallback: number, minimum: number, maximum: number) => {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
};

const anonymize = (scope: string, value: string) =>
  createHmac("sha256", process.env.PAYLOAD_SECRET || "development-only-rate-limit")
    .update(`${scope}:${value}`)
    .digest("hex")
    .slice(0, 40);

async function connectRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  const { createClient } = await import("redis");
  const client = createClient({
    url,
    socket: {
      connectTimeout: 2_000,
      reconnectStrategy: (retries) => (retries > 3 ? false : Math.min(50 * 2 ** retries, 500)),
    },
  });
  client.on("error", () => {
    if (!fallbackWarningShown) {
      console.error("[careers] Redis rate limiter is unavailable.");
      fallbackWarningShown = true;
    }
  });
  await client.connect();
  return client;
}

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  redisPromise ||= connectRedis().catch((error) => {
    redisPromise = undefined;
    throw error;
  });
  return redisPromise;
}

function memoryLimit(key: string, limit: number, windowSeconds: number): LimitResult {
  const now = Date.now();
  const current = memoryLimits.get(key);
  const entry = !current || current.expiresAt <= now
    ? { count: 0, expiresAt: now + windowSeconds * 1000 }
    : current;
  entry.count += 1;
  memoryLimits.set(key, entry);
  return {
    allowed: entry.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)),
  };
}

async function takeLimit(scope: string, identifier: string, limit: number, windowSeconds: number) {
  const key = `behrouz:careers:limit:${scope}:${anonymize(scope, identifier)}`;
  try {
    const redis = await getRedis();
    if (redis) {
      const result = await redis.eval(
        "local count=redis.call('INCR',KEYS[1]); if count==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; local ttl=redis.call('TTL',KEYS[1]); return {count,ttl}",
        { keys: [key], arguments: [String(windowSeconds)] },
      ) as [number, number];
      return {
        allowed: Number(result[0]) <= limit,
        retryAfterSeconds: Math.max(1, Number(result[1]) || windowSeconds),
      } satisfies LimitResult;
    }
  } catch {
    if (rateLimitRequired()) {
      throw new Error("Career rate limiting is unavailable.");
    }
  }

  if (!fallbackWarningShown && process.env.NODE_ENV === "production") {
    console.warn("[careers] Using process-local rate limiting; configure REDIS_URL for production.");
    fallbackWarningShown = true;
  }
  return memoryLimit(key, limit, windowSeconds);
}

function clientAddress(request: Request) {
  const trustedProxy = process.env.TRUST_PROXY_HEADERS === "true";
  const trustCloudflare = process.env.TRUST_CLOUDFLARE_IP_HEADER === "true";
  const candidates = trustedProxy
    ? [
        trustCloudflare ? request.headers.get("cf-connecting-ip") : null,
        request.headers.get("x-real-ip"),
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      ]
    : [];
  return candidates.find((candidate) => candidate && isIP(candidate)) || "unresolved-client";
}

export async function checkCareerSubmissionRate(request: Request): Promise<LimitResult> {
  const ipLimit = integerEnv("CAREER_RATE_LIMIT_IP_MAX", 5, 1, 100);
  const ipWindow = integerEnv("CAREER_RATE_LIMIT_IP_WINDOW_SECONDS", 900, 60, 86_400);
  const globalLimit = integerEnv("CAREER_RATE_LIMIT_GLOBAL_MAX", 100, 10, 10_000);
  const globalWindow = integerEnv("CAREER_RATE_LIMIT_GLOBAL_WINDOW_SECONDS", 3600, 60, 86_400);
  const [byIP, global] = await Promise.all([
    takeLimit("ip", clientAddress(request), ipLimit, ipWindow),
    takeLimit("global", "all", globalLimit, globalWindow),
  ]);
  return {
    allowed: byIP.allowed && global.allowed,
    retryAfterSeconds: Math.max(
      byIP.allowed ? 0 : byIP.retryAfterSeconds,
      global.allowed ? 0 : global.retryAfterSeconds,
      1,
    ),
  };
}

export async function consumeCareerFormToken(token: string) {
  const tokenKey = `behrouz:careers:token:${anonymize("token", token)}`;
  try {
    const redis = await getRedis();
    if (redis) {
      const result = await redis.set(tokenKey, "1", { EX: careerFormTokenTTLSeconds, NX: true });
      return result === "OK";
    }
  } catch {
    if (rateLimitRequired()) {
      throw new Error("Career token storage is unavailable.");
    }
  }

  const now = Date.now();
  for (const [key, expiresAt] of consumedTokens) {
    if (expiresAt <= now) consumedTokens.delete(key);
  }
  if (consumedTokens.has(tokenKey)) return false;
  consumedTokens.set(tokenKey, now + careerFormTokenTTLSeconds * 1000);
  return true;
}
