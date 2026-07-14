"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Track {
  id: string;
  title: string;
  description: string;
  stationCount: number;
}

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [roleLabel, setRoleLabel] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tracks")
      .then((r) => r.json())
      .then((data) => setTracks(data.tracks ?? []));
  }, []);

  async function handleCreateInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTrackId) return;
    setError(null);
    setLoading(true);
    setGeneratedLink(null);

    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackId: selectedTrackId,
        roleLabel,
        candidateName: candidateName || undefined,
        candidateEmail: candidateEmail || undefined,
      }),
    });

    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not create invite.");
      return;
    }
    setGeneratedLink(`${window.location.origin}/play/${data.token}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Assessment tracks</h1>
        <p className="mt-1 text-sm text-muted">Pick a track and generate a shareable link for a candidate.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => setSelectedTrackId(track.id)}
            className={`rounded-xl2 border-2 p-5 text-left transition ${
              selectedTrackId === track.id ? "border-brand-500 bg-brand-50" : "border-line bg-panel hover:border-brand-300"
            }`}
          >
            <Badge tone="brand">{track.stationCount} stations</Badge>
            <h3 className="font-display mt-3 text-base font-bold text-ink">{track.title}</h3>
            <p className="mt-1 text-sm text-muted">{track.description}</p>
          </button>
        ))}
      </div>

      {selectedTrackId && (
        <Card className="max-w-xl">
          <h2 className="font-display mb-4 text-lg font-bold text-ink">Create candidate invite</h2>
          <form onSubmit={handleCreateInvite} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="roleLabel">Role</Label>
              <Input
                id="roleLabel"
                placeholder="e.g. Summer Intern — Junior Developer"
                required
                value={roleLabel}
                onChange={(e) => setRoleLabel(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="candidateName">Candidate name (optional)</Label>
              <Input id="candidateName" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="candidateEmail">Candidate email (optional)</Label>
              <Input
                id="candidateEmail"
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-sm font-medium text-danger">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Generating link..." : "Generate assessment link"}
            </Button>
          </form>

          {generatedLink && (
            <div className="mt-5 rounded-lg border border-mint-300 bg-mint-50 p-4">
              <p className="mb-2 text-sm font-semibold text-ink">Send this link to your candidate:</p>
              <code className="block break-all rounded bg-white px-3 py-2 text-xs text-brand-700">{generatedLink}</code>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
