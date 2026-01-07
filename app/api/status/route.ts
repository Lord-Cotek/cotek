// app/api/status/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGETS = [
  { key: "BMS", url: "https://bms.cotek.app" },
  { key: "HR", url: "https://hr.cotek.app" },
  { key: "FIN", url: "https://fin.cotek.app" },
];

async function ping(url: string) {
  const start = Date.now();

  try {
    // We allow redirects. Many auth-protected apps will redirect to /login (307/302).
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "manual", // IMPORTANT: we want to see the 3xx code, not follow it
    });

    const ms = Date.now() - start;

    const status = res.status;
    const healthy = status >= 200 && status < 400; // ✅ 2xx and 3xx are OK

    return {
      ok: healthy,
      status,
      ms,
    };
  } catch {
    const ms = Date.now() - start;
    return {
      ok: false,
      status: 0,
      ms,
    };
  }
}

export async function GET() {
  const results = await Promise.all(
    TARGETS.map(async (t) => {
      const r = await ping(t.url);
      return {
        key: t.key,
        url: t.url,
        ...r,
      };
    })
  );

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    results,
  });
}
