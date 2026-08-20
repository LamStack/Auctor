"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DEFAULT_TEMPLATE = `Hi {{name}},

Congrats on completing the {{role}} assessment with {{company}}! 🏆

Your AUCTOR score: {{score}}/100

We'll be reviewing results and will be in touch about next steps, which may include an interview.

Thanks for taking the time to play through it!`;

export default function SettingsPage() {
  const [template, setTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/company/me")
      .then((r) => r.json())
      .then((data) => {
        setTemplate(data.emailTemplate || DEFAULT_TEMPLATE);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/company/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailTemplate: template }),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved." : "Could not save. Try again.");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Customize the email candidates receive as soon as they finish an assessment.
        </p>
      </div>

      <Card className="max-w-2xl">
        <h2 className="font-display mb-3 text-lg font-bold text-ink">Results email template</h2>
        <p className="mb-3 text-xs text-muted">
          Available placeholders: <code className="text-brand-300">{"{{name}}"}</code>{" "}
          <code className="text-brand-300">{"{{role}}"}</code>{" "}
          <code className="text-brand-300">{"{{company}}"}</code>{" "}
          <code className="text-brand-300">{"{{score}}"}</code>
        </p>
        {loading ? (
          <p className="text-sm text-muted">Loading&hellip;</p>
        ) : (
          <>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
            <div className="mt-4 flex items-center gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save template"}
              </Button>
              {message && <span className="text-sm text-muted">{message}</span>}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
