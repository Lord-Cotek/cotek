// app/works/page.tsx
import type { Metadata } from "next";
import Constellation from "@/components/Constellation";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "Works",
  description: `The constellation of ${TEMI.fullName}'s works — apps, books, poems, research, sermons, photographs, and his environmental field practice.`,
};

export default function WorksPage() {
  return (
    <div className="container">
      <header className="room-head">
        <div className="room-eyebrow">/ works</div>
        <h1 className="room-title">A constellation, not a portfolio.</h1>
        <p className="room-deck">
          Seven rooms. Move with the mouse, the arrow keys, or the numbers
          1–7. The bright line between <em>sermons</em> and <em>field</em> is
          the same idea told twice — stewardship preached, stewardship
          practiced.
        </p>
      </header>

      <Constellation />
    </div>
  );
}
