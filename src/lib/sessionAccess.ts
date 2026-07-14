import { db } from "@/lib/db";

export async function getInviteByToken(token: string) {
  return db.invite.findUnique({
    where: { token },
    include: {
      company: true,
      track: { include: { stations: { orderBy: { order: "asc" } } } },
      session: { include: { results: true, report: true } },
    },
  });
}

export async function getOrCreateSession(inviteId: string) {
  const existing = await db.session.findUnique({ where: { inviteId } });
  if (existing) return existing;

  return db.session.create({
    data: { inviteId, startedAt: new Date(), currentStationIndex: 0 },
  });
}
