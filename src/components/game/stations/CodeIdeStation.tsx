"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { CodeIdeClientConfig } from "@/lib/clientStationTypes";
import { Button } from "@/components/ui/Button";

interface RunResult {
  id: string;
  stdin: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error: string | null;
}

interface ChatEntry {
  role: "user" | "assistant";
  content: string;
}

export function CodeIdeStation({
  token,
  stationId,
  config,
  onAnswer,
  submitting,
}: {
  token: string;
  stationId: string;
  config: CodeIdeClientConfig;
  onAnswer: (rawAnswer: { languageId: string; code: string }) => void;
  submitting: boolean;
}) {
  const [languageId, setLanguageId] = useState(config.languages[0]?.id ?? "");
  const language = config.languages.find((l) => l.id === languageId) ?? config.languages[0];
  const [code, setCode] = useState(language?.starterCode ?? "");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatEntry[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);

  function switchLanguage(id: string) {
    const next = config.languages.find((l) => l.id === id);
    setLanguageId(id);
    setCode(next?.starterCode ?? "");
    setResults(null);
  }

  async function handleRun() {
    setRunning(true);
    setResults(null);
    const res = await fetch(`/api/sessions/${token}/stations/${stationId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ languageId, code }),
    });
    setRunning(false);
    if (res.ok) {
      const data = await res.json();
      setResults(data.results);
    }
  }

  async function sendChat() {
    if (!chatInput.trim() || chatSending) return;
    const message = chatInput.trim();
    setChatMessages((m) => [...m, { role: "user", content: message }]);
    setChatInput("");
    setChatSending(true);

    const res = await fetch(`/api/sessions/${token}/stations/${stationId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, code, languageLabel: language?.label ?? "code" }),
    });
    const data = await res.json();
    setChatSending(false);
    setChatMessages((m) => [...m, { role: "assistant", content: data.reply ?? "..." }]);
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-lg bg-paper p-3 text-sm text-ink">{config.prompt}</div>

      <div className="flex items-center justify-between gap-3">
        <select
          value={languageId}
          onChange={(e) => switchLanguage(e.target.value)}
          className="rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-ink"
        >
          {config.languages.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setChatOpen((o) => !o)}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white/5"
        >
          {chatOpen ? "Hide" : "Show"} AI helper
        </button>
      </div>

      <div className={`grid min-h-0 flex-1 gap-3 ${chatOpen ? "grid-cols-3" : "grid-cols-1"}`}>
        <div className={`flex min-h-0 flex-col gap-3 ${chatOpen ? "col-span-2" : "col-span-1"}`}>
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-line">
            <Editor
              height="100%"
              language={language?.monacoLanguage ?? "plaintext"}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRun} disabled={running}>
              {running ? "Running..." : "Run tests"}
            </Button>
            <span className="text-xs text-muted">
              {config.visibleTests.length} visible test{config.visibleTests.length === 1 ? "" : "s"}
              {config.hiddenTestCount > 0 && ` + ${config.hiddenTestCount} hidden`}
            </span>
          </div>

          {results && (
            <div className="max-h-40 overflow-y-auto rounded-lg border border-line bg-paper p-3 font-mono text-xs">
              {results.map((r, i) => (
                <div key={r.id} className={`mb-2 border-b border-line/50 pb-2 ${r.passed ? "text-mint-300" : "text-danger"}`}>
                  <p className="font-bold">
                    Test {i + 1}: {r.passed ? "PASSED" : "FAILED"}
                  </p>
                  {!r.passed && (
                    <>
                      <p className="text-muted">stdin: {r.stdin || "(none)"}</p>
                      <p className="text-muted">expected: {r.expectedOutput}</p>
                      <p className="text-muted">got: {r.error ?? r.actualOutput}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {chatOpen && (
          <div className="col-span-1 flex min-h-0 flex-col rounded-lg border border-line bg-paper">
            <div className="flex-1 overflow-y-auto p-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-muted">Ask for help with syntax, a stuck point, or a bug.</p>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`mb-2 text-xs ${m.role === "user" ? "text-brand-300" : "text-ink"}`}>
                  <span className="font-bold">{m.role === "user" ? "You: " : "AI: "}</span>
                  {m.content}
                </div>
              ))}
              {chatSending && <p className="text-xs text-muted">Thinking&hellip;</p>}
            </div>
            <div className="flex gap-2 border-t border-line p-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask a question..."
                className="min-w-0 flex-1 rounded-lg bg-white/5 px-2 py-1.5 text-xs text-ink outline-none"
              />
              <button
                type="button"
                onClick={sendChat}
                disabled={chatSending}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-paper"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <Button disabled={submitting} onClick={() => onAnswer({ languageId, code })}>
        {submitting ? "Submitting..." : "Submit solution"}
      </Button>
    </div>
  );
}
