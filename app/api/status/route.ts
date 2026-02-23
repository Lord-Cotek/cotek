// app/api/status/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TargetKey = "POEMS" | "EXP" | "PEXP";

type Target = {
  key: TargetKey;
  url: string;
};

type PingResult = {
  ok: boolean;
  status: number;
  ms: number;
};

const TARGETS: Target[] = [
  { key: "POEMS", url: "https://poems.cotek.app" },
  { key: "EXP", url: "https://exp.cotek.live" },
  { key: "PEXP", url: "https://pexp.cotek.live" },
];

async function ping(url: string): Promise<PingResult> {
  const start = Date.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "manual",
    });

    const ms = Date.now() - start;
    const status = res.status;

    // Treat 2xx and 3xx as reachable/healthy (3xx because redirect: "manual")
    const ok = status >= 200 && status < 400;

    return { ok, status, ms };
  } catch {
    const ms = Date.now() - start;
    return { ok: false, status: 0, ms };
  }
}

export async function GET() {
  const results = await Promise.all(
    TARGETS.map(async (t) => {
      const r = await ping(t.url);
      return { key: t.key, url: t.url, ...r };
    })
  );

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    results,
  });
}