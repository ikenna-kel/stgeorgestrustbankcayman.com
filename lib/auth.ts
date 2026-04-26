import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Session } from "./models";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const IDLE_TIMEOUT_MS = Number(process.env.IDLE_TIMEOUT_MS) || 30 * 60 * 1000; // 30 min

export interface JwtPayload {
  userId: string;
  email: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export function signToken(userId: string | Types.ObjectId, email: string, sessionId: string): string {
  return jwt.sign(
    { userId: String(userId), email, sessionId } as JwtPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export async function createSession(
  userId: Types.ObjectId,
  token: string,
  userAgent?: string,
  ip?: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Session.create({
    userId,
    token,
    lastActivityAt: new Date(),
    expiresAt,
    userAgent,
    ip,
  });
}

export async function updateSessionActivity(token: string): Promise<boolean> {
  const session = await Session.findOneAndUpdate(
    { token },
    { lastActivityAt: new Date() },
    { returnDocument: 'after' }
  );
  return !!session;
}

export async function isSessionIdle(token: string): Promise<boolean> {
  const session = await Session.findOne({ token });
  if (!session) return true;
  const elapsed = Date.now() - session.lastActivityAt.getTime();
  return elapsed > IDLE_TIMEOUT_MS;
}

export async function deleteSession(token: string): Promise<void> {
  await Session.deleteOne({ token });
}

export async function deleteAllSessionsForUser(userId: Types.ObjectId): Promise<void> {
  await Session.deleteMany({ userId });
}

export { IDLE_TIMEOUT_MS };
