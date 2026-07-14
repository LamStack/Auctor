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

  try {
    return await db.session.create({
      data: { inviteId, startedAt: new Date(), currentStationIndex: 0 },
    });
  } catch {
    // Two concurrent start requests (e.g. React Strict Mode double-invoking the
    // effect in dev) can race here — the loser hits the unique constraint on
    // inviteId. Just return the session the winner created instead of throwing.
    const createdByOtherRequest = await db.session.findUnique({ where: { inviteId } });
    if (createdByOtherRequest) return createdByOtherRequest;
    throw new Error("Failed to start session");
  }
}
