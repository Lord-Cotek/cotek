// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AppCard = {
  name: string;
  short: string;
  url: string;
  tag: string;
  gradient: string;
  glow: string;
  accent: string;
  who: string;
  keyUses: string[];
};

const ACCESS_EMAIL = "tcotek@amrome.com";
const LOGO_SRC = "/cotek-logo.png";

const APPS: AppCard[] = [
  {
    name: "BMS",
    short: "Business Management System — sales flow, ops, delivery pulse.",
    url: "https://bms.cotek.app",
    tag: "Operations",
    gradient: "grad-bms",
    glow: "glow-bms",
    accent: "accent-bms",
    who: "Operations, Admin, Sales coordination",
    keyUses: ["Sales leads & logs", "Pipeline hygiene", "Project tracking"],
  },
  {
    name: "HR",
    short: "People platform — employees, leave, documents, training & goals.",
    url: "https://hr.cotek.app",
    tag: "People",
    gradient: "grad-hr",
    glow: "glow-hr",
    accent: "accent-hr",
    who: "HR, Admin, Managers",
    keyUses: ["Employee directory", "Leave workflows", "Training & goals"],
  },
  {
    name: "FIN",
    short: "Finance platform — numbers, approvals, tracking, visibility.",
    url: "https://fin.cotek.app",
    tag: "Finance",
    gradient: "grad-fin",
    glow: "glow-fin",
    accent: "accent-fin",
    who: "Finance, Admin",
    keyUses: ["Approvals", "Tracking", "Reporting"],
  },
  {
    name: "SCM",
    short: "Supply Chain Management — inventory, stock movements, locations, audit-ready tracking.",
    url: "https://scm.cotek.app",
    tag: "Inventory",
    gradient: "grad-scm",
    glow: "glow-scm",
    accent: "accent-scm",
    who: "Inventory, Operations, Admin",
    keyUses: ["Items & assets", "Stock movements", "Traceability"],
  },
  {
    name: "PMS",
    short: "Project Management System — planning, execution, timelines, and resource control.",
    url: "https://pms.cotek.app",
    tag: "Projects",
    gradient: "grad-pms",
    glow: "glow-pms",
    accent: "accent-pms",
    who: "Project Managers, Operations, Admin",
    keyUses: ["Project planning", "Task scheduling", "Resource allocation"],
  },
];

type StatusRow = {
  key: "BMS" | "HR" | "FIN" | "SCM" | "PMS";
  url: string;
  ok: boolean;
  status: number;
  ms: number;
};

type StatusPayload = {
  checkedAt: string;
  results: StatusRow[];
};

function Icon({ kind }: { kind: "bms" | "hr" | "fin" | "scm" | "pms" }) {
  if (kind === "pms") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
        <path d="M4 6h16M4 12h10M4 18h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    );
  }
  // existing icons unchanged
  return null as any;
}

function statusLabel(s?: StatusRow) {
  if (!s) return { text: "Checking…", cls: "st-wait" };
  if (s.ok) return { text: `Online • ${s.ms}ms`, cls: "st-ok" };
  if (s.status) return { text: `Degraded • ${s.status}`, cls: "st-warn" };
  return { text: "Offline", cls: "st-bad" };
}

export default function Home() {
  const [status, setStatus] = useState<Record<string, StatusRow | undefined>>({});
  const [checkedAt, setCheckedAt] = useState("");

  const fetchStatus = async () => {
    const res = await fetch("/api/status", { cache: "no-store" });
    const data = (await res.json()) as StatusPayload;
    const map: Record<string, StatusRow> = {};
    data.results.forEach((r) => (map[r.key] = r));
    setStatus(map);
    setCheckedAt(data.checkedAt);
  };

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="page">
      <div className="container">
        <header className="top">
          <div className="brand">
            <div className="logo">
              <img src={LOGO_SRC} className="logo-img" alt="COTEK" />
            </div>
            <div>
              <div className="brand-title">COTEK Portal</div>
              <div className="brand-sub">Five platforms, one launchpad — pick your orbit.</div>
            </div>
          </div>
        </header>

        <section className="cards cards-5">
          {APPS.map((app) => {
            const row = status[app.name as keyof typeof status];
            const st = statusLabel(row);

            return (
              <Link key={app.name} href={app.url} target="_blank" className={`app-card ${app.glow}`}>
                <div className={`app-banner ${app.gradient}`} />
                <div className="app-body">
                  <h2>{app.name}</h2>
                  <div className={`status-pill ${st.cls}`}>{st.text}</div>
                  <p>{app.short}</p>
                </div>
              </Link>
            );
          })}
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} COTEK • Unified operational intelligence
        </footer>
      </div>
    </main>
  );
}
