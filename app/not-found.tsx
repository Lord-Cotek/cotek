import Link from "next/link";
import { STATIONS } from "@/lib/cathedral";

export default function NotFound() {
  return (
    <div className="room">
      <div className="shell-narrow">
        <header className="room-head">
          <p className="stamp">404 · no such room</p>
          <h1 className="room-title">
            There is no door <em>here</em>.
          </h1>
          <p className="room-deck">
            The building has twelve stations and this is not one of them. Every one of
            them is listed below, which is more use than an apology.
          </p>
        </header>

        <section className="section">
          <ul className="index">
            {STATIONS.map((s, i) => (
              <li key={s.slug} style={{ "--glass": s.glass } as React.CSSProperties}>
                <Link href={s.href} data-station={s.slug}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="nm">{s.title}</span>
                  <span className="meta">{s.room}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="threshold-actions" style={{ justifyContent: "flex-start" }}>
            <Link className="btn btn-solid" href="/cathedral">
              See the plan
            </Link>
            <Link className="btn btn-ghost" href="/">
              Back to the threshold
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
