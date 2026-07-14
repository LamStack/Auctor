import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, password } = body.data;

  const existing = await db.company.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const company = await db.company.create({
    data: { name, email, passwordHash, credits: { create: { assessmentsRemaining: 0 } } },
  });

  setSessionCookie(company.id);

  return NextResponse.json({ id: company.id, name: company.name, email: company.email });
}
