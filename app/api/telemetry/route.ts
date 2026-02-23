// app/api/telemetry/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TargetKey = "POEMS" | "EXP" | "PEXP";

type Target = {
  key: TargetKey;
  baseUrl: string;
};

const TARGETS: Target[] = [
  { key: "POEMS", baseUrl: "https://poems.cotek.app" },
  { key: "EXP", baseUrl: "https://exp.cotek.live" },
  { key: "PEXP", baseUrl: "https://pexp.cotek.live" },
];

type TelemetryFetch = {
  ok: boolean;
  status: number;
  ms: number;
  data?: unknown;
  error?: string;
};

async function fetchJsonWithTimeout(url: string, msTimeout: number): Promise<TelemetryFetch> {
  const start = Date.now();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), msTimeout);

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        // Encourage JSON, but don’t require it.
        Accept: "application/json,text/plain,*/*",
      },
    });

    const ms = Date.now() - start;

    let parsed: unknown = undefined;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        parsed = await res.json();
      } catch {
        // ignore parse failure
      }
    } else {
      // attempt parse anyway if it looks like JSON
      try {
        const txt = await res.text();
        parsed = JSON.parse(txt);
      } catch {
        // ignore
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      ms,
      data: parsed,
    };
  } catch (e: any) {
    const ms = Date.now() - start;
    const isAbort = e?.name === "AbortError";
    return {
      ok: false,
      status: 0,
      ms,
      error: isAbort ? "timeout" : "fetch_failed",
    };
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  // These endpoints are OPTIONAL in your apps.
  // If they don't exist yet (404), we treat it as "no telemetry", not failure.
  const endpointPairs = [
    { name: "summary", path: "/api/summary" },
    { name: "meta", path: "/api/meta" },
  ] as const;

  const results = await Promise.all(
    TARGETS.map(async (t) => {
      const checks: Record<string, TelemetryFetch> = {};

      for (const ep of endpointPairs) {
        const url = `${t.baseUrl}${ep.path}`;
        const r = await fetchJsonWithTimeout(url, 2500);

        // 404 = endpoint not implemented -> not an error, just absent signal
        if (r.status === 404) {
          checks[ep.name] = { ok: false, status: 404, ms: r.ms, error: "not_implemented" };
        } else {
          checks[ep.name] = r;
        }
      }

      return {
        key: t.key,
        baseUrl: t.baseUrl,
        checks,
      };
    })
  );

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    results,
  });
}