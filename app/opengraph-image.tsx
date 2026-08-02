import { ImageResponse } from "next/og";
import { MARK_PATHS } from "@/lib/mark";
import { TEMI } from "@/lib/identities";

export const runtime = "nodejs";
export const alt = `${TEMI.fullName} — Cotek`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Satori's SVG support is partial, but it renders an <img> whose src is a data
   URI reliably — so the mark goes in as an image built from the same paths
   every other surface draws, rather than as a second copy of the artwork that
   could drift from the first. */
const markDataUri = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="85.89" height="100" viewBox="0 0 85.89 100"><g fill="#edf0f3">${MARK_PATHS.map(
    (d) => `<path d="${d}"/>`,
  ).join("")}</g></svg>`,
).toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090b",
          color: "#edf0f3",
          padding: 72,
          // A single lit edge along the top, the same gesture the panels on
          // the site use.
          borderTop: "6px solid #2fdcb4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri} width={46} height={54} alt="" />
          <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5 }}>Cotek</div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 4,
              color: "rgba(237,240,243,0.42)",
              textTransform: "uppercase",
            }}
          >
            cotek.me
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 86, lineHeight: 1.05, letterSpacing: -3 }}>
            {TEMI.fullName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 32,
              color: "rgba(237,240,243,0.62)",
            }}
          >
            Author. Builder. Steward of water. Bible teacher.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 26,
            borderTop: "1px solid rgba(237,240,243,0.12)",
            fontSize: 22,
            letterSpacing: 3,
            color: "rgba(237,240,243,0.42)",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>
            {TEMI.acronym.expansion.map((l) => l.letter).join(" · ")}
          </div>
          <div style={{ display: "flex" }}>COTEK means {TEMI.acronym.meaning.toLowerCase()}</div>
        </div>
      </div>
    ),
    size,
  );
}
