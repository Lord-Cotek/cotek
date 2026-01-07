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
};

const APPS: AppCard[] = [
  {
    name: "BMS",
    short: "Business Management System — sales flow, ops, delivery pulse.",
    url: "https://bms.cotek.app",
    tag: "Operations",
    gradient: "grad-bms",
    glow: "glow-bms",
    accent: "accent-bms",
  },
  {
    name: "HR",
    short: "People platform — employees, leave, documents, training & goals.",
    url: "https://hr.cotek.app",
    tag: "People",
    gradient: "grad-hr",
    glow: "glow-hr",
    accent: "accent-hr",
  },
  {
    name: "FIN",
    short: "Finance platform — numbers, approvals, tracking, visibility.",
    url: "https://fin.cotek.app",
    tag: "Finance",
    gradient: "grad-fin",
    glow: "glow-fin",
    accent: "accent-fin",
  },
];

function Icon({ kind }: { kind: "bms" | "hr" | "fin" }) {
  if (kind === "bms") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
        <path
          d="M7 7h10M7 12h6M7 17h10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.7"
        />
      </svg>
    );
  }
  if (kind === "hr") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
        <path
          d="M16 11a4 4 0 1 0-8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 20a8 8 0 0 1 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
      <path
        d="M4 19V5M20 19V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M7 16l3-3 3 2 4-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 19h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);

  return { msg, setMsg };
}

export default function Home() {
  const { msg, setMsg } = useToast();

  const linksText = useMemo(() => {
    return APPS.map((a) => `${a.name}: ${a.url}`).join("\n");
  }, []);

  // Keyboard shortcuts: 1,2,3
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "1") window.open(APPS[0].url, "_blank", "noreferrer");
      if (e.key === "2") window.open(APPS[1].url, "_blank", "noreferrer");
      if (e.key === "3") window.open(APPS[2].url, "_blank", "noreferrer");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openAll = () => {
    APPS.forEach((a) => window.open(a.url, "_blank", "noreferrer"));
    setMsg("Opened all apps");
  };

  const copyLinks = async () => {
    try {
      await navigator.clipboard.writeText(linksText);
      setMsg("Copied links to clipboard");
    } catch {
      setMsg("Could not copy (browser blocked)");
    }
  };

  return (
    <main className="page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      <div className="grid-overlay" />

      <div className="container">
        <header className="top fade-in">
          <div className="brand">
            <div className="logo">
              <span className="logo-dot" />
            </div>
            <div className="brand-text">
              <div className="brand-title">COTEK Portal</div>
              <div className="brand-sub">
                Three platforms, one launchpad — pick your orbit.
              </div>
            </div>
          </div>

          <div className="header-actions">
            {/* ✅ Updated email */}
            <a className="chip" href="mailto:tcotek@amrome.com">
              Need access?
            </a>
            <a className="chip chip-ghost" href="mailto:support@cotek.app">
              Support
            </a>
          </div>
        </header>

        {/* Quick actions */}
        <section className="quick fade-in">
          <button className="qbtn" onClick={openAll} type="button">
            Open all apps
            <span className="kbd">⇧</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={copyLinks} type="button">
            Copy links
            <span className="kbd">⌘</span>
          </button>
          <div className="qhint">
            Shortcuts: <span className="kbd">1</span> BMS{" "}
            <span className="kbd">2</span> HR <span className="kbd">3</span> FIN
          </div>
        </section>

        <section className="dash fade-in">
          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Platforms</div>
              <div className="kpi-value">3</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Single entry point
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Role-based access inside each app
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Security</div>
              <div className="kpi-value">RBAC</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Login required per platform
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Least-privilege by design
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Status</div>
              <div className="kpi-value live">
                <span className="pulse" /> Live
              </div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Vercel hosted
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Global edge delivery
              </div>
            </div>
          </div>
        </section>

        <section className="cards">
          {APPS.map((app) => {
            const kind =
              app.name === "BMS" ? "bms" : app.name === "HR" ? "hr" : "fin";

            return (
              <Link
                key={app.name}
                href={app.url}
                className={`app-card ${app.glow} fade-in`}
                target="_blank"
                rel="noreferrer"
              >
                <div className={`app-banner ${app.gradient}`} />
                <div className="app-body">
                  <div className="app-topline">
                    <div className={`app-icon ${app.accent}`}>
                      <Icon kind={kind} />
                    </div>

                    <div className="app-pill">
                      <span className="pill-dot" /> {app.tag}
                    </div>
                  </div>

                  <div className="app-title-row">
                    <h2 className="app-title">{app.name}</h2>
                    <span className="open-pill">Open</span>
                  </div>

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
          <div className="footer-left">
            <span className="footer-mark" />
            <span>
              © {new Date().getFullYear()} COTEK • A tidy index for fast human
              routing.
            </span>
          </div>
          <div className="footer-right">
            <span className="footnote">
              If you can’t access an app, your role may not be enabled.
            </span>
          </div>
        </footer>
      </div>

      {/* toast */}
      <div className={`toast ${msg ? "toast-show" : ""}`} aria-live="polite">
        {msg ?? ""}
      </div>
    </main>
  );
}
