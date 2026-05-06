// app/api/feed/books/route.ts
import { NextResponse } from "next/server";
import { getBooksFeed } from "@/lib/feeds";

export const runtime = "nodejs";
export const revalidate = 60 * 60 * 24;

export async function GET() {
  const data = await getBooksFeed();
  return NextResponse.json(data);
}
