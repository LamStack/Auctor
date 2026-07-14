import { NextResponse } from "next/server";
import { PACKAGE_TIERS } from "@/lib/packages";

export async function GET() {
  return NextResponse.json({ packages: PACKAGE_TIERS });
}
