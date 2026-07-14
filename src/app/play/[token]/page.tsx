import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getInviteByToken } from "@/lib/sessionAccess";
import { buttonClasses } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function PlayIntroPage({ params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  if (!invite) notFound();

  const completed = Boolean(invite.session?.completedAt);

  return (
    <main className="flex min-h-screen items-center justify-center bg-game-sky px-6 py-12">
      <div className="w-full max-w-xl rounded-xl2 bg-white/95 p-8 shadow-soft backdrop-blur">
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
          <div className="mt-6 rounded-lg border border-mint-300 bg-mint-50 p-4 text-sm font-medium text-ink">
            You&rsquo;ve already completed this assessment. Thanks for playing!
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-muted">
              You&rsquo;ll walk through a short interactive world with quizzes, logic puzzles, bug hunts, and
              decision scenarios. Answer honestly and at your own pace &mdash; there&rsquo;s no traditional
              timer except on the speed round.
            </p>
            <Link href={`/play/${params.token}/game`} className={`${buttonClasses("accent")} mt-6 w-full`}>
              Start assessment
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
