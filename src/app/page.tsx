import Link from "next/link";
import Image from "next/image";
import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-radial">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <Image src="/Auctorlogo-transparent.png" alt="AUCTOR" width={40} height={40} className="rounded-lg" />
          <span className="font-display text-lg font-bold text-ink">AUCTOR</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-ink hover:text-brand-600">
            Sign in
          </Link>
          <Link href="/signup" className={buttonClasses("primary", "text-sm")}>
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-20 pt-10 text-center">
        <span className="rounded-full bg-accent-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-700">
          Bahrain&rsquo;s first gamified assessments platform
        </span>
        <h1 className="font-display max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Hire on skill, not paper.
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          AUCTOR turns technical hiring into a game. Candidates walk through an interactive world,
          solve real IT challenges, and AUCTOR turns it into a skill report your team can trust &mdash;
          technical ability, problem-solving, and soft skills, all in one place.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup" className={buttonClasses("primary")}>
            Create employer account
          </Link>
          <Link href="/login" className={buttonClasses("outline")}>
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 sm:grid-cols-3">
        <Card>
          <h3 className="font-display mb-2 text-lg font-bold text-ink">Gamified assessments</h3>
          <p className="text-sm text-muted">
            Candidates play through a stylized world &mdash; quizzes, bug hunts, drag-and-drop logic,
            and scenario decisions &mdash; instead of a static test form.
          </p>
        </Card>
        <Card>
          <h3 className="font-display mb-2 text-lg font-bold text-ink">AI-backed skill reports</h3>
          <p className="text-sm text-muted">
            Every session produces a technical skill, problem-solving, and soft-skills score with an
            explainable, AI-written narrative for hiring managers.
          </p>
        </Card>
        <Card>
          <h3 className="font-display mb-2 text-lg font-bold text-ink">Simple packages</h3>
          <p className="text-sm text-muted">
            Buy assessments in packages &mdash; 50, 150, or more &mdash; and hand them out to
            candidates, interns, or graduate applicants.
          </p>
        </Card>
      </section>
    </main>
  );
}
