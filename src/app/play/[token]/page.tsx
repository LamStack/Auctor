import { notFound } from "next/navigation";
import Image from "next/image";
import { getInviteByToken } from "@/lib/sessionAccess";
import { Badge } from "@/components/ui/Badge";
import { IntakeGate } from "@/components/game/IntakeGate";

export default async function PlayIntroPage({ params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  if (!invite) notFound();

  const completed = Boolean(invite.session?.completedAt);

  return (
    <main className="flex min-h-screen items-center justify-center bg-game-sky px-6 py-12">
      <div className="w-full max-w-xl rounded-xl2 border border-line bg-panel/95 p-8 shadow-soft backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/Auctorlogo-transparent.png" alt="AUCTOR" width={40} height={40} className="rounded-lg" />
          <div>
            <p className="font-display text-sm font-bold text-ink">AUCTOR</p>
            <p className="text-xs text-muted">Bahrain&rsquo;s first gamified assessments platform</p>
          </div>
        </div>

        <Badge tone="accent">{invite.company.name}</Badge>
        <h1 className="font-display mt-3 text-2xl font-bold text-ink">
          {invite.roleLabel} &mdash; {invite.track.title}
        </h1>
        <p className="mt-3 text-sm text-muted">{invite.track.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-paper p-4">
            <p className="text-xs font-semibold uppercase text-muted">Stations</p>
            <p className="font-display text-xl font-bold text-ink">{invite.track.stations.length}</p>
          </div>
          <div className="rounded-lg bg-paper p-4">
            <p className="text-xs font-semibold uppercase text-muted">Estimated time</p>
            <p className="font-display text-xl font-bold text-ink">~15 min</p>
          </div>
        </div>

        {completed ? (
          <div className="mt-6 rounded-lg border border-mint-400/40 bg-mint-500/10 p-4 text-sm font-medium text-ink">
            You&rsquo;ve already completed this assessment. Thanks for playing!
          </div>
        ) : (
          <IntakeGate
            token={params.token}
            hasIntake={Boolean(invite.candidateId && invite.candidateName && invite.candidateEmail)}
          />
        )}
      </div>
    </main>
  );
}
