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
    // HEAD is lighter; some sites don’t support it properly, so we fallback to GET.
    let res = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (!res.ok) {
      res = await fetch(url, { method: "GET", cache: "no-store" });
    }
    const ms = Date.now() - start;
    return {
      ok: res.ok,
      status: res.status,
      ms,
    };
  } catch (e) {
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
