import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionCompanyId, getCurrentCompany } from "@/lib/auth";
import { InsufficientCreditsError, reserveCredits } from "@/lib/credits";
import { sendInviteEmail } from "@/lib/email";

const schema = z.object({
  trackId: z.string(),
  roleLabel: z.string().min(2),
  recipients: z
    .array(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .min(1, "Add at least one recipient")
    .max(500, "Batches are capped at 500 recipients"),
});

export async function POST(request: Request) {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const track = await db.track.findUnique({ where: { id: body.data.trackId } });
  if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });

  // Dedupe by lowercased email, keeping the first occurrence.
  const seen = new Set<string>();
  const recipients = body.data.recipients.filter((r) => {
    const key = r.email.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  try {
    await reserveCredits(companyId, recipients.length);
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: err.message }, { status: 402 });
    }
    throw err;
  }

  const batch = await db.$transaction(async (tx) => {
    const created = await tx.inviteBatch.create({
      data: { companyId, trackId: track.id, roleLabel: body.data.roleLabel },
    });

    await tx.invite.createMany({
      data: recipients.map((r) => ({
        companyId,
        trackId: track.id,
        batchId: created.id,
        token: crypto.randomBytes(12).toString("base64url"),
        roleLabel: body.data.roleLabel,
        candidateEmail: r.email.trim().toLowerCase(),
        candidateName: r.name?.trim() || null,
      })),
    });

    return created;
  });

  const invites = await db.invite.findMany({ where: { batchId: batch.id } });
  const company = await getCurrentCompany();
  const origin = new URL(request.url).origin;

  let emailsSent = 0;
  for (const invite of invites) {
    if (!invite.candidateEmail) continue;
    const result = await sendInviteEmail({
      to: invite.candidateEmail,
      candidateName: invite.candidateName,
      companyName: company?.name ?? "A company",
      roleLabel: invite.roleLabel,
      playUrl: `${origin}/play/${invite.token}`,
    });
    if (result.sent) emailsSent += 1;
  }

  return NextResponse.json({
    batchId: batch.id,
    invitesCreated: invites.length,
    emailsSent,
  });
}
