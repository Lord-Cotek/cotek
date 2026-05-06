// app/api/feed/unsplash/route.ts
import { NextResponse } from "next/server";
import { getUnsplashFeed } from "@/lib/feeds";

export const runtime = "nodejs";
export const revalidate = 60 * 60 * 6;

export async function GET() {
  const data = await getUnsplashFeed();
  return NextResponse.json(data);
}
