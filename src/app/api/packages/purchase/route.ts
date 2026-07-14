import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionCompanyId } from "@/lib/auth";
import { findPackage } from "@/lib/packages";

const schema = z.object({ packageId: z.string() });

// Simulated payment for MVP testing: purchase grants credits immediately,
// with no real payment gateway wired up yet. Swap in Stripe here later.
export async function POST(request: Request) {
  const companyId = await getSessionCompanyId();
  if (!companyId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const tier = findPackage(body.data.packageId);
  if (!tier || tier.assessments === null || tier.priceBHD === null) {
    return NextResponse.json({ error: "This package requires contacting sales." }, { status: 400 });
  }

  await db.packageOrder.create({
    data: {
      companyId,
      packageTier: tier.id,
      assessmentsGranted: tier.assessments,
      priceBHD: tier.priceBHD,
      status: "paid",
    },
  });

  const credits = await db.creditBalance.upsert({
    where: { companyId },
    update: { assessmentsRemaining: { increment: tier.assessments } },
    create: { companyId, assessmentsRemaining: tier.assessments },
  });

  return NextResponse.json({ assessmentsRemaining: credits.assessmentsRemaining });
}
