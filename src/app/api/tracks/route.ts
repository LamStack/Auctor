import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const tracks = await db.track.findMany({
    include: { _count: { select: { stations: true } } },
  });

  return NextResponse.json({
    tracks: tracks.map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      theme: t.theme,
      stationCount: t._count.stations,
    })),
  });
}
