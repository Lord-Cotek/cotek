// app/api/signal/route.ts
// Today's Signal as JSON. The composition itself lives in lib/signal so that
// the page can render it without fetching its own API over HTTP.

import { NextResponse } from "next/server";
import { todaysSignal } from "@/lib/signal";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(await todaysSignal());
}
