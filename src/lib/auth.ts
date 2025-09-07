import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { signToken, verifyToken, getSessionCookie } from "./jwt";
import { Role } from "@prisma/client";

export async function register(email: string, password: string, name: string, role: Role = Role.CLIENT) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name, role } });
  return user;
}

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const token = signToken({ uid: user.id, role: user.role, name: user.name });
  return { user, token };
}

export async function currentUser() {
  const token = getSessionCookie();
  if (!token) return null;
  const payload = verifyToken<{ uid: string, role: Role, name: string }>(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.uid } });
  return user;
}

export function requireRole(roles: Role[], userRole?: Role) {
  return userRole && roles.includes(userRole);
}
