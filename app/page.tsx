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
    keyUses: ["Sales leads & logs", "Pipeline hygiene", "Project tracking & delivery cues"],
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
    keyUses: ["Employee directory", "Leave workflows", "Docs, training & goals"],
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
    keyUses: ["Tracking & approvals", "Visibility & reporting", "Operational finance"],
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
    keyUses: ["Items & assets", "Stock movements", "Locations, vendors & traceability"],
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

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);

  return { msg, setMsg };
}

function statusLabel(s?: StatusRow) {
  if (!s) return { text: "Checking…", cls: "st-wait" };
  if (s.ok) return { text: `Online • ${s.ms}ms`, cls: "st-ok" };
  if (s.status) return { text: `Degraded • ${s.status}`, cls: "st-warn" };
  return { text: "Offline", cls: "st-bad" };
}

export default function Home() {
  const { msg, setMsg } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const linksText = useMemo(() => APPS.map((a) => `${a.name}: ${a.url}`).join("\n"), []);
  const [status, setStatus] = useState<Record<string, StatusRow | undefined>>({});
  const [checkedAt, setCheckedAt] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const data = (await res.json()) as StatusPayload;
      const map: Record<string, StatusRow> = {};
      data.results.forEach((r) => (map[r.key] = r));
      setStatus(map);
      setCheckedAt(data.checkedAt);
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="page">
      <div className="container">
        <header className="top fade-in">
          <div className="brand">
            <div className="logo">
              <img src={LOGO_SRC} alt="COTEK" className="logo-img" />
            </div>
            <div className="brand-text">
              <div className="brand-title">COTEK Portal</div>
              <div className="brand-sub">Five platforms, one launchpad — pick your orbit.</div>
            </div>
          </div>
        </header>

        <section className="cards cards-5 fade-in">
          {APPS.map((app) => {
            const row = status[app.name as keyof typeof status];
            const st = statusLabel(row);

            return (
              <Link
                key={app.name}
                href={app.url}
                className={`app-card ${app.glow}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className={`app-banner ${app.gradient}`} />
                <div className="app-body">
                  <div className={`status-pill ${st.cls}`}>
                    <span className="st-dot" />
                    {st.text}
                  </div>
                  <h2 className="app-title">{app.name}</h2>
                  <p className="app-desc">{app.short}</p>
                  <div className="app-footer">
                    <div className="url">{app.url.replace("https://", "")}</div>
                    <div className="hint">Opens in new tab →</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <footer className="footer fade-in">
          © {new Date().getFullYear()} COTEK • Unified operational intelligence
        </footer>
      </div>

      <div className={`toast ${msg ? "toast-show" : ""}`}>{msg}</div>
    </main>
  );
}
