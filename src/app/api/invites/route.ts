import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionCompanyId } from "@/lib/auth";

const schema = z.object({
  trackId: z.string(),
  roleLabel: z.string().min(2),
  candidateName: z.string().optional(),
  candidateEmail: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const invites = await db.invite.findMany({
    where: { companyId },
    include: { track: true, session: { include: { report: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    invites: invites.map((i) => ({
      id: i.id,
      token: i.token,
      trackTitle: i.track.title,
      roleLabel: i.roleLabel,
      candidateName: i.candidateName,
      candidateEmail: i.candidateEmail,
      status: i.status,
      createdAt: i.createdAt,
      overallScore: i.session?.report?.overall ?? null,
      sessionId: i.session?.id ?? null,
    })),
  });
}

export async function POST(request: Request) {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const track = await db.track.findUnique({ where: { id: body.data.trackId } });
  if (!track) return NextResponse.json({ error: "Track not found" }, { status: 404 });

  const token = crypto.randomBytes(12).toString("base64url");

  const invite = await db.invite.create({
    data: {
      companyId,
      trackId: track.id,
      token,
      roleLabel: body.data.roleLabel,
      candidateName: body.data.candidateName || null,
      candidateEmail: body.data.candidateEmail || null,
    },
  });

  return NextResponse.json({ id: invite.id, token: invite.token });
}
