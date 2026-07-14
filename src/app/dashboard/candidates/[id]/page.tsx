import { notFound } from "next/navigation";
import { getCurrentCompany } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkillRadarChart } from "@/components/dashboard/SkillRadarChart";

export default async function CandidateReportPage({ params }: { params: { id: string } }) {
  const company = await getCurrentCompany();
  if (!company) return null;

  const session = await db.session.findUnique({
    where: { id: params.id },
    include: {
      report: true,
      invite: { include: { track: true } },
      results: { include: { station: true } },
    },
  });

  if (!session || session.invite.companyId !== company.id || !session.report) notFound();

  const results = [...session.results].sort((a, b) => a.station.order - b.station.order);
  const strengths: string[] = JSON.parse(session.report.strengths);
  const growthAreas: string[] = JSON.parse(session.report.growthAreas);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted">{session.invite.track.title} &middot; {session.invite.roleLabel}</p>
        <h1 className="font-display text-2xl font-bold text-ink">
          {session.invite.candidateName ?? "Anonymous candidate"}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Overall score</p>
          <p className="font-display mt-1 text-5xl font-bold text-brand-600">{session.report.overall}<span className="text-2xl text-muted">/100</span></p>
          <div className="mt-4">
            <SkillRadarChart
              technicalSkill={session.report.technicalSkill}
              problemSolving={session.report.problemSolving}
              softSkills={session.report.softSkills}
            />
          </div>
          {!session.report.aiGenerated && (
            <Badge tone="neutral" className="mt-2">Rule-based report (AI narrative unavailable)</Badge>
          )}
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="font-display mb-3 text-lg font-bold text-ink">Explainability</h2>
          <p className="text-sm text-ink">{session.report.narrative}</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mint-600">Strengths</p>
              <ul className="flex flex-col gap-1.5 text-sm text-ink">
                {strengths.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-mint-500">+</span>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-600">Growth areas</p>
              <ul className="flex flex-col gap-1.5 text-sm text-ink">
                {growthAreas.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent-500">&middot;</span>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-display mb-4 text-lg font-bold text-ink">Station breakdown</h2>
        <div className="flex flex-col divide-y divide-line">
          {results.map((r) => (
            <div key={r.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold text-ink">{r.station.title}</p>
                <p className="text-xs capitalize text-muted">{r.station.type.replace("-", " ")}</p>
              </div>
              <Badge tone={r.score >= 70 ? "mint" : r.score >= 40 ? "accent" : "neutral"}>{r.score}/100</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
