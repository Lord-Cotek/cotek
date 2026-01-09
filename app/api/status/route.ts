// app/api/status/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TARGETS = [
  { key: "BMS", url: "https://bms.cotek.app" },
  { key: "HR", url: "https://hr.cotek.app" },
  { key: "FIN", url: "https://fin.cotek.app" },
  { key: "SCM", url: "https://scm.cotek.app" }, // ✅ NEW
];

async function ping(url: string) {
  const start = Date.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "manual",
    });

    const ms = Date.now() - start;
    const status = res.status;
    const healthy = status >= 200 && status < 400; // 2xx and 3xx are OK

    return { ok: healthy, status, ms };
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
