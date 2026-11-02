import Link from "next/link";
import { getCurrentCompany } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function BatchesPage() {
  const company = await getCurrentCompany();
  if (!company) return null;

  const batches = await db.inviteBatch.findMany({
    where: { companyId: company.id },
    include: { track: true, invites: { include: { session: { include: { report: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = batches.map((b) => {
    const completed = b.invites.filter((i) => i.session?.report);
    const avg = completed.length
      ? Math.round(completed.reduce((sum, i) => sum + i.session!.report!.overall, 0) / completed.length)
      : null;
    return {
      id: b.id,
      roleLabel: b.roleLabel,
      trackTitle: b.track.title,
      createdAt: b.createdAt,
      invited: b.invites.length,
      completed: completed.length,
      avg,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Batches</h1>
        <p className="mt-1 text-sm text-muted">Bulk-invited candidate cohorts, ranked against each other.</p>
      </div>

      <Card className="p-0">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            No batches yet. Use &ldquo;Bulk invite&rdquo; from the{" "}
            <Link href="/dashboard/tracks" className="text-brand-700 dark:text-brand-300 hover:underline">
              Assessment tracks
            </Link>{" "}
            page to invite many candidates at once.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Track</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Progress</th>
                <th className="px-6 py-3">Avg score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-brand-500/10">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/batches/${b.id}`} className="font-semibold text-ink hover:text-brand-700 dark:hover:text-brand-300">
                      {b.roleLabel}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted">{b.trackTitle}</td>
                  <td className="px-6 py-4 text-muted">{b.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted">
                    {b.completed}/{b.invited} completed
                  </td>
                  <td className="px-6 py-4">
                    {b.avg === null ? (
                      <span className="text-muted">&mdash;</span>
                    ) : (
                      <Badge tone={b.avg >= 70 ? "mint" : b.avg >= 40 ? "accent" : "neutral"}>{b.avg}/100</Badge>
                    )}
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
