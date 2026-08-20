import Image from "next/image";
import { getInviteByToken } from "@/lib/sessionAccess";

export default async function PlayDonePage({ params }: { params: { token: string } }) {
  const invite = await getInviteByToken(params.token);
  const rank = invite?.session?.report?.rank ?? null;
  const rankTotal = invite?.session?.report?.rankTotal ?? null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-game-sky px-6 py-12">
      <div className="w-full max-w-md rounded-xl2 border border-line bg-panel/95 p-8 text-center shadow-soft backdrop-blur">
        <Image
          src="/Auctorlogo-transparent.png"
          alt="AUCTOR"
          width={56}
          height={56}
          className="mx-auto animate-float rounded-lg"
        />
        <h1 className="font-display mt-5 text-2xl font-bold text-ink">Nice work! 🎉</h1>
        <p className="mt-3 text-sm text-muted">
          Your responses have been submitted. The hiring team will review your AUCTOR skill report as part
          of their process.
        </p>
        {rank && rankTotal && (
          <div className="mt-5 rounded-lg border border-accent-400/30 bg-accent-500/10 p-4">
            <p className="font-display text-2xl font-bold text-accent-400">
              #{rank} <span className="text-sm font-normal text-muted">of {rankTotal}</span>
            </p>
            <p className="text-xs text-muted">Your rank among candidates on this track</p>
          </div>
        )}
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent-400">
          Bahrain&rsquo;s first gamified assessments platform
        </p>
      </div>
    </main>
  );
}
