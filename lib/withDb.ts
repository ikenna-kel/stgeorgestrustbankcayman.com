import { connectDB } from "./db";

export async function withDb<T>(fn: () => Promise<T>): Promise<T> {
  await connectDB();
  return fn();
}
