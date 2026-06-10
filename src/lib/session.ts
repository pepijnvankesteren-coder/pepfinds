import { SignJWT, jwtVerify } from "jose";

/**
 * Stateless admin session tokens (signed JWTs).
 *
 * This module is edge-safe on purpose: the middleware imports it to gate
 * /admin, so it must not pull in Node-only APIs or the database. Cookie
 * writing and password checks live in lib/auth.ts instead.
 */

export const ADMIN_SESSION_COOKIE = "pf_admin_session";

/** Session lifetime: 7 days. */
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a random 32+ character value in .env",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Create a signed admin session token. */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

/** Verify a session token. Returns false for missing/expired/tampered tokens. */
export async function isValidSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
