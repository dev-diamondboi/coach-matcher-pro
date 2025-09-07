import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = "session";

export function signToken(payload: object) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken<T=any>(token: string): T | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as T;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
}

export function getSessionCookie(): string | null {
  const c = cookies().get(COOKIE);
  return c?.value ?? null;
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}
