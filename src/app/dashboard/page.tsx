import Link from "next/link";
import { getCurrentCompany } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { buttonClasses } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function DashboardOverviewPage() {
  const company = await getCurrentCompany();
  if (!company) return null;

  const invites = await db.invite.findMany({
    where: { companyId: company.id },
    include: { track: true, session: { include: { report: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const totalInvites = await db.invite.count({ where: { companyId: company.id } });
  const completed = await db.invite.count({ where: { companyId: company.id, status: "completed" } });
  const completedReports = await db.skillReport.findMany({
    where: { session: { invite: { companyId: company.id } } },
    select: { overall: true },
  });
  const avgScore = completedReports.length
    ? Math.round(completedReports.reduce((sum, r) => sum + r.overall, 0) / completedReports.length)
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Bahrain&rsquo;s first gamified assessments platform</p>
          <h1 className="font-display text-2xl font-bold text-ink">Welcome back, {company.name}</h1>
        </div>
        <Link href="/dashboard/tracks" className={buttonClasses("accent")}>
          Send a new assessment
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Assessments remaining</p>
          <p className="font-display mt-2 text-3xl font-bold text-ink">{company.credits?.assessmentsRemaining ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Invites sent</p>
          <p className="font-display mt-2 text-3xl font-bold text-ink">{totalInvites}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Completed</p>
          <p className="font-display mt-2 text-3xl font-bold text-ink">{completed}</p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Average score</p>
          <p className="font-display mt-2 text-3xl font-bold text-ink">{avgScore ?? "—"}</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-display mb-4 text-lg font-bold text-ink">Recent activity</h2>
        {invites.length === 0 ? (
          <p className="text-sm text-muted">
            No assessments sent yet.{" "}
            <Link href="/dashboard/tracks" className="font-semibold text-brand-600">
              Send your first one
            </Link>
            .
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {invite.candidateName ?? "Unnamed candidate"} &middot; {invite.roleLabel}
                  </p>
                  <p className="text-xs text-muted">{invite.track.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  {invite.session?.report ? (
                    <Badge tone="mint">{invite.session.report.overall}/100</Badge>
                  ) : (
                    <Badge tone={invite.status === "pending" ? "neutral" : "brand"}>{invite.status.replace("_", " ")}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
