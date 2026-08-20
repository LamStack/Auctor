// Client for the free, public Judge0 CE code execution API (no key required).
// Note: Piston's public API went whitelist-only in Feb 2026, so this uses
// Judge0 instead — same "no API key needed" deal, but a different provider
// can always change policy the same way, so keep an eye on this if it stops
// working and consider self-hosting or an API-key-based provider then.

const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

export interface PistonRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
  error?: string;
}

export async function runCode(params: {
  languageId: number;
  code: string;
  stdin: string;
}): Promise<PistonRunResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(JUDGE0_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: params.code,
        language_id: params.languageId,
        stdin: params.stdin,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { stdout: "", stderr: "", exitCode: -1, timedOut: false, error: `Execution service returned ${res.status}` };
    }

    const data = await res.json();

    if (data.compile_output) {
      return { stdout: "", stderr: data.compile_output, exitCode: -1, timedOut: false };
    }

    // status.id 5 = "Time Limit Exceeded" in Judge0's status table.
    const timedOut = data.status?.id === 5;

    return {
      stdout: data.stdout ?? "",
      stderr: data.stderr ?? data.message ?? "",
      exitCode: data.status?.id === 3 ? 0 : -1,
      timedOut,
    };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return {
      stdout: "",
      stderr: "",
      exitCode: -1,
      timedOut: aborted,
      error: aborted ? "Execution timed out." : "Could not reach the code execution service.",
    };
  }
}
