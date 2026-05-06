// app/page.tsx
// Threshold — the doorway. Read this once before scrolling.

import type { Metadata } from "next";
import NamesDoorway from "@/components/NamesDoorway";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: `${TEMI.fullName} — same person, many lives`,
  description:
    "Cotek Temi · Temi Cotek · Temitayo Cotek · Temitayo Ezekiel Olayiwola · Omogbolahan · Kadiri. Environmentalist, software founder, author, poet, Bible teacher. COTEK means hope.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <div className="container">
      <NamesDoorway />

      <section className="beats" aria-label="Four-beat introduction">
        <div>Author.</div>
        <div>Builder.</div>
        <div>Steward of water.</div>
        <div>Bible teacher.</div>
      </section>
    </div>
  );
}
