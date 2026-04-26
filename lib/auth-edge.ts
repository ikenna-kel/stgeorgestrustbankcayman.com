import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Convert secret string to Uint8Array for jose
const getSecretKey = (): Uint8Array => {
  const secret = JWT_SECRET;
  return new TextEncoder().encode(secret);
};

// Parse duration string like "7d", "1h", "30m" into milliseconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }
  const [, value, unit] = match;
  const num = parseInt(value, 10);
  switch (unit) {
    case "d":
      return num * 24 * 60 * 60;
    case "h":
      return num * 60 * 60;
    case "m":
      return num * 60;
    case "s":
      return num;
    default:
      return 0;
  }
};

export interface JwtPayload extends Record<string, unknown> {
  userId: string;
  email: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a JWT token (Edge-safe using jose)
 * Note: This is primarily for Node.js routes, but uses jose for compatibility
 */
export async function signToken(
  userId: string,
  email: string,
  sessionId: string
): Promise<string> {
  const secret = getSecretKey();
  const expiresInSeconds = parseDuration(JWT_EXPIRES_IN);

  const token = await new SignJWT({ userId, email, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(secret);

  return token;
}

/**
 * Verify a JWT token (Edge-safe using jose)
 * This function is safe to use in Edge Runtime (middleware, etc.)
 */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = getSecretKey();
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header
 * This is safe for Edge Runtime
 */
export function getBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
