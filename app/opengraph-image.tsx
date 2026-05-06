// app/opengraph-image.tsx
// Shared OG image — name in serif, tagline in mono, cosmos backdrop.

import { ImageResponse } from "next/og";
import { TEMI } from "@/lib/identities";

export const runtime = "edge";
export const alt = `${TEMI.fullName} — same person, many lives.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px",
          color: "rgba(255,255,255,0.95)",
          background:
            "radial-gradient(900px 600px at 20% 20%, rgba(131,56,236,0.4), transparent 60%), radial-gradient(800px 600px at 80% 30%, rgba(58,134,255,0.4), transparent 60%), radial-gradient(900px 600px at 50% 100%, rgba(255,0,110,0.25), transparent 60%), #070914",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
            fontFamily: "monospace",
          }}
        >
          cotek.me
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            {TEMI.fullName}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 28,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.78)",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Author. Builder. Steward of water. Bible teacher. COTEK means hope.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.55)",
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span>C · O · T · E · K</span>
          <span>same person · many lives</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
