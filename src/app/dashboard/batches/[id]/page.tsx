import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentCompany } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function BatchDetailPage({ params }: { params: { id: string } }) {
  const company = await getCurrentCompany();
  if (!company) return null;

  const batch = await db.inviteBatch.findUnique({
    where: { id: params.id },
    include: { track: true, invites: { include: { session: { include: { report: true } } } } },
  });

  if (!batch || batch.companyId !== company.id) notFound();

  const candidates = batch.invites
    .filter((i) => i.session?.report)
    .map((i) => ({
      sessionId: i.session!.id,
      candidateId: i.candidateId ?? "—",
      name: i.candidateName ?? i.candidateEmail ?? "Anonymous candidate",
      overall: i.session!.report!.overall,
      seniorityEstimate: i.session!.report!.seniorityEstimate,
    }))
    .sort((a, b) => b.overall - a.overall);

  const pending = batch.invites.filter((i) => !i.session?.report);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/batches" className="text-sm text-muted hover:text-brand-300">
          &larr; All batches
        </Link>
        <h1 className="font-display mt-1 text-2xl font-bold text-ink">{batch.roleLabel}</h1>
        <p className="mt-1 text-sm text-muted">
          {batch.track.title} &middot; {candidates.length}/{batch.invites.length} completed
        </p>
      </div>

      <Card className="p-0">
        {candidates.length === 0 ? (
          <p className="p-6 text-sm text-muted">No completions yet for this batch.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Seniority estimate</th>
                <th className="px-6 py-3">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {candidates.map((c, i) => (
                <tr key={c.sessionId} className="hover:bg-brand-500/10">
                  <td className="px-6 py-4 font-mono text-xs text-muted">#{i + 1}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted">{c.candidateId}</td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/candidates/${c.sessionId}`} className="font-semibold text-ink hover:text-brand-300">
                      {i === 0 && <span className="mr-1">🏆</span>}
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted">{c.seniorityEstimate ?? "—"}</td>
                  <td className="px-6 py-4">
                    <Badge tone={c.overall >= 70 ? "mint" : c.overall >= 40 ? "accent" : "neutral"}>{c.overall}/100</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {pending.length > 0 && (
        <Card>
          <h2 className="font-display mb-3 text-base font-bold text-ink">Not yet completed ({pending.length})</h2>
          <ul className="flex flex-col gap-1.5 text-sm text-muted">
            {pending.map((i) => (
              <li key={i.id}>
                {i.candidateName ?? i.candidateEmail ?? "Unknown"} &middot;{" "}
                <span className="capitalize">{i.status}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
