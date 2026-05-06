// app/api/feed/sermons/route.ts
import { NextResponse } from "next/server";
import { getSermonsFeed } from "@/lib/feeds";

export const runtime = "nodejs";
export const revalidate = 60 * 60 * 24;

export async function GET() {
  const data = await getSermonsFeed();
  return NextResponse.json(data);
}
