import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getInviteByToken } from "@/lib/sessionAccess";

const schema = z.object({
  candidateId: z.string().regex(/^\d{9}$/, "ID must be exactly 9 digits"),
  candidateName: z.string().min(2),
  candidateEmail: z.string().email(),
});

export async function PATCH(request: Request, { params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  if (invite.session?.completedAt) {
    return NextResponse.json({ error: "This assessment has already been completed" }, { status: 409 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  await db.invite.update({
    where: { id: invite.id },
    data: {
      candidateId: body.data.candidateId,
      candidateName: body.data.candidateName,
      candidateEmail: body.data.candidateEmail,
    },
  });

  return NextResponse.json({ ok: true });
}
