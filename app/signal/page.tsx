import type { Metadata } from "next";
import { todaysSignal } from "@/lib/signal";

export const metadata: Metadata = {
  title: "The Bell — today's signal",
  description: "A sixty-word reflection in Temi Cotek's voice. Composed once a day, then left alone.",
  alternates: { canonical: "/signal" },
};

export const revalidate = 3600;

export default async function SignalPage() {
  const signal = await todaysSignal();

  return (
    <div className="room">
      <div className="shell-narrow">
        <header className="room-head">
          <p className="stamp">The Bell · Signal</p>
          <h1 className="room-title">
            Rung once a day, then <em>silence</em>.
          </h1>
          <p className="room-deck">
            A small dispatch from the crossing. Composed in the morning and not
            revisited, which is the only way a daily thing stays daily.
          </p>
        </header>

        <section className="section reveal">
          <article className="panel">
            <p className="stamp stamp-rule">
              {signal.date} · theme: {signal.theme} · alludes to {signal.verse}
            </p>
            <p className="panel-body">{signal.text}</p>
            <p className="panel-note">
              {signal.source === "live"
                ? "Composed today."
                : "Composed from the archive — the well is quiet just now."}
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
