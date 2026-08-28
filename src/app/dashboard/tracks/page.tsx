"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Track {
  id: string;
  title: string;
  description: string;
  category: string;
  stationCount: number;
}

interface Recipient {
  email: string;
  name?: string;
}

function parseRecipients(raw: string): Recipient[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [email, name] = line.split(",").map((s) => s.trim());
      return { email, name: name || undefined };
    })
    .filter((r) => r.email.includes("@"));
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [roleLabel, setRoleLabel] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [recipientsRaw, setRecipientsRaw] = useState("");
  const [bulkResult, setBulkResult] = useState<{ invitesCreated: number; emailsSent: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/tracks")
      .then((r) => r.json())
      .then((data) => setTracks(data.tracks ?? []));
  }, []);

  function resetOutputs() {
    setError(null);
    setGeneratedLink(null);
    setBulkResult(null);
  }

  async function handleCreateInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTrackId) return;
    resetOutputs();
    setLoading(true);

    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId: selectedTrackId, roleLabel }),
    });

    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not create invite.");
      return;
    }
    setGeneratedLink(`${window.location.origin}/play/${data.token}`);
  }

  async function handleBulkInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTrackId) return;
    const recipients = parseRecipients(recipientsRaw);
    if (recipients.length === 0) {
      setError("Add at least one valid email, one per line.");
      return;
    }
    resetOutputs();
    setLoading(true);

    const res = await fetch("/api/invites/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId: selectedTrackId, roleLabel, recipients }),
    });

    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not create batch.");
      return;
    }
    setBulkResult({ invitesCreated: data.invitesCreated, emailsSent: data.emailsSent });
    setRecipientsRaw("");
  }

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((l) => !/^email/i.test(l)); // drop a header row if present
      setRecipientsRaw((prev) => (prev ? `${prev}\n${lines.join("\n")}` : lines.join("\n")));
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const recipientCount = parseRecipients(recipientsRaw).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Assessment tracks</h1>
        <p className="mt-1 text-sm text-muted">
          Pick a track, then invite one candidate with a shareable link or invite many at once via bulk invite.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => {
              setSelectedTrackId(track.id);
              resetOutputs();
            }}
            className={`rounded-xl2 border-2 p-5 text-left transition ${
              selectedTrackId === track.id ? "border-brand-400 bg-brand-500/10" : "border-line bg-panel hover:border-brand-400/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <Badge tone="brand">{track.stationCount} stations</Badge>
              <Badge tone="neutral" className="capitalize">
                {track.category.replace("-", " ")}
              </Badge>
            </div>
            <h3 className="font-display mt-3 text-base font-bold text-ink">{track.title}</h3>
            <p className="mt-1 text-sm text-muted">{track.description}</p>
          </button>
        ))}
      </div>

      {selectedTrackId && (
        <Card className="max-w-xl">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("single");
                resetOutputs();
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                mode === "single" ? "bg-brand-500 text-white" : "bg-paper text-muted hover:text-ink"
              }`}
            >
              Single invite
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("bulk");
                resetOutputs();
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                mode === "bulk" ? "bg-brand-500 text-white" : "bg-paper text-muted hover:text-ink"
              }`}
            >
              Bulk invite
            </button>
          </div>

          {mode === "single" ? (
            <>
              <h2 className="font-display mb-4 text-lg font-bold text-ink">Create candidate invite</h2>
              <form onSubmit={handleCreateInvite} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="roleLabel">Role</Label>
                  <Input
                    id="roleLabel"
                    placeholder="e.g. Summer Intern &mdash; Junior Developer"
                    required
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm font-medium text-danger">{error}</p>}
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating link..." : "Generate assessment link"}
                </Button>
              </form>

              {generatedLink && (
                <div className="mt-5 rounded-lg border border-mint-400/40 bg-mint-500/10 p-4">
                  <p className="mb-2 text-sm font-semibold text-ink">Send this link to your candidate:</p>
                  <code className="block break-all rounded bg-paper px-3 py-2 text-xs text-mint-300">{generatedLink}</code>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="font-display mb-4 text-lg font-bold text-ink">Bulk invite candidates</h2>
              <form onSubmit={handleBulkInvite} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="bulkRoleLabel">Role</Label>
                  <Input
                    id="bulkRoleLabel"
                    placeholder="e.g. Summer Intern &mdash; Junior Developer"
                    required
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <Label htmlFor="recipients">Recipients (one per line: email or email,name)</Label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-brand-300 hover:underline"
                    >
                      Upload CSV
                    </button>
                    <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvFile} />
                  </div>
                  <textarea
                    id="recipients"
                    rows={8}
                    placeholder={"jane@company.com, Jane Doe\njohn@company.com"}
                    value={recipientsRaw}
                    onChange={(e) => setRecipientsRaw(e.target.value)}
                    className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-400 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-muted">{recipientCount} valid recipient{recipientCount === 1 ? "" : "s"} detected</p>
                </div>
                {error && <p className="text-sm font-medium text-danger">{error}</p>}
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending invites..." : `Send ${recipientCount || ""} invite${recipientCount === 1 ? "" : "s"}`}
                </Button>
              </form>

              {bulkResult && (
                <div className="mt-5 rounded-lg border border-mint-400/40 bg-mint-500/10 p-4">
                  <p className="text-sm font-semibold text-ink">
                    Batch created: {bulkResult.invitesCreated} invite{bulkResult.invitesCreated === 1 ? "" : "s"} created,{" "}
                    {bulkResult.emailsSent} email{bulkResult.emailsSent === 1 ? "" : "s"} sent.
                  </p>
                  <p className="mt-1 text-xs text-muted">See the Batches page to track progress and rankings.</p>
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  );
}
