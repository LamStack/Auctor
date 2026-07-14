import { NextResponse } from "next/server";
import { getCurrentCompany } from "@/lib/auth";

export async function GET() {
  const company = await getCurrentCompany();
  if (!company) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  return NextResponse.json({
    id: company.id,
    name: company.name,
    email: company.email,
    assessmentsRemaining: company.credits?.assessmentsRemaining ?? 0,
  });
}
