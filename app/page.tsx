"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TargetKey = "POEMS" | "EXP" | "PEXP";
type ViewMode = "cards" | "systems";

type AppCard = {
  key: TargetKey;
  name: string;
  short: string;
  url: string;
  tag: string;
  gradient: string;
  glow: string;
  accent: string;
  what: string;
  keyUses: string[];
  badge?: string;
};

const CONTACT_EMAIL = "tcotek@amrome.com";
const LOGO_SRC = "/cotek-logo.png";

const APPS: AppCard[] = [
  {
    key: "POEMS",
    name: "poems",
    short: "A library of lines — draft, publish, and let language breathe.",
    url: "https://poems.cotek.app",
    tag: "Signal",
    gradient: "grad-poems",
    glow: "glow-poems",
    accent: "accent-poems",
    what: "Information flow (language)",
    keyUses: ["Write & revise", "Publish collections", "Search by theme / mood"],
  },
  {
    key: "EXP",
    name: "exp",
    short:
      "A personal family finance ledger — track budgets, reconcile reality, and keep the household story coherent.",
    url: "https://exp.cotek.live",
    tag: "Household Ledger",
    gradient: "grad-exp",
    glow: "glow-exp",
    accent: "accent-exp",
    what: "Household cashflow & budgeting",
    keyUses: ["Track income & expenses", "Budgets & categories", "Monthly reconciliation"],
    badge: "home",
  },
  {
    key: "PEXP",
    name: "pexp",
    short:
      "A multi-tenant ledger platform — accounts, journals, and clean books across multiple entities.",
    url: "https://pexp.cotek.live",
    tag: "Multi-Tenant",
    gradient: "grad-pexp",
    glow: "glow-pexp",
    accent: "accent-pexp",
    what: "Multi-entity accounting system",
    keyUses: ["Tenants / entities", "Accounts & journals", "Reporting foundations"],
    badge: "platform",
  },
];

type StatusRow = {
  key: TargetKey;
  url: string;
  ok: boolean;
  status: number;
  ms: number;
};

type StatusPayload = {
  checkedAt: string;
  results: StatusRow[];
};

function statusLabel(s?: StatusRow) {
  if (!s) return { text: "Checking…", cls: "st-wait" };
  if (s.ok) return { text: `Online • ${s.ms}ms`, cls: "st-ok" };
  if (s.status) return { text: `Degraded • ${s.status}`, cls: "st-warn" };
  return { text: "Offline", cls: "st-bad" };
}

export default function Home() {
  const [view, setView] = useState<ViewMode>("systems");

  const [status, setStatus] = useState<Record<TargetKey, StatusRow | undefined>>({
    POEMS: undefined,
    EXP: undefined,
    PEXP: undefined,
  });

  const [checkedAt, setCheckedAt] = useState<string>("");

  const linksText = useMemo(
    () => APPS.map((a) => `${a.name}: ${a.url}`).join("\n"),
    []
  );

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const data = (await res.json()) as StatusPayload;

      const map: Record<TargetKey, StatusRow | undefined> = {
        POEMS: undefined,
        EXP: undefined,
        PEXP: undefined,
      };

      data.results.forEach((r) => {
        map[r.key] = r;
      });

      setStatus(map);
      setCheckedAt(data.checkedAt);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 60000);
    return () => clearInterval(t);
  }, []);

  const checkedLabel = checkedAt
    ? new Date(checkedAt).toLocaleString()
    : "—";

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <header className="top">
          <div className="brand">
            <div className="logo">
              <img src={LOGO_SRC} alt="COTEK" className="logo-img" />
            </div>
            <div>
              <div className="brand-title">COTEK ’verse</div>
              <div className="brand-sub">
                Signal (poems), stability (exp), scale (pexp).
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="chip"
              onClick={() => setView((v) => (v === "cards" ? "systems" : "cards"))}
            >
              View: {view === "cards" ? "Cards" : "Systems"}
            </button>
            <button
              className="chip chip-ghost"
              onClick={async () => {
                await navigator.clipboard.writeText(linksText);
              }}
            >
              Copy links
            </button>
            <a
              className="chip"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              Say hi
            </a>
          </div>
        </header>

        {/* STATUS STRIP */}
        <section className="dash">
          <div className="dash-card">
            <div className="kpi-label">Model</div>
            <div className="kpi-value">flows</div>
            <div className="meta-row">
              Checked: {checkedLabel}
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section className="cards cards-3">
          {APPS.map((app) => {
            const row = status[app.key];
            const st = statusLabel(row);

            return (
              <Link
                key={app.key}
                href={app.url}
                className={`app-card ${app.glow}`}
                target="_blank"
              >
                <div className={`app-banner ${app.gradient}`} />
                <div className="app-body">
                  <h2>{app.name}</h2>

                  <div className={`status-pill ${st.cls}`}>
                    {st.text}
                  </div>

                  <p className="app-desc">{app.short}</p>

                  <div className="url">
                    {app.url.replace("https://", "")}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} COTEK ’verse • systems-first personal constellation.
        </footer>
      </div>
    </main>
  );
}