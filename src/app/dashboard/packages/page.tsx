"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface PackageTier {
  id: string;
  name: string;
  assessments: number | null;
  priceBHD: number | null;
  perAssessmentBHD: number | null;
  tagline: string;
  highlighted?: boolean;
}

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageTier[]>([]);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => setPackages(data.packages ?? []));
  }, []);

  async function handlePurchase(id: string) {
    setPurchasingId(id);
    setMessage(null);
    const res = await fetch("/api/packages/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId: id }),
    });
    setPurchasingId(null);
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Purchase failed.");
      return;
    }
    setMessage(`Purchased! You now have ${data.assessmentsRemaining} assessments remaining.`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Packages</h1>
        <p className="mt-1 text-sm text-muted">
          Payments are simulated for this MVP &mdash; purchasing grants credits immediately for testing.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-mint-300 bg-mint-50 px-4 py-3 text-sm font-medium text-ink">
          {message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((tier) => (
          <Card key={tier.id} className={tier.highlighted ? "border-2 border-accent-400" : ""}>
            {tier.highlighted && <Badge tone="accent" className="mb-3">Most popular</Badge>}
            <h3 className="font-display text-lg font-bold text-ink">{tier.name}</h3>
            <p className="mt-1 min-h-[2.5rem] text-sm text-muted">{tier.tagline}</p>
            <p className="font-display mt-4 text-2xl font-bold text-ink">
              {tier.priceBHD ? `${tier.priceBHD} BHD` : "Custom"}
            </p>
            <p className="text-sm text-muted">
              {tier.assessments ? `${tier.assessments} assessments` : "Unlimited, negotiated"}
            </p>
            {tier.priceBHD ? (
              <Button
                variant={tier.highlighted ? "accent" : "primary"}
                className="mt-4 w-full"
                disabled={purchasingId === tier.id}
                onClick={() => handlePurchase(tier.id)}
              >
                {purchasingId === tier.id ? "Processing..." : "Buy package"}
              </Button>
            ) : (
              <Button variant="outline" className="mt-4 w-full" disabled>
                Contact sales
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
