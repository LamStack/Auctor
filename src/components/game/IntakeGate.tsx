"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export function IntakeGate({ token, hasIntake }: { token: string; hasIntake: boolean }) {
  const [submitted, setSubmitted] = useState(hasIntake);
  const [candidateId, setCandidateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/invites/${token}/intake`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId, candidateName, candidateEmail }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <p className="mt-6 text-sm text-muted">
          You&rsquo;ll walk through a short interactive world with role-specific challenges &mdash; answer
          honestly and at your own pace.
        </p>
        <Link href={`/play/${token}/game`} className={`${buttonClasses("accent")} mt-6 w-full`}>
          Start assessment
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <p className="text-sm text-muted">Before you start, tell us who you are:</p>
      <div>
        <Label htmlFor="candidateName">Full name</Label>
        <Input id="candidateName" required value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="candidateEmail">Email</Label>
        <Input
          id="candidateEmail"
          type="email"
          required
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="candidateId">ID number (9 digits)</Label>
        <Input
          id="candidateId"
          required
          inputMode="numeric"
          pattern="\d{9}"
          maxLength={9}
          placeholder="000000000"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value.replace(/\D/g, "").slice(0, 9))}
        />
      </div>
      {error && <p className="text-sm font-medium text-danger">{error}</p>}
      <Button type="submit" variant="accent" disabled={loading} className="w-full">
        {loading ? "Continuing..." : "Continue"}
      </Button>
    </form>
  );
}
