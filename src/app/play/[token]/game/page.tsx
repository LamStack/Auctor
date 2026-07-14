"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClientStation } from "@/lib/clientStationTypes";
import { GameScene } from "@/components/game/GameScene";

interface StartResponse {
  sessionId: string;
  companyName: string;
  trackTitle: string;
  trackTheme: string;
  roleLabel: string;
  stations: ClientStation[];
}

export default function GamePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [data, setData] = useState<StartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sessions/${token}/start`, { method: "POST" })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "Could not start assessment.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [token]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-game-sky px-6">
        <p className="rounded-xl2 bg-white p-6 text-sm font-medium text-danger shadow-soft">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-game-sky">
        <p className="animate-float font-display text-lg font-bold text-white">Loading your quest&hellip;</p>
      </main>
    );
  }

  return (
    <GameScene
      token={token}
      companyName={data.companyName}
      trackTitle={data.trackTitle}
      roleLabel={data.roleLabel}
      initialStations={data.stations}
      onAllComplete={() => router.push(`/play/${token}/done`)}
    />
  );
}
