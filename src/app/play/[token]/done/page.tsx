import Image from "next/image";

export default function PlayDonePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-game-sky px-6 py-12">
      <div className="w-full max-w-md rounded-xl2 bg-white/95 p-8 text-center shadow-soft backdrop-blur">
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
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent-600">
          Bahrain&rsquo;s first gamified assessments platform
        </p>
      </div>
    </main>
  );
}
