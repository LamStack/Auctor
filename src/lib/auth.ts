import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SESSION_COOKIE = "auctor_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

export function signSession(companyId: string): string {
  const payload = JSON.stringify({ companyId, exp: Date.now() + SESSION_TTL_MS });
  const payloadEncoded = base64url(payload);
  const signature = crypto.createHmac("sha256", secret()).update(payloadEncoded).digest("base64url");
  return `${payloadEncoded}.${signature}`;
}

export function verifySession(token: string): string | null {
  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) return null;

  const expected = crypto.createHmac("sha256", secret()).update(payloadEncoded).digest("base64url");
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return typeof payload.companyId === "string" ? payload.companyId : null;
  } catch {
    return null;
  }
}

export function setSessionCookie(companyId: string) {
  cookies().set(SESSION_COOKIE, signSession(companyId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSessionCompanyId(): Promise<string | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getCurrentCompany() {
  const companyId = await getSessionCompanyId();
  if (!companyId) return null;
  return db.company.findUnique({ where: { id: companyId }, include: { credits: true } });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
