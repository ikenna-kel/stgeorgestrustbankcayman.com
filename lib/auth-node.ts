import { Types } from "mongoose";
import { Session } from "./models";

// Re-export Edge-safe functions for convenience in Node.js routes
export { signToken, getBearerToken } from "./auth-edge";

const IDLE_TIMEOUT_MS = Number(process.env.IDLE_TIMEOUT_MS) || 30 * 60 * 1000; // 30 min

/**
 * Create a new session in the database
 * Node.js only - requires MongoDB connection
 */
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

/**
 * Update the last activity timestamp for a session
 * Node.js only - requires MongoDB connection
 */
export async function updateSessionActivity(token: string): Promise<boolean> {
  const session = await Session.findOneAndUpdate(
    { token },
    { lastActivityAt: new Date() },
    { returnDocument: 'after' }
  );
  return !!session;
}

/**
 * Check if a session has been idle for too long
 * Node.js only - requires MongoDB connection
 */
export async function isSessionIdle(token: string): Promise<boolean> {
  const session = await Session.findOne({ token });
  if (!session) return true;
  const elapsed = Date.now() - session.lastActivityAt.getTime();
  return elapsed > IDLE_TIMEOUT_MS;
}

/**
 * Delete a specific session by token
 * Node.js only - requires MongoDB connection
 */
export async function deleteSession(token: string): Promise<void> {
  await Session.deleteOne({ token });
}

/**
 * Delete all sessions for a specific user
 * Node.js only - requires MongoDB connection
 */
export async function deleteAllSessionsForUser(userId: Types.ObjectId): Promise<void> {
  await Session.deleteMany({ userId });
}

export { IDLE_TIMEOUT_MS };
