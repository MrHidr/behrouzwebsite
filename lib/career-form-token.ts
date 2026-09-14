import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;
const TOKEN_CLOCK_SKEW_MS = 60 * 1000;

function signingSecret() {
  const secret = process.env.PAYLOAD_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "development-only-career-form-token";
  throw new Error("PAYLOAD_SECRET is required to sign career form tokens.");
}

function signature(value: string) {
  return createHmac("sha256", signingSecret()).update(value).digest("base64url");
}

export function createCareerFormToken() {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(24).toString("base64url");
  const value = `${issuedAt}.${nonce}`;
  return `${value}.${signature(value)}`;
}

export function verifyCareerFormToken(token: string | null) {
  if (!token || token.length > 256) return false;
  const [issuedAtValue, nonce, providedSignature, extra] = token.split(".");
  if (extra || !issuedAtValue || !nonce || !providedSignature) return false;
  if (!/^[a-z0-9]+$/.test(issuedAtValue) || !/^[A-Za-z0-9_-]{20,64}$/.test(nonce)) return false;

  const issuedAt = Number.parseInt(issuedAtValue, 36);
  const age = Date.now() - issuedAt;
  if (!Number.isFinite(issuedAt) || age < -TOKEN_CLOCK_SKEW_MS || age > TOKEN_TTL_MS) return false;

  const expected = Buffer.from(signature(`${issuedAtValue}.${nonce}`));
  const provided = Buffer.from(providedSignature);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export const careerFormTokenTTLSeconds = TOKEN_TTL_MS / 1000;
