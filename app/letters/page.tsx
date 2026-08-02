import type { Metadata } from "next";
import LetterForm from "@/components/LetterForm";
import { TEMI } from "@/lib/identities";

export const metadata: Metadata = {
  title: "The Letter Box — write to him",
  description: `Leave a short letter for ${TEMI.fullName}. An assistant composes a brief reply in his voice, and the original note is forwarded. He reads what arrives.`,
  alternates: { canonical: "/letters" },
};

export default function LettersPage() {
  return (
    <div className="room">
      <div className="shell-narrow">
        <header className="room-head">
          <p className="stamp">The Letter Box · Letters</p>
          <h1 className="room-title">
            Leave a note in the <em>porch</em>.
          </h1>
          <p className="room-deck">
            Write a few sentences. An assistant will compose a brief reply in his voice
            — and say so — while the original note goes to him. He reads what arrives.
          </p>
        </header>

        <section className="section">
          <LetterForm />
        </section>
      </div>
    </div>
  );
}
