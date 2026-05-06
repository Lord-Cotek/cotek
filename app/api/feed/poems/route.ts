// app/api/feed/poems/route.ts
import { NextResponse } from "next/server";
import { getPoemsFeed } from "@/lib/feeds";

export const runtime = "nodejs";
export const revalidate = 60 * 60;

export async function GET() {
  const data = await getPoemsFeed();
  return NextResponse.json(data);
}
