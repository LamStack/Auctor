import { db } from "@/lib/db";

export class InsufficientCreditsError extends Error {
  constructor(
    public needed: number,
    public available: number
  ) {
    super(`Not enough assessment credits: need ${needed}, have ${available}.`);
  }
}

/**
 * Atomically checks and deducts assessment credits at invite-creation time
 * (credits are consumed when an invite is sent, not on completion — an
 * unopened invite still costs a credit). Throws InsufficientCreditsError
 * without deducting anything if the balance is too low.
 */
export async function reserveCredits(companyId: string, count: number): Promise<void> {
  await db.$transaction(async (tx) => {
    const balance = await tx.creditBalance.findUnique({ where: { companyId } });
    const available = balance?.assessmentsRemaining ?? 0;
    if (available < count) {
      throw new InsufficientCreditsError(count, available);
    }
    await tx.creditBalance.update({
      where: { companyId },
      data: { assessmentsRemaining: { decrement: count } },
    });
  });
}
