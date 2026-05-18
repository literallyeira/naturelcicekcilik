import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export type AdminSession = {
  id?: number;
  username?: string;
  name?: string;
  isSuperadmin?: boolean;
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ??
    "dev-only-fallback-password-change-me-please-32chars",
  cookieName: "naturel_admin",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.id) {
    return null;
  }
  return session;
}

export async function verifyAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) return null;
  // PHP bcrypt hashes use $2y$ prefix — bcryptjs handles both $2a$/$2b$/$2y$
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return admin;
}
