import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionCompanyId } from "@/lib/auth";

const schema = z.object({
  emailTemplate: z.string().max(4000),
});

export async function PATCH(request: Request) {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await db.company.update({
    where: { id: companyId },
    data: { emailTemplate: body.data.emailTemplate || null },
  });

  return NextResponse.json({ ok: true });
}
