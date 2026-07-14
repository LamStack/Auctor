import Link from "next/link";
import { getCurrentCompany } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function CandidatesPage() {
  const company = await getCurrentCompany();
  if (!company) return null;

  const invites = await db.invite.findMany({
    where: { companyId: company.id, status: "completed" },
    include: { track: true, session: { include: { report: true } } },
  });

  const candidates = invites
    .filter((i) => i.session?.report)
    .map((i) => ({
      sessionId: i.session!.id,
      name: i.candidateName ?? "Anonymous candidate",
      role: i.roleLabel,
      track: i.track.title,
      overall: i.session!.report!.overall,
    }))
    .sort((a, b) => b.overall - a.overall);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Candidates</h1>
        <p className="mt-1 text-sm text-muted">Ranked by overall AUCTOR score across all completed assessments.</p>
      </div>

      <Card className="p-0">
        {candidates.length === 0 ? (
          <p className="p-6 text-sm text-muted">No completed assessments yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Track</th>
                <th className="px-6 py-3">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {candidates.map((c, i) => (
                <tr key={c.sessionId} className="hover:bg-brand-50/50">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/candidates/${c.sessionId}`} className="font-semibold text-ink hover:text-brand-600">
                      {i === 0 && <span className="mr-1">🏆</span>}
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted">{c.role}</td>
                  <td className="px-6 py-4 text-muted">{c.track}</td>
                  <td className="px-6 py-4">
                    <Badge tone={c.overall >= 70 ? "mint" : c.overall >= 40 ? "accent" : "neutral"}>{c.overall}/100</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
