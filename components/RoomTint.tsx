// components/RoomTint.tsx
"use client";

// Each route is a "room" with a slightly different cosmos tint. We set
// data-room on <html> based on the path; CSS does the rest.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function roomFor(pathname: string): string {
  if (!pathname) return "threshold";
  if (pathname === "/") return "threshold";
  if (pathname.startsWith("/works/field")) return "field";
  if (pathname.startsWith("/works/sermons")) return "sermons";
  if (pathname.startsWith("/works/poems")) return "poems";
  if (pathname.startsWith("/letters")) return "letters";
  if (pathname.startsWith("/signal")) return "signal";
  return "default";
}

export default function RoomTint() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-room", roomFor(pathname));
  }, [pathname]);

  return null;
}
