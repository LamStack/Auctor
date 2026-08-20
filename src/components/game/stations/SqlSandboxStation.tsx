"use client";

import { useEffect, useRef, useState } from "react";
import type { Database } from "sql.js";
import Editor from "@monaco-editor/react";
import { SqlSandboxClientConfig } from "@/lib/clientStationTypes";
import { loadSqlJs } from "@/lib/sqlJsClient";
import { Button } from "@/components/ui/Button";

interface QueryResult {
  columns: string[];
  rows: unknown[][];
}

export function SqlSandboxStation({
  config,
  onAnswer,
  submitting,
}: {
  config: SqlSandboxClientConfig;
  onAnswer: (rawAnswer: { statements: string[] }) => void;
  submitting: boolean;
}) {
  const dbRef = useRef<Database | null>(null);
  const statementsRef = useRef<string[]>([]);
  const [ready, setReady] = useState(false);
  const [sql, setSql] = useState("SELECT * FROM " + (config.schemaSummary[0]?.table ?? "table") + ";");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    loadSqlJs().then((SQL) => {
      if (cancelled) return;
      const db = new SQL.Database();
      db.run(config.schemaSql);
      dbRef.current = db;
      setReady(true);
    });
    return () => {
      cancelled = true;
      dbRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runQuery() {
    if (!dbRef.current || !sql.trim()) return;
    setError(null);
    try {
      const exec = dbRef.current.exec(sql);
      statementsRef.current.push(sql);
      if (exec.length === 0) {
        setResult({ columns: [], rows: [] });
      } else {
        setResult({ columns: exec[0].columns, rows: exec[0].values });
      }
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Query failed.");
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-sm text-muted">{config.intro}</p>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4 overflow-y-auto pr-1">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Schema</p>
            <div className="flex flex-col gap-2">
              {config.schemaSummary.map((t) => (
                <div key={t.table} className="rounded-lg border border-line bg-paper p-3">
                  <p className="font-mono text-xs font-bold text-brand-300">{t.table}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{t.columns.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Tasks</p>
            <div className="flex flex-col gap-2">
              {config.tasks.map((task, i) => (
                <div key={task.id} className="rounded-lg border border-line bg-paper p-3 text-xs text-ink">
                  <p>
                    <span className="font-bold text-accent-400">{i + 1}.</span> {task.prompt}
                  </p>
                  {task.hint &&
                    (revealedHints.has(task.id) ? (
                      <p className="mt-1 text-muted">Hint: {task.hint}</p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRevealedHints((s) => new Set(s).add(task.id))}
                        className="mt-1 text-brand-300 underline"
                      >
                        Show hint
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2 flex min-h-0 flex-col gap-3">
          <div className="overflow-hidden rounded-lg border border-line">
            <Editor
              height="220px"
              language="sql"
              theme="vs-dark"
              value={sql}
              onChange={(value) => setSql(value ?? "")}
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
          <Button variant="outline" onClick={runQuery} disabled={!ready} className="w-fit">
            {ready ? "Run query" : "Loading database..."}
          </Button>

          <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-line bg-paper p-3">
            {error && <p className="font-mono text-xs text-danger">{error}</p>}
            {result && !error && (
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-line text-muted">
                    {result.columns.map((c) => (
                      <th key={c} className="px-2 py-1">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, i) => (
                    <tr key={i} className="border-b border-line/50 text-ink">
                      {row.map((cell, j) => (
                        <td key={j} className="px-2 py-1">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {result.rows.length === 0 && (
                    <tr>
                      <td className="px-2 py-1 text-muted">No rows.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {!result && !error && <p className="text-xs text-muted">Run a query to see results here.</p>}
          </div>
        </div>
      </div>

      <Button disabled={submitting || !ready} onClick={() => onAnswer({ statements: statementsRef.current })}>
        {submitting ? "Submitting..." : "Submit database solution"}
      </Button>
    </div>
  );
}
