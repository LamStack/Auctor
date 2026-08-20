import path from "path";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { SqlSandboxConfig } from "@/lib/stationTypes";
import { StationScoreResult } from "@/lib/scoring/rules";

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    // Built as a plain runtime string (not require.resolve) so webpack never
    // tries to parse the .wasm binary as a JS module. See
    // next.config.mjs's outputFileTracingIncludes for why the file still
    // ends up in the deployed bundle despite that.
    const wasmPath = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");
    sqlJsPromise = initSqlJs({ locateFile: () => wasmPath });
  }
  return sqlJsPromise;
}

// Re-runs the candidate's submitted SQL against a fresh, server-side database
// seeded the same way the client's sandbox was, so a tampered client-side
// "task complete" flag can't be trusted — only the actual resulting data can.
export async function scoreSqlSandbox(
  config: SqlSandboxConfig,
  rawAnswer: { statements: string[] }
): Promise<StationScoreResult> {
  const SQL = await getSqlJs();
  const db = new SQL.Database();

  try {
    db.run(config.schemaSql);

    for (const statement of rawAnswer.statements ?? []) {
      try {
        db.run(statement);
      } catch {
        // Invalid/failed statement — leave state as-is and continue; it will
        // simply fail to satisfy whichever task depended on it.
      }
    }

    let passed = 0;
    const total = config.tasks.length;

    for (const task of config.tasks) {
      try {
        const result = db.exec(task.validationSql);
        const hasRows = result.length > 0 && result[0].values.length > 0;
        const taskPassed = task.expectAbsence ? !hasRows : hasRows;
        if (taskPassed) passed += 1;
      } catch {
        // Validation query erroring counts as the task failing (except for
        // expectAbsence tasks, where an error — e.g. a dropped table/column
        // — still correctly implies the thing in question is gone).
        if (task.expectAbsence) passed += 1;
      }
    }

    const score = total > 0 ? Math.round((passed / total) * 100) : 0;

    return {
      score,
      note: `Completed ${passed}/${total} database tasks.`,
      dimensions: { technicalSkill: score, problemSolving: Math.round(score * 0.7) },
    };
  } finally {
    db.close();
  }
}
